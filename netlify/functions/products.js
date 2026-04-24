const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://bachgtlwmaroytvhhvfn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhY2hndGx3bWFyb3l0dmhodmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTQ4MDAsImV4cCI6MjA5MDA3MDgwMH0.J8ajqwCRrAPLkfYMuXYWs82eO6x6s4A_HteoqOtNFFI";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { nome, descricao_completa, preco, images, categoria, status, tamanhos, numeracao } = body;
      const novoProduto = { nome, descricao_completa, preco, images, categoria, status };
      if (categoria === 'vestuario' && tamanhos) novoProduto.tamanhos = tamanhos;
      if (categoria === 'calcados' && numeracao) novoProduto.numeracao = numeracao;
      const { data, error } = await supabase.from('produtos').insert([novoProduto]).select();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'PUT') {
      const id = event.queryStringParameters.id;
      const body = JSON.parse(event.body);
      const { data, error } = await supabase
        .from('produtos')
        .update(body)
        .eq('id', id)
        .select();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters.id;
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: 'Method not allowed' };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};