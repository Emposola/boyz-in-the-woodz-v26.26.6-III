import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('NEWSLETTER_FROM_EMAIL') ?? 'noreply@boyzinthewoodz.com';
const FROM_NAME = 'BOYZ IN THE WOODZ';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const BASE_URL = Deno.env.get('PUBLIC_BASE_URL') ?? 'http://localhost:5173';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-supabase-auth',
};

function htmlTemplate(content, unsubscribeUrl = '') {
  return `<!DOCTYPE html>
<html><body style="font-family:Inter,sans-serif;margin:0;padding:0;background:#0f0f0f;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;color:#f1f5f9;">
<div style="text-align:center;margin-bottom:32px;">
<div style="font-size:28px;letter-spacing:4px;color:#2D5A27;font-weight:700;">BOYZ IN THE WOODZ</div>
<div style="font-size:11px;letter-spacing:3px;color:#D2B48C;margin-top:4px;">Brotherhood. Freedom. Nature.</div>
</div>
${content}
${unsubscribeUrl ? `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #1e293b;font-size:11px;color:#64748b;text-align:center;"><a href="${unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a></div>` : ''}
</div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const body = await req.json();
    const { action, campaign_id, email: singleEmail } = body;

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Welcome email ---
    if (action === 'welcome') {
      if (!singleEmail) throw new Error('Email required');

      const html = htmlTemplate(`
        <h1 style="font-size:22px;margin-bottom:16px;">Welcome to the Brotherhood</h1>
        <p style="color:#94a3b8;line-height:1.7;margin-bottom:16px;">You're now on the list. Expect drops on retreat openings, gear releases, Brotherhood stories, and things we'd never post anywhere else.</p>
        <p style="color:#94a3b8;line-height:1.7;margin-bottom:24px;">No spam. No noise. Just brotherhood.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${BASE_URL}/shop" style="display:inline-block;background:#2D5A27;color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Explore the Shop</a>
        </div>`, `${BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(singleEmail)}`);

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: singleEmail, subject: 'Welcome to the Brotherhood', html }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        throw new Error('Resend API error: ' + err.slice(0, 200));
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Broadcast campaign ---
    if (action === 'broadcast') {
      if (!campaign_id) throw new Error('campaign_id required');
      if (!SUPABASE_SERVICE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

      const { data: campaign, error: campErr } = await supabase
        .from('newsletter_campaigns').select('*').eq('id', campaign_id).single();
      if (campErr || !campaign) throw new Error('Campaign not found');

      const { data: subscribers } = await supabase
        .from('newsletter_subscribers').select('email').eq('active', true);
      if (!subscribers?.length) throw new Error('No active subscribers');

      const emails = subscribers.map(s => s.email);
      const CHUNK_SIZE = 50;
      let sent = 0;

      for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
        const chunk = emails.slice(i, i + CHUNK_SIZE);
        const payload = chunk.map(email => ({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: campaign.subject,
          html: htmlTemplate(campaign.body_html, `${BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`),
        }));

        try {
          const res = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const result = await res.json();
            sent += Array.isArray(result) ? result.filter(r => r?.id).length : chunk.length;
          } else {
            const errText = await res.text();
            console.error(`Batch send error (chunk ${i / CHUNK_SIZE}):`, errText.slice(0, 300));
          }
        } catch (e) {
          console.error(`Batch send exception (chunk ${i / CHUNK_SIZE}):`, e.message);
        }

        if (i + CHUNK_SIZE < emails.length) {
          await new Promise(r => setTimeout(r, 200));
        }
      }

      await supabase.from('newsletter_campaigns')
        .update({ status: 'sent', sent_at: new Date().toISOString(), recipient_count: sent })
        .eq('id', campaign_id);

      return new Response(JSON.stringify({ ok: true, sent }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Test send (send to a single email for preview) ---
    if (action === 'test_send') {
      const { email: testEmail, campaign_id: testCampaignId } = body;
      if (!testEmail || !testCampaignId) throw new Error('email and campaign_id required');

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { data: campaign } = await supabase
        .from('newsletter_campaigns').select('*').eq('id', testCampaignId).single();
      if (!campaign) throw new Error('Campaign not found');

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: testEmail,
          subject: `[TEST] ${campaign.subject}`,
          html: htmlTemplate(campaign.body_html, `${BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(testEmail)}`),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error('Test send failed: ' + err.slice(0, 200));
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Unsubscribe ---
    if (action === 'unsubscribe') {
      if (!singleEmail) throw new Error('Email required');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase.from('newsletter_unsubscribes').insert({ email: singleEmail });
      await supabase.from('newsletter_subscribers').update({ active: false }).eq('email', singleEmail);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    throw new Error('Unknown action. Use: welcome, broadcast, unsubscribe, test_send');
  } catch (err) {
    console.error('send-newsletter error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
