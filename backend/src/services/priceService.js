'use strict'

const BASE_URL = 'https://api.api-ninjas.com/v1/commodityprice'

async function fetchPrice(apiKey) {
  try {
    const res = await fetch(`${BASE_URL}?name=${apiKey}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.price ?? null
  } catch {
    return null
  }
}

module.exports = { fetchPrice }
