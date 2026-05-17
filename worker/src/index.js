'use strict';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_SCORE = 10_000_000;
const TOP_N     = 100;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const { pathname } = new URL(request.url);
    if (pathname !== '/scores') return new Response('Not found', { status: 404, headers: CORS });

    if (request.method === 'GET')  return handleGet(env);
    if (request.method === 'POST') return handlePost(request, env);

    return new Response('Method not allowed', { status: 405, headers: CORS });
  },
};

async function handleGet(env) {
  const raw    = await env.SCORES.get('leaderboard');
  const scores = raw ? JSON.parse(raw) : [];
  return Response.json(scores, {
    headers: { ...CORS, 'Cache-Control': 'public, max-age=30' },
  });
}

async function handlePost(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return new Response('Invalid JSON', { status: 400, headers: CORS }); }

  const name  = String(body.name ?? '').trim().toUpperCase().slice(0, 20) || 'ANONYMOUS';
  const score = Math.round(Number(body.score));
  const op    = Math.min(4, Math.max(1, parseInt(body.op)   || 1));
  const days  = Math.max(1,            parseInt(body.days)  || 1);

  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
    return new Response('Score out of range', { status: 400, headers: CORS });
  }

  const raw    = await env.SCORES.get('leaderboard');
  const scores = raw ? JSON.parse(raw) : [];

  const entry  = { name, score, op, days, ts: Date.now() };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, TOP_N);

  await env.SCORES.put('leaderboard', JSON.stringify(top));

  const rank = top.findIndex(s => s.ts === entry.ts) + 1;
  return Response.json({ rank: rank || null }, { headers: CORS });
}
