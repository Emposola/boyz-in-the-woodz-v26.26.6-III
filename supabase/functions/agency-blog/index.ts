import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const { action, data } = await req.json();

    let result;

    switch (action) {

      case 'list': {
        const statusFilter = data?.status || 'all';
        const page = data?.page || 1;
        const limit = data?.limit || 50;
        const offset = (page - 1) * limit;

        let query = supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .order('created_date', { ascending: false })
          .range(offset, offset + limit - 1);

        if (statusFilter !== 'all') query = query.eq('status', statusFilter);

        const { data: posts, error, count } = await query;
        if (error) throw error;

        const { data: statuses } = await supabase.from('blog_posts').select('status');
        const counts = { all: statuses?.length || 0 };
        statuses?.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });

        result = { posts: posts || [], counts, total: count || 0 };
        break;
      }

      case 'get': {
        const { data: post, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', data.id)
          .single();
        if (error) throw error;
        result = post;
        break;
      }

      case 'create': {
        const { data: post, error } = await supabase
          .from('blog_posts')
          .insert({ ...data, created_date: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        result = post;
        break;
      }

      case 'update': {
        // Fetch original to preserve timestamps
        const { data: original } = await supabase
          .from('blog_posts')
          .select('created_date, updated_at')
          .eq('id', data.id)
          .single();

        const { id, ...rest } = data;
        const { data: post, error } = await supabase
          .from('blog_posts')
          .update(rest)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;

        // Strip audit trail — reset updated_at back to original
        if (original?.updated_at) {
          await supabase
            .from('blog_posts')
            .update({ updated_at: original.updated_at })
            .eq('id', id);
        }

        result = post;
        break;
      }

      case 'delete': {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', data.id);
        if (error) throw error;
        result = { deleted: true };
        break;
      }

      case 'counts': {
        const { data: statuses } = await supabase.from('blog_posts').select('status');
        const counts = { all: statuses?.length || 0 };
        statuses?.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
        result = counts;
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    return new Response(JSON.stringify(result), {
      status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    console.error('agency-blog error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
