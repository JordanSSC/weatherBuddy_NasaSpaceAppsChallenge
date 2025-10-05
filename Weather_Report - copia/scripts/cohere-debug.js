// Simple local debug tool to try multiple Cohere Chat payload shapes.
// Usage:
//   node scripts/cohere-debug.js
// Requires COHERE_API_KEY in environment or ../secrets.local.js exporting COHERE_API_KEY.

(async () => {
  // pick up key from env or local secrets
  let apiKey = process.env.COHERE_API_KEY;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require('../secrets.local');
    apiKey = apiKey || local?.COHERE_API_KEY || local?.COHERE_KEY;
  } catch (e) {}

  if (!apiKey) {
    console.error('COHERE_API_KEY not found in env or secrets.local.js');
    process.exitCode = 2;
    return;
  }

  const url = 'https://api.cohere.ai/v1/chat';

  // First, list available models for this API key to help diagnose compatibility
  try {
    const modelsRes = await fetch('https://api.cohere.ai/v2/models', { headers: { Authorization: `Bearer ${apiKey}` } });
    const modelsText = await modelsRes.text();
    console.log('\nAvailable models (raw):', modelsText.substring(0, 5000));
  } catch (e) {
    console.warn('Could not fetch models list:', String(e));
  }

  const system = 'Eres un asistente de prueba. Responde de forma breve.';
  const user = 'Hola, ¿qué tiempo hace?';

  const payloads = [
    { name: 'content-output_text-array', body: { model: 'command-a-03-2025', messages: [ { role: 'system', content: [{ type: 'output_text', text: system }] }, { role: 'user', content: [{ type: 'output_text', text: user }] } ], max_tokens: 200 } },
    { name: 'content-message-array', body: { model: 'command-a-03-2025', messages: [ { role: 'system', content: [{ type: 'message', text: system }] }, { role: 'user', content: [{ type: 'message', text: user }] } ], max_tokens: 200 } },
    { name: 'content-text-array', body: { model: 'command-a-03-2025', messages: [ { role: 'system', content: [{ type: 'text', text: system }] }, { role: 'user', content: [{ type: 'text', text: user }] } ], max_tokens: 200 } },
    { name: 'content-text-string', body: { model: 'command-a-03-2025', messages: [ { role: 'system', content: system }, { role: 'user', content: user } ], max_tokens: 200 } },
    { name: 'input-fallback', body: { model: 'command-a-03-2025', input: system + '\n\n' + user, max_tokens: 200 } },
  ];

  for (const p of payloads) {
    console.log('\n=== Trying payload:', p.name, '===');
    try {
      console.log('Request body preview:', JSON.stringify(p.body, (k, v) => (k === 'content' ? (Array.isArray(v) ? v.map(x => (x.text || x)) : v) : v), 2).slice(0, 1000));
      const res = await fetch('https://api.cohere.ai/v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(p.body),
      });

      const text = await res.text();
      console.log('Status:', res.status);
      console.log('Body:', text.substring(0, 5000));
    } catch (err) {
      console.error('Request failed:', String(err));
    }
  }

  // Try the generate endpoint as a fallback
  console.log('\n=== Trying /v1/generate fallback ===');
  try {
    const genBody = { model: 'command-a-03-2025', input: system + '\n\n' + user, max_tokens: 200 };
  const res = await fetch('https://api.cohere.ai/v2/generate', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(genBody) });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text.substring(0, 5000));
  } catch (e) {
    console.error('Generate request failed:', String(e));
  }

  console.log('\nDone testing payloads.');
})();
