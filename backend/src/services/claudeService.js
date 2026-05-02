'use strict'
const Anthropic = require('@anthropic-ai/sdk')

const SYSTEM_PROMPT = `You are a commodity market educator. Return ONLY valid JSON matching this exact schema — no markdown, no explanation, no text before or after the JSON:
{
  "what_it_is": "2-3 sentences: what the commodity is and where it comes from",
  "why_it_matters": "1-2 sentences: global economic importance",
  "brief_history": "2-3 sentences: how it became a traded commodity",
  "who_trades_it": [
    {"type": "Producers", "description": "..."},
    {"type": "Commercial Buyers", "description": "..."},
    {"type": "Investors & Institutions", "description": "..."},
    {"type": "Individual Investors", "description": "..."}
  ],
  "key_facts": ["surprising fact 1", "surprising fact 2", "surprising fact 3"],
  "related_commodities": ["slug1", "slug2", "slug3"]
}
Tone: approachable and educational. No unexplained jargon. Written for someone with no finance background.`

async function getAIContent(commodityName, categoryName, unit) {
  const client = new Anthropic()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Generate educational content for: ${commodityName}. Category: ${categoryName}. Unit: ${unit}.`,
      },
    ],
  })
  return JSON.parse(response.content[0].text)
}

module.exports = { getAIContent }
