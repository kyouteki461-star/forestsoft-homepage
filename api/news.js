// Supabase設定
const { createClient } = require('@supabase/supabase-js');

// 環境変数から設定を読み込む
const supabaseUrl = process.env.SUPABASE_URL || 'https://huatolfthmihcpzjpyipd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1YXRvbGZ0aG1pY3B6anB5aXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0Nzg4NzUsImV4cCI6MjA3MzUwMDg3NX0._';

// Supabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORSヘルパー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (req, res) => {
  // プリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).end();
  }

  res.set(corsHeaders);

  try {
    switch (req.method) {
      case 'GET':
        // ニュースデータの取得
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return res.json({
          success: true,
          data: data || [],
          count: data ? data.length : 0
        });

      case 'POST':
        // ニュースデータの作成
        const body = req.body;

        if (!body.title || !body.date || !body.content) {
          return res.status(400).json({
            success: false,
            error: 'title, date, content は必須です'
          });
        }

        const { data: newData, error: insertError } = await supabase
          .from('news')
          .insert([{
            title: body.title,
            date: body.date,
            content: body.content
          }])
          .select();

        if (insertError) throw insertError;

        return res.json({
          success: true,
          message: 'ニュースが作成されました',
          data: newData
        });

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};