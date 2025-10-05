Cohere setup

This project uses Cohere for demo chat responses. Quick setup:

1) Development (quick):

- Create `secrets.local.js` at project root (gitignored). Example:

```js
module.exports = {
  COHERE_API_KEY: 'your-cohere-key',
  // Optional: if you run an API proxy
  OPENAI_PROXY_URL: 'http://localhost:3000'
};
```

- Restart Expo: `npx expo start -c`

2) Env variable (alternative):

```powershell
$env:COHERE_API_KEY = 'your-cohere-key'
npx expo start -c
```

3) Production: never embed the key in the client. Use a backend/proxy that stores the key in server env vars and forwards requests.

Notes:
- The helper is `lib/cohereApi.ts` and the chat UI calls `getCohereResponse(weather, userMessage)`.
- The prompt includes a short summary of the weather report so the responses are context-aware.
