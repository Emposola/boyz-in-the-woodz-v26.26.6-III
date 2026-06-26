import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('NEWSLETTER_FROM_EMAIL') ?? 'newsletter@boyzinthewoodz.com';
const FROM_NAME = 'BOYZ IN THE WOODZ';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const BASE_URL = Deno.env.get('PUBLIC_BASE_URL') ?? 'http://localhost:5173';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-supabase-auth',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const { action, campaign_id, email: singleEmail } = await req.json();

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // --- Welcome email ---
    if (action === 'welcome') {
      if (!singleEmail) throw new Error('Email required for welcome');

      const html = `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0f0f0f; color: #f1f5f9;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 28px; letter-spacing: 4px; color: #2D5A27; font-weight: 700;">BOYZ IN THE WOODZ</div>
            <div style="font-size: 11px; letter-spacing: 3px; color: #D2B48C; margin-top: 4px;">Brotherhood. Freedom. Nature.</div>
          </div>
          <h1 style="font-size: 22px; margin-bottom: 16px;">Welcome to the Brotherhood</h1>
          <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 16px;">
            You're now on the list. Expect drops on retreat openings, gear releases, Brotherhood stories, and things we'd never post anywhere else.
          </p>
          <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">
            No spam. No noise. Just brotherhood.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${BASE_URL}/shop" style="display: inline-block; background: #2D5A27; color: #fff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Explore the Shop</a>
          </div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center;">
            <a href="${BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(singleEmail)}" style="color: #64748b;">Unsubscribe</a>
          </div>
        </div>`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: singleEmail,
          subject: 'Welcome to the Brotherhood',
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Broadcast campaign ---
    if (action === 'broadcast') {
      if (!campaign_id) throw new Error('campaign_id required');

      const { data: campaign } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', campaign_id)
        .single();

      if (!campaign) throw new Error('Campaign not found');

      const { data: subscribers } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('active', true);

      if (!subscribers?.length) throw new Error('No active subscribers');

      const emails = subscribers.map(s => s.email);
      const batchSize = 50;
      let sent = 0;

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: FROM_EMAIL,
            bcc: batch,
            subject: campaign.subject,
            html: campaign.body_html + `<div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              <a href="${BASE_URL}/newsletter/unsubscribe?email={{email}}" style="color: #94a3b8;">Unsubscribe</a>
            </div>`,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error('Batch send error:', err);
          continue;
        }
        sent += batch.length;
      }

      await supabase
        .from('newsletter_campaigns')
        .update({ status: 'sent', sent_at: new Date().toISOString(), recipient_count: sent })
        .eq('id', campaign_id);

      return new Response(JSON.stringify({ ok: true, sent }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Unsubscribe ---
    if (action === 'unsubscribe') {
      if (!singleEmail) throw new Error('Email required');

      await supabase.from('newsletter_unsubscribes').insert({ email: singleEmail });
      await supabase.from('newsletter_subscribers').update({ active: false }).eq('email', singleEmail);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    throw new Error('Unknown action. Use: welcome, broadcast, or unsubscribe');
  } catch (err) {
    console.error('send-newsletter error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
