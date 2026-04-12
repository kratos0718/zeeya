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

/* ─────────────────────────────────────────────
   PHASE 2 — Insurance Advisor
───────────────────────────────────────────── */
export async function getInsuranceAdvice({ profession, age, monthlySavings, existingCover }) {
  const INSURANCE_PROMPT = `You are ZEEYA's Insurance Advisor — an expert on Indian insurance products for young professionals.

Rules:
- Recommend REAL Indian insurance plans: Star Health, Niva Bupa, LIC, HDFC Ergo, ICICI Lombard, Tata AIG, Care Health, Bajaj Allianz
- Always recommend in this order: 1) Health Insurance first (most critical), 2) Term Life (if employed), 3) Personal Accident cover
- Give specific plan names, annual premiums in ₹, and sum insured amounts
- Be practical about what they can actually afford from their savings
- Format your response as JSON with this exact structure:
{
  "summary": "2-sentence personalized advice",
  "plans": [
    {
      "type": "Health Insurance",
      "priority": "Critical",
      "recommended": "Plan Name by Insurer",
      "annualPremium": "₹X,XXX/year",
      "sumInsured": "₹X lakh",
      "why": "One sentence reason",
      "claimSettlement": "XX%"
    }
  ],
  "tip": "One practical tip about insurance for their profile"
}
- Return ONLY valid JSON, no other text.`

  const userMsg = `My profile:
- Profession: ${profession}
- Age: ${age} years
- Monthly savings: ₹${monthlySavings}
- Existing insurance: ${existingCover || 'None'}

Recommend the best insurance plans for me.`

  if (!process.env.ANTHROPIC_API_KEY) {
    // Return realistic demo data
    return {
      summary: `As a ${profession} aged ${age}, your biggest risk right now is a medical emergency wiping out your savings. A ₹5L health policy costs less than ₹500/month — that's your most urgent financial shield.`,
      plans: [
        {
          type: 'Health Insurance',
          priority: 'Critical',
          recommended: 'Star Health Young Star by Star Health',
          annualPremium: '₹4,800/year',
          sumInsured: '₹5 lakh',
          why: 'Best for under-35s, covers pre & post hospitalization, zero co-pay',
          claimSettlement: '94.4%',
        },
        {
          type: 'Personal Accident',
          priority: 'High',
          recommended: 'Tata AIG Personal Accident',
          annualPremium: '₹1,200/year',
          sumInsured: '₹10 lakh',
          why: 'Covers accidental death, disability, and hospitalization from accidents',
          claimSettlement: '96%',
        },
        {
          type: 'Term Life Insurance',
          priority: 'Recommended',
          recommended: 'LIC Tech Term',
          annualPremium: '₹6,500/year',
          sumInsured: '₹50 lakh',
          why: 'Cheapest age to buy term is NOW — lock in low premiums before 30',
          claimSettlement: '98.6%',
        },
      ],
      tip: `Pay annually, not monthly — you save 10–15% on premiums. At ₹${monthlySavings} savings/month, set aside ₹1,000 specifically for insurance each month.`,
    }
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
      max_tokens: 800,
      system: INSURANCE_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  try {
    return JSON.parse(data.content[0].text)
  } catch {
    return null
  }
}

/* ─────────────────────────────────────────────
   PHASE 2 — Trip Planner
───────────────────────────────────────────── */
export async function getTripPlan({ budget, duration, vibe, fromCity, travelers }) {
  const TRIP_PROMPT = `You are ZEEYA's Trip Planner — an expert on budget travel across India for young professionals.

Rules:
- Suggest REAL Indian destinations based on budget, duration, vibe, and departure city
- Include transport cost, accommodation cost, food cost, activities cost — all in ₹
- Suggest 3 trips: one "Budget Pick", one "Best Value", one "Stretch Pick"
- Format your response as JSON with this exact structure:
{
  "trips": [
    {
      "label": "Budget Pick",
      "destination": "City, State",
      "tagline": "One catchy line",
      "totalCost": "₹X,XXX per person",
      "breakdown": {
        "transport": "₹X,XXX (train/bus/flight)",
        "stay": "₹X,XXX (hostel/hotel)",
        "food": "₹X,XXX",
        "activities": "₹X,XXX"
      },
      "highlights": ["thing 1", "thing 2", "thing 3"],
      "bestTime": "Month range",
      "zeeyaTip": "One money-saving tip specific to this trip"
    }
  ],
  "savingsTip": "One tip on how to save up for the trip from monthly savings"
}
- Return ONLY valid JSON, no other text.`

  const userMsg = `My trip preferences:
- Budget: ₹${budget} total for the trip
- Duration: ${duration}
- Vibe: ${vibe}
- Departing from: ${fromCity}
- Travelers: ${travelers}

Suggest 3 trip options within my budget.`

  if (!process.env.ANTHROPIC_API_KEY) {
    const budgetNum = parseInt(budget.replace(/,/g, ''), 10) || 5000
    return {
      trips: [
        {
          label: 'Budget Pick',
          destination: 'Pondicherry, Tamil Nadu',
          tagline: 'French vibes, beach walks, ₹120 filter coffee',
          totalCost: `₹${Math.round(budgetNum * 0.55).toLocaleString('en-IN')} per person`,
          breakdown: {
            transport: '₹800 (train from Chennai or bus)',
            stay: '₹700/night (Zostel or Heritage guesthouse)',
            food: '₹400/day (street food + cafés)',
            activities: '₹500 total (beaches are free)',
          },
          highlights: ['Promenade Beach at sunrise', 'Auroville meditation dome', 'French Quarter walk'],
          bestTime: 'October–March',
          zeeyaTip: 'Book Mandapam–Villupuram trains 30 days ahead on IRCTC to get ₹400 tickets instead of ₹1,200 buses.',
        },
        {
          label: 'Best Value',
          destination: 'Coorg, Karnataka',
          tagline: 'Coffee estates, misty hills, zero stress',
          totalCost: `₹${Math.round(budgetNum * 0.75).toLocaleString('en-IN')} per person`,
          breakdown: {
            transport: '₹1,200 (KSRTC bus from Bangalore)',
            stay: '₹1,500/night (homestay with meals)',
            food: '₹300/day (homestay includes breakfast)',
            activities: '₹800 (waterfall + estate tour)',
          },
          highlights: ['Abbey Falls trek', 'Coffee estate walk & tasting', 'Raja\'s Seat sunset'],
          bestTime: 'September–May',
          zeeyaTip: 'Homestays here include breakfast + dinner — saves ₹600/day vs eating out. Book via Airbnb for 20% off vs walk-in.',
        },
        {
          label: 'Stretch Pick',
          destination: 'Spiti Valley, Himachal Pradesh',
          tagline: 'The trip that changes how you see money',
          totalCost: `₹${Math.round(budgetNum * 1.1).toLocaleString('en-IN')} per person`,
          breakdown: {
            transport: '₹2,500 (Volvo to Manali + jeep share)',
            stay: '₹600/night (monastery guesthouses)',
            food: '₹350/day (momos + thukpa)',
            activities: '₹1,500 (jeep safari + permits)',
          },
          highlights: ['Key Monastery (4,166m)', 'Chandratal Lake camping', 'Kibber village'],
          bestTime: 'June–October only',
          zeeyaTip: 'Share a Manali–Kaza jeep with other travelers (₹900/seat vs ₹4,500 private). Find co-travelers on Spiti Valley Travelers Facebook group.',
        },
      ],
      savingsTip: `Set aside ₹${Math.round(budgetNum / 4).toLocaleString('en-IN')}/month for 4 months — your trip is fully funded without touching savings. Create a "Trip Fund" on ZEEYA and we'll remind you every month.`,
    }
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
      max_tokens: 1000,
      system: TRIP_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  try {
    return JSON.parse(data.content[0].text)
  } catch {
    return null
  }
}
