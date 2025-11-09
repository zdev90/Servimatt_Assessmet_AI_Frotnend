import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. Set it in server/.env');
}

// Basic health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// POST /api/ai
// Body: { prompt: string, model?: string }
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, model } = req.body as { prompt?: string; model?: string };
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const chosenModel = model || 'gpt-4o-mini'; // change if needed

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: chosenModel,
        input: prompt
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Upstream error', details: text });
    }

    const json = await response.json();

    // Normalize assistant text from Responses API
    let assistantText = '';
    const outputText = (json as any)?.output_text;
    if (typeof outputText === 'string' && outputText.trim()) {
      assistantText = outputText;
    } else {
      assistantText =
        (json as any)?.output?.[0]?.content?.[0]?.text ??
        JSON.stringify(json);
    }

    res.json({
      model: chosenModel,
      content: assistantText
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err?.message ?? String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy listening on http://localhost:${PORT}`);
});
