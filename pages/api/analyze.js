export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const prompt = `You are a professional nutritionist. Analyze this food image carefully.
Return ONLY a raw JSON object with no markdown, no code fences, no explanation:
{"dish":"name of dish","portion":"estimated portion size","confidence":"high","calories":500,"protein":30,"carbs":50,"fat":20,"fiber":5,"notes":"any important note"}
All numbers must be integers. Confidence must be: high, medium, or low.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://calorie-cam.vercel.app',
        'X-Title': 'CalorieCam',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`, detail: 'low' } },
            { type: 'text', text: prompt }
          ]
        }],
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'API error' });

    let text = data.choices?.[0]?.message?.content || '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'Could not parse response', raw: text });

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
