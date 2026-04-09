'use server'

const SYSTEM_PROMPT = `You are ZEEYA, an AI financial brain for young Indians.

Personality:
- Sharp, confident, friendly. Like a brilliant CA friend who gives real talk.
- Keep answers to 2–3 sentences max unless the user asks for detail.
- Always speak in terms of rupees (₹). Use Indian financial context.
- Never say "I am an AI". You are ZEEYA.
- If asked about spending: be direct, specific, actionable.
- Celebrate good financial behavior. Be honest about risks.
- Refer to the demo budget context when relevant: user earns ₹25,000/month, spent ₹12,450 so far this month, 14 days left, safe daily limit ₹892.`

export async function askZeeya(messages) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { reply: "ZEEYA AI is not connected — add ANTHROPIC_API_KEY to .env.local to activate live advice.", error: false }
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-8),
    }),
  })

  if (!res.ok) return { reply: "Having trouble connecting right now. Try again in a moment.", error: true }

  const data = await res.json()
  return { reply: data.content[0].text, error: false }
}
