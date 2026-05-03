/**
 * SMB Sales Intelligence MCP Server v2.0
 * By Elisabeth Hitz - 268% quota at Criteo, Deel ($12B), HBO, Bloomberg
 * 
 * Enterprise-grade sales playbooks for AI agents
 * 
 * Deploy to Apify: apify push
 * Test locally: npx ts-node src/main.ts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ===========================================
// DISCOVERY SYSTEM
// ===========================================

const DISCOVERY_SCRIPTS = {
  professional: {
    tone: "professional",
    context: "Email, LinkedIn DM, formal settings",
    template: `Great timing — quick 2 questions before I put anything together:

1. What's the main outcome you're hoping to achieve with this?
2. What's driving the timeline — is there a launch date or deadline I should know about?

Once I have that, I'll send 3 options that fit your situation.`
  },
  warm: {
    tone: "warm",
    context: "Existing relationship, warm intro, second touchpoint",
    template: `Absolutely — 2 quick ones so I don't guess:

1. What's the main goal here?
2. Any deadline driving this?

Then I'll send options that actually fit.`
  },
  ultra_short: {
    tone: "dm",
    context: "Instagram DM, text, informal",
    template: `Quick 2 before I quote:
What's the goal? Any deadline?
Then options.`
  },
  cold_outbound: {
    tone: "cold",
    context: "First cold email or LinkedIn message",
    template: `Hi [Name],

Quick question: is [specific problem you solve] something that's on your radar right now, or is this a 'not right now' situation?

Either answer is fine — just want to know if it's worth sending more info.`
  },
  inbound_lead: {
    tone: "inbound",
    context: "Someone reached out to you first",
    template: `Thanks for reaching out! Before I dive in, 2 quick questions:

1. What prompted you to reach out now? (Helps me understand urgency)
2. Who else would be involved in this decision?

Once I know that, I'll make sure I'm showing you the right thing.`
  }
};

// ===========================================
// OBJECTION HANDLING
// ===========================================

const OBJECTION_HANDLERS = {
  too_expensive: {
    objection: "Your price is too high",
    psychology: "Price objections are rarely about price — they're about perceived value.",
    response: "Fair point — let me ask: is it the total investment that feels off, or the value relative to what you're getting? Because I can usually solve one of those.",
    if_its_the_number: "Offer Option A with reduced scope. Never discount Option B.",
    if_its_the_value: "Restate the specific ROI: 'Most clients see X within Y weeks. Would that math work for you?'",
    mistake_to_avoid: "Never immediately offer a discount — it signals your original price was fake."
  },
  no_budget: {
    objection: "We don't have budget right now",
    psychology: "This is often a polite rejection, but sometimes it's real timing.",
    response: "Makes sense — budget cycles are real. Quick question: is this 'not ever' or more 'not this quarter'? If it's timing, I'd rather hold your place than lose the conversation.",
    if_timing: "Set a specific follow-up date: 'I'll reach out [date]. Does that work?'",
    if_never: "Thank them, ask for referral: 'Totally understand. Anyone in your network who might be looking for this?'",
    mistake_to_avoid: "Don't push back on budget — you can't create money that isn't there."
  },
  need_approval: {
    objection: "I need to check with my team/boss",
    psychology: "You're talking to an influencer, not the decision-maker.",
    response: "Totally get it — is there anything I can put together that would make that conversation easier? A one-pager, ROI calc, anything?",
    follow_up: "Offer: 'Happy to jump on a quick call with them if that helps. Sometimes an outside voice makes it easier.'",
    mistake_to_avoid: "Don't bypass them to reach the boss — you'll lose the champion."
  },
  comparing_options: {
    objection: "We're looking at other vendors",
    psychology: "Good sign — they're actively buying. Make sure you're comparing apples to apples.",
    response: "Smart move — you should be. What's the main thing you're comparing on? Price, quality, turnaround, or something else?",
    follow_up: "Once you know their criteria, show how you win on that specific dimension.",
    mistake_to_avoid: "Don't trash competitors — it makes you look insecure."
  },
  bad_timing: {
    objection: "Not the right time / too busy",
    psychology: "Either a soft rejection or genuine timing issue.",
    response: "Heard. Is this 'wrong quarter' or 'wrong week'? If it's just timing, I'd rather stay on your radar than start from scratch later.",
    follow_up: "Get specific: 'When would be better? I'll set a reminder and reach out then.'",
    mistake_to_avoid: "Don't accept vague timing — pin them to a date."
  },
  already_have_someone: {
    objection: "We already work with someone",
    psychology: "Loyalty is good, but most relationships aren't exclusive.",
    response: "Nice — is that relationship locked in, or do you occasionally test new partners? Most brands I work with started as a 'test' alongside their existing team.",
    follow_up: "Offer low-risk trial: 'What if we did one small project? If it works, great. If not, no hard feelings.'",
    mistake_to_avoid: "Don't try to replace — try to complement."
  },
  send_info: {
    objection: "Can you just send your portfolio/deck/info?",
    psychology: "They're trying to skip the conversation. Don't let them.",
    response: "Absolutely — before I do, quick context question: what's the main problem you're trying to solve? Helps me send the most relevant stuff.",
    follow_up: "Always qualify before sending generic materials.",
    mistake_to_avoid: "Don't send a generic portfolio — you'll get ghosted."
  },
  need_to_think: {
    objection: "Let me think about it",
    psychology: "There's a specific blocker they're not saying.",
    response: "Of course — what's the main thing you're weighing? If it's timing, scope, or budget, I might be able to help narrow it down.",
    follow_up: "Once you identify the real blocker, address it directly.",
    mistake_to_avoid: "Don't say 'take your time' — that kills urgency."
  },
  too_soon: {
    objection: "It's too early for us to think about this",
    psychology: "They don't see the cost of waiting.",
    response: "Totally fair. Quick question: what needs to happen before this becomes a priority? I want to make sure I reach out at the right time.",
    follow_up: "Understand their buying triggers, then follow up when those triggers happen.",
    mistake_to_avoid: "Don't push — you'll burn the relationship."
  },
  ghosting: {
    objection: "No response to follow-ups",
    psychology: "They're not saying no — they're saying 'not urgent enough to respond.'",
    day_5_message: "Had a thought for your [product/campaign]: [specific idea or observation]. Want me to build that into the proposal?",
    day_7_message: "Closing the loop — reply 'A', 'B', or 'C' if you want to pick this back up. Otherwise, I'll assume timing shifted.",
    day_14_message: "Saw you just [launched X / posted Y]. If you need help with [specific thing], I have a slot this week.",
    mistake_to_avoid: "Never send 'just checking in' — it adds no value."
  }
};

// ===========================================
// FOLLOW-UP SEQUENCES
// ===========================================

const FOLLOWUP_SEQUENCES = {
  post_proposal: {
    name: "After sending proposal/quote",
    day_1: {
      timing: "24 hours",
      template: "Quick check — did you want to go with A, B, or C? Happy to lock in dates once you pick.",
      psychology: "Simple, no pressure, just asking for the decision."
    },
    day_3: {
      timing: "3 days",
      template: "Still deciding between options, or did timing shift? Either way fine — just want to make sure I hold your slot if needed.",
      psychology: "Creates scarcity without being pushy."
    },
    day_5: {
      timing: "5 days - MOST IMPORTANT",
      template: "Had a thought for your [product/campaign]: [specific idea]. Want me to build that into Option B?",
      psychology: "Adds value, shows you're thinking about their business. This reopens 30-40% of dead conversations.",
      note: "This is your highest-leverage message. Spend time making the idea specific."
    },
    day_7: {
      timing: "7 days",
      template: "Closing the loop on my end. If you want to pick this back up, reply with A, B, or C and I'll jump back in.",
      psychology: "Clean exit. Low pressure but keeps door open."
    },
    day_14: {
      timing: "14 days - optional",
      template: "Saw you just [launched X / posted about Y]. If you need [deliverable] for it, I have a slot this week. Want updated options?",
      psychology: "Re-engages with relevance to their current activity."
    }
  },
  post_call: {
    name: "After discovery/sales call",
    same_day: {
      timing: "Within 2 hours of call",
      template: "Great chatting! As discussed, here are the 3 options:\n\n[Options]\n\nLet me know which works, and I'll get things moving.",
      psychology: "Strike while the iron is hot. Speed = professionalism."
    },
    day_2: {
      timing: "2 days if no response",
      template: "Quick follow-up on the options I sent. Any questions, or are you ready to pick one?",
      psychology: "Simple nudge."
    },
    day_5: {
      timing: "5 days",
      template: "Thought about what you said re: [specific thing from call]. What if we [modified approach]? Could make Option B even more relevant.",
      psychology: "Shows you listened. References the actual conversation."
    }
  },
  cold_outbound: {
    name: "Cold outreach sequence",
    email_1: {
      timing: "Day 0",
      template: "Subject: Quick question about [their problem]\n\nHi [Name],\n\n[One line about them — not generic]\n\nI help companies like [similar company] solve [specific problem]. Is this something you're actively working on, or is this a 'not right now' situation?\n\nEither answer is fine.\n\n[Your name]",
      psychology: "Permission-based. Not asking for their time."
    },
    email_2: {
      timing: "Day 3",
      template: "Subject: Re: Quick question about [their problem]\n\n[Name] — bumping this up. Is [problem] on your radar right now?\n\nIf not, no worries at all.",
      psychology: "Short, respectful bump."
    },
    email_3: {
      timing: "Day 7",
      template: "Subject: Re: Quick question about [their problem]\n\nLast one from me — if [problem] becomes a priority later, here's a [resource/case study] that might help:\n\n[Link]\n\nGood luck with [something specific to them].",
      psychology: "Adds value, closes loop, leaves door open."
    }
  },
  revival: {
    name: "Reviving dead leads (90+ days old)",
    approach: "Reference something new — their news, your news, or market news",
    template_their_news: "Saw [Company] just [launched/raised/announced X]. Congrats! Is [original problem] still something you're thinking about? I've helped a few similar companies with it recently.",
    template_your_news: "Quick update — I just [launched/completed/achieved X]. Made me think of our earlier conversation about [topic]. Is that still on your radar?",
    template_market: "With [industry trend/event], I've been getting a lot of questions about [topic]. Thought of our earlier chat — is this something you're running into now?",
    psychology: "New context = new conversation. Never reference the old silence."
  }
};

// ===========================================
// CLOSING SYSTEM
// ===========================================

const CLOSING_SCRIPTS = {
  standard: {
    name: "Standard close",
    script: "Perfect — should I send the invoice to this email, or is there a billing contact?",
    when_to_use: "After they verbally commit to an option"
  },
  assumptive: {
    name: "Assumptive close",
    script: "Great, I'll get that set up. What email should I send the invoice to?",
    when_to_use: "When buying signals are strong but they haven't explicitly said yes"
  },
  timeline: {
    name: "Timeline close",
    script: "To hit your [deadline], I'd want to start by [date]. Should I send the invoice now so we can lock that in?",
    when_to_use: "When there's a deadline driving the decision"
  },
  scarcity: {
    name: "Scarcity close",
    script: "I have a slot opening [day] — if you want it, I can hold it with a deposit. Want me to send the link?",
    when_to_use: "When you're genuinely busy and slots are limited"
  },
  retainer: {
    name: "Retainer upsell",
    script: "A lot of my clients end up wanting ongoing work after the first project. If you want, I can include a retainer option — usually saves 15-20% vs. one-offs.",
    when_to_use: "After first project goes well, or during initial negotiation"
  },
  choice: {
    name: "Choice close",
    script: "So are you thinking Option A or Option B? Either works — just want to get you started.",
    when_to_use: "When they're stuck between options"
  },
  next_step: {
    name: "Next step close",
    script: "What would you need to see to move forward this week?",
    when_to_use: "When you're not sure what's blocking them"
  }
};

const BUYING_SIGNALS = [
  "Asks about timeline or availability",
  "Asks about payment terms or process",
  "Asks 'what happens next?'",
  "Compares Option A vs B vs C",
  "Mentions internal stakeholders or approval process",
  "Asks for references or case studies",
  "Asks about contracts or terms",
  "Leans forward, takes notes, asks follow-up questions",
  "Says 'we' instead of 'I' when discussing implementation"
];

// ===========================================
// PRICING FRAMEWORK
// ===========================================

const PRICING_FRAMEWORK = {
  psychology: "One price = 'Is this worth it?' Three options = 'Which one do I want?'",
  structure: {
    option_a: {
      role: "Starter - Easy entry, low risk",
      pricing: "Your base rate",
      purpose: "For price-sensitive buyers or those who need a 'test'"
    },
    option_b: {
      role: "Most Popular - What you WANT them to pick",
      pricing: "1.7-2x Option A",
      purpose: "Best value for them, best margin for you"
    },
    option_c: {
      role: "Premium - Anchors the others",
      pricing: "2.5-3x Option A",
      purpose: "Makes B look reasonable. Some will actually pick C."
    }
  },
  template: `Based on what you shared, here are 3 options:

**Option A (Starter):** [Deliverable] — $[price]
• [Scope details]
• [What's included]
• Best for: [who this is for]

**Option B (Most Popular ⭐):** [Deliverable] — $[price]
• [Scope details]
• [What's included]
• Best for: [who this is for]

**Option C (Premium):** [Deliverable] — $[price]
• [Scope details]
• [What's included]
• Best for: [who this is for]

Happy to walk through any of these. Which feels closest to what you need?`,
  rules: [
    "ALWAYS present 3 options — never just 1",
    "Label Option B as 'Most Popular' or put a star next to it",
    "If they ask for discount, reduce scope (offer A) — never reduce B's price",
    "If they want something between A and B, create a new B with adjusted scope",
    "Option C should feel luxurious, not ridiculous"
  ],
  handling_discount_requests: {
    request: "Can you do any better on price?",
    response: "I hear you. Here's what I can do: I can adjust the scope to fit a smaller budget. Would Option A work, or do you need something specific from Option B?",
    rule: "Trade scope for price — never just lower the number."
  }
};

// ===========================================
// EMEA MARKET INTELLIGENCE
// ===========================================

const EMEA_INTELLIGENCE = {
  uk: {
    market: "United Kingdom",
    buyer_psychology: "Analytical and skeptical. Respond to data and specificity, not enthusiasm.",
    communication_style: "Direct but polite. Get to the point. Respect their time.",
    what_works: [
      "Concrete ROI with numbers",
      "Case studies from recognized brands",
      "Clear, specific value propositions",
      "Respecting their time — keep meetings to 30 min",
      "British spelling in all materials"
    ],
    what_kills_deals: [
      "Overselling or superlatives ('best', 'amazing', 'incredible')",
      "Aggressive follow-up — feels desperate",
      "Vague pitches without specifics",
      "American spelling (color vs colour)",
      "Showing up late or going over time"
    ],
    email_template: "Hi [Name], I came across [Company] while researching [industry] — specifically noticed [specific observation]. I help similar companies achieve [outcome]. Worth a brief call to see if there's a fit? Happy to keep it to 20 minutes.",
    sales_cycle: "2-4 weeks SMB, 6-12 weeks enterprise",
    culture_note: "Brits appreciate dry humor and self-deprecation. Don't be too earnest."
  },
  ireland: {
    market: "Ireland",
    buyer_psychology: "Relationship-first. Dublin is an EMEA tech hub, but buying culture is warmer than UK.",
    communication_style: "Warm and personal. Take time to build rapport.",
    what_works: [
      "Warmth and genuine personality",
      "Shared connections (always mention mutual contacts)",
      "Local references — show you know the Irish tech ecosystem",
      "Moving at their pace, not yours",
      "Meeting for coffee/pints when possible"
    ],
    what_kills_deals: [
      "Cold corporate tone",
      "Treating Dublin like a smaller London",
      "Rushing to close",
      "Not asking about them personally",
      "Aggressive American-style selling"
    ],
    email_template: "Hi [Name], I came across you through [connection/event]. I work with companies in the Irish tech scene on [outcome] — would love to connect if it makes sense. No pressure either way.",
    sales_cycle: "Faster with warm intros. Referrals can cut cycles in half.",
    culture_note: "The Irish tech community is tight-knit. Reputation travels fast — good and bad."
  },
  spain: {
    market: "Spain",
    buyer_psychology: "Relationship-driven and hierarchical. Trust must be established before business.",
    communication_style: "Warm but respectful of hierarchy. Decisions often require senior sign-off.",
    what_works: [
      "Building trust over multiple touchpoints",
      "Spanish language for local SMBs (English OK for international cos)",
      "Video calls or in-person — text alone is impersonal",
      "Patience — rushing is seen as disrespectful",
      "Understanding the decision-making hierarchy"
    ],
    what_kills_deals: [
      "Rushing the timeline",
      "English-only approach to local companies",
      "Going around your contact to reach their boss",
      "Following up too aggressively",
      "Scheduling during siesta (2-5pm) or Friday afternoon"
    ],
    email_template: "Hola [Name], I've been following [Company]'s growth and thought there might be a fit. I help international companies with [outcome]. Would a quick call make sense?",
    sales_cycle: "4-8 weeks SMB, 3-6 months enterprise. August is completely dead.",
    culture_note: "Barcelona-based companies tend to be more international; Madrid more traditional."
  },
  germany: {
    market: "Germany",
    buyer_psychology: "Most process-oriented market in EMEA. Analytical, risk-averse, detail-focused.",
    communication_style: "Formal, especially at first. Use Herr/Frau Last Name until invited otherwise.",
    what_works: [
      "Detailed proposals and documentation",
      "Data, case studies, and proof points",
      "Clear GDPR compliance statements",
      "Formal address (Herr/Frau) in initial contact",
      "Patience — they will analyze everything"
    ],
    what_kills_deals: [
      "Casual tone too early",
      "Vague or incomplete proposals",
      "Any hint of data privacy risk",
      "Trying to rush the process",
      "Overselling or making claims you can't prove"
    ],
    email_template: "Sehr geehrte(r) Herr/Frau [Last Name], I am reaching out regarding [specific topic]. I work with companies in [industry] on [outcome]. I would welcome the opportunity to schedule a brief call. Please find attached [relevant document/case study].",
    sales_cycle: "Longest in EMEA. 6-12 weeks SMB, 3-9 months enterprise.",
    culture_note: "Germans respect preparation. Come to meetings over-prepared, not under."
  },
  france: {
    market: "France",
    buyer_psychology: "Analytical rigor plus relationship values. Appreciate intellectual engagement.",
    communication_style: "Formal initially, warmer over time. Appreciate elegance and logic.",
    what_works: [
      "French language where possible (especially for local cos)",
      "Intellectual credibility — they respect expertise",
      "Respecting hierarchy and formal channels",
      "Quality over quantity in all communications",
      "Taking time for small talk before business"
    ],
    what_kills_deals: [
      "English-only to local French companies",
      "Generic, mass-produced messaging",
      "Aggressive follow-up — seen as crude",
      "Underestimating their sophistication",
      "Skipping the relationship-building phase"
    ],
    email_template: "Bonjour [Name], I've been following [Company] and was interested in [specific observation]. I help similar companies with [outcome]. Would a brief call make sense?",
    sales_cycle: "4-8 weeks SMB, 3-6 months enterprise. August is completely dead.",
    culture_note: "Paris vs. other French cities can have different cultures. Tech hubs exist in Lyon, Bordeaux, and Nice."
  },
  netherlands: {
    market: "Netherlands",
    buyer_psychology: "Direct, pragmatic, and egalitarian. Don't waste their time with fluff.",
    communication_style: "Very direct — they'll tell you exactly what they think.",
    what_works: [
      "Get to the point quickly",
      "Honesty and transparency (they'll call out BS)",
      "Practical value propositions",
      "Treating everyone as equals — hierarchy is flat",
      "English is widely spoken, but Dutch appreciated"
    ],
    what_kills_deals: [
      "Overpromising or exaggerating",
      "Too much small talk before business",
      "Being evasive about price or terms",
      "Hierarchy-based selling (ignoring junior team members)",
      "Fancy presentations over substance"
    ],
    email_template: "Hi [Name], I'll get straight to the point: I help companies like [similar company] with [outcome]. Is this relevant for you right now? If not, no worries.",
    sales_cycle: "Among the fastest in EMEA. 2-4 weeks SMB, 4-8 weeks enterprise.",
    culture_note: "The Dutch appreciate honesty even when uncomfortable. Don't sugarcoat."
  },
  nordics: {
    market: "Nordics (Sweden, Norway, Denmark, Finland)",
    buyer_psychology: "Consensus-driven, egalitarian, sustainability-conscious.",
    communication_style: "Reserved but friendly. Avoid hard sells.",
    what_works: [
      "Consensus-building (involve the whole team)",
      "Sustainability and ethics messaging",
      "Understated, factual communication",
      "Respecting work-life balance (no late emails)",
      "Long-term relationship focus"
    ],
    what_kills_deals: [
      "Aggressive sales tactics",
      "Ignoring junior team members",
      "Flashy or exaggerated claims",
      "Contacting outside business hours",
      "Trying to rush decisions"
    ],
    email_template: "Hi [Name], I work with companies on [outcome]. Based on what I know about [Company], there might be a fit. Would you be open to a brief conversation?",
    sales_cycle: "3-6 weeks SMB, 2-4 months enterprise. Summers (June-August) are slow.",
    culture_note: "Swedes and Finns are more reserved; Danes and Norwegians slightly warmer. All value modesty."
  }
};

// ===========================================
// COLD EMAIL TEMPLATES
// ===========================================

const COLD_EMAIL_TEMPLATES = {
  pattern_interrupt: {
    name: "Pattern Interrupt",
    subject: "Quick question",
    body: `Hi [Name],

Not sure if this is relevant for you, but I help [type of company] with [specific outcome].

Is that something you're actively working on, or is this a 'not right now' situation?

Either answer is fine — just don't want to waste your time.

[Your name]`,
    psychology: "Permission-based. Respects their time. Easy to respond to."
  },
  observation: {
    name: "Observation-Based",
    subject: "[Something specific you noticed]",
    body: `Hi [Name],

I noticed [specific observation about their company/product/content].

[One sentence about why that matters or what it made you think]

I help companies like yours with [outcome]. Worth a quick chat?

[Your name]`,
    psychology: "Shows you did research. Personalization = higher response rate."
  },
  mutual_connection: {
    name: "Mutual Connection",
    subject: "[Mutual connection] suggested I reach out",
    body: `Hi [Name],

[Mutual connection] mentioned you might be interested in [topic/outcome].

I've helped [similar company] achieve [specific result]. Not sure if it's relevant for [their company], but figured it was worth a quick note.

Open to a brief call?

[Your name]`,
    psychology: "Social proof from someone they trust."
  },
  case_study: {
    name: "Case Study Lead",
    subject: "How [similar company] achieved [result]",
    body: `Hi [Name],

Just wrapped up a project with [similar company] — helped them [specific result].

Given what [their company] is doing with [specific thing], thought there might be a parallel.

Worth a quick call to see if it's relevant?

[Your name]`,
    psychology: "Leads with proof, makes them curious about the result."
  },
  breakup: {
    name: "Breakup Email",
    subject: "Closing the loop",
    body: `Hi [Name],

I've reached out a few times about [topic] — haven't heard back, so I'll assume the timing isn't right.

If [problem you solve] becomes a priority later, feel free to reach out. I'll be here.

Good luck with [something specific to them].

[Your name]`,
    psychology: "Respectful exit. Often triggers a response from people who meant to reply."
  }
};

// ===========================================
// CALL SCRIPTS
// ===========================================

const CALL_SCRIPTS = {
  discovery_call: {
    name: "Discovery Call Framework",
    duration: "30 minutes",
    structure: {
      opening: {
        time: "2 min",
        script: "Thanks for taking the time. Before we dive in, I want to set expectations — my goal today is to understand what you're working on and see if there's a fit. If there is, great. If not, totally fine — I'll point you in the right direction. Sound good?"
      },
      their_situation: {
        time: "10 min",
        questions: [
          "Tell me about what's happening right now with [topic]. What prompted you to take this call?",
          "What have you tried so far? What worked, what didn't?",
          "If you solved this, what would that mean for [company/team/you personally]?",
          "What happens if you don't solve this?"
        ]
      },
      your_solution: {
        time: "10 min",
        script: "Based on what you've shared, here's how I typically help companies in your situation... [Explain your approach, not your product features]"
      },
      next_steps: {
        time: "5 min",
        script: "So here's what I'm thinking for next steps. I'll put together 3 options based on what we discussed and send them over by [date]. You review, and if one of them makes sense, we can move forward. If not, no pressure. Does that work?"
      },
      closing: {
        time: "3 min",
        script: "Before we wrap — is there anything else I should know? Anyone else who needs to be involved? Any timeline I should be aware of?"
      }
    }
  },
  cold_call: {
    name: "Cold Call Framework",
    duration: "2-3 minutes max",
    structure: {
      permission: {
        script: "Hi [Name], this is [Your name] from [Company]. Did I catch you at a bad time?"
      },
      reason: {
        script: "I'll be quick — I'm reaching out because I noticed [observation about their company]. I help similar companies with [outcome]. Is that something you're working on right now?"
      },
      if_yes: {
        script: "Great — can I ask what's driving that? What's the main challenge you're running into?"
      },
      if_no: {
        script: "No worries. Is this 'not right now' or 'not ever'? If it's timing, I'm happy to reach out later."
      },
      book_meeting: {
        script: "Sounds like there might be a fit. How's [specific date/time] for a 20-minute call to dig deeper?"
      }
    },
    rules: [
      "Keep it under 3 minutes",
      "Don't pitch — just qualify",
      "If they're busy, ask for a better time — don't launch into your script",
      "Sound like a person, not a robot reading a script"
    ]
  }
};

// ===========================================
// SERVER SETUP
// ===========================================

const server = new Server(
  {
    name: "smb-sales-intelligence",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_discovery_script",
        description: "Get a discovery script to qualify prospects before pitching. Always ask questions first.",
        inputSchema: {
          type: "object",
          properties: {
            tone: {
              type: "string",
              enum: ["professional", "warm", "ultra_short", "cold_outbound", "inbound_lead"],
              description: "professional=email/linkedin, warm=existing relationship, ultra_short=DM, cold_outbound=first contact, inbound_lead=they reached out"
            }
          },
          required: ["tone"]
        }
      },
      {
        name: "get_objection_response",
        description: "Handle a specific sales objection with psychology-backed responses.",
        inputSchema: {
          type: "object",
          properties: {
            objection_type: {
              type: "string",
              enum: ["too_expensive", "no_budget", "need_approval", "comparing_options", "bad_timing", "already_have_someone", "send_info", "need_to_think", "too_soon", "ghosting"],
              description: "The type of objection to handle"
            }
          },
          required: ["objection_type"]
        }
      },
      {
        name: "get_followup_sequence",
        description: "Get a follow-up sequence for different situations (post-proposal, post-call, cold outbound, revival).",
        inputSchema: {
          type: "object",
          properties: {
            sequence_type: {
              type: "string",
              enum: ["post_proposal", "post_call", "cold_outbound", "revival"],
              description: "The type of follow-up sequence needed"
            }
          },
          required: ["sequence_type"]
        }
      },
      {
        name: "get_closing_script",
        description: "Get a closing script based on the situation.",
        inputSchema: {
          type: "object",
          properties: {
            style: {
              type: "string",
              enum: ["standard", "assumptive", "timeline", "scarcity", "retainer", "choice", "next_step"],
              description: "The closing style to use"
            }
          },
          required: ["style"]
        }
      },
      {
        name: "get_pricing_framework",
        description: "Get the 3-option pricing framework and templates.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "get_emea_intelligence",
        description: "Get market intelligence for selling to a specific European country.",
        inputSchema: {
          type: "object",
          properties: {
            country: {
              type: "string",
              enum: ["uk", "ireland", "spain", "germany", "france", "netherlands", "nordics"],
              description: "The EMEA market to get intelligence for"
            }
          },
          required: ["country"]
        }
      },
      {
        name: "get_cold_email_template",
        description: "Get a cold email template for outbound.",
        inputSchema: {
          type: "object",
          properties: {
            template_type: {
              type: "string",
              enum: ["pattern_interrupt", "observation", "mutual_connection", "case_study", "breakup"],
              description: "The type of cold email template"
            }
          },
          required: ["template_type"]
        }
      },
      {
        name: "get_call_script",
        description: "Get a call script for discovery calls or cold calls.",
        inputSchema: {
          type: "object",
          properties: {
            call_type: {
              type: "string",
              enum: ["discovery_call", "cold_call"],
              description: "The type of call script needed"
            }
          },
          required: ["call_type"]
        }
      },
      {
        name: "get_buying_signals",
        description: "Get a list of buying signals to watch for during sales conversations.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "get_full_playbook",
        description: "Get the complete sales playbook with all modules.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_discovery_script": {
      const tone = args?.tone as string;
      const script = DISCOVERY_SCRIPTS[tone as keyof typeof DISCOVERY_SCRIPTS];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Discovery System",
            rule: "NEVER pitch before qualifying. Ask questions first.",
            psychology: "When prospects invest in answering questions, they're more likely to buy.",
            script: script,
            pushback_handlers: {
              just_send_rate: "Happy to — I just need those details so I don't under or overquote.",
              need_ballpark: "Totally get it. The reason I ask: scope changes the pricing significantly.",
              send_portfolio: "Happy to share — quick context first: what's the main goal here?"
            }
          }, null, 2)
        }]
      };
    }

    case "get_objection_response": {
      const objectionType = args?.objection_type as string;
      const handler = OBJECTION_HANDLERS[objectionType as keyof typeof OBJECTION_HANDLERS];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Objection Handling",
            framework: {
              step_1: "Acknowledge — make them feel heard",
              step_2: "Clarify — find the real objection",
              step_3: "Reframe — address the actual concern"
            },
            ...handler
          }, null, 2)
        }]
      };
    }

    case "get_followup_sequence": {
      const sequenceType = args?.sequence_type as string;
      const sequence = FOLLOWUP_SEQUENCES[sequenceType as keyof typeof FOLLOWUP_SEQUENCES];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Follow-Up Sequences",
            rules: [
              "Reply in the same thread — never start new",
              "Keep each message under 3 lines",
              "Day 5 value-add is your highest-leverage message",
              "Never say 'just checking in' — it adds no value"
            ],
            sequence: sequence
          }, null, 2)
        }]
      };
    }

    case "get_closing_script": {
      const style = args?.style as string;
      const script = CLOSING_SCRIPTS[style as keyof typeof CLOSING_SCRIPTS];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Closing System",
            rule: "When you see buying signals, move to logistics — don't ask 'are you ready to buy?'",
            buying_signals: BUYING_SIGNALS,
            close: script
          }, null, 2)
        }]
      };
    }

    case "get_pricing_framework": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "3-Option Pricing Framework",
            ...PRICING_FRAMEWORK
          }, null, 2)
        }]
      };
    }

    case "get_emea_intelligence": {
      const country = args?.country as string;
      const intel = EMEA_INTELLIGENCE[country as keyof typeof EMEA_INTELLIGENCE];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "EMEA Market Intelligence",
            warning: "EMEA is not one market. Each country has different buying psychology.",
            ...intel
          }, null, 2)
        }]
      };
    }

    case "get_cold_email_template": {
      const templateType = args?.template_type as string;
      const template = COLD_EMAIL_TEMPLATES[templateType as keyof typeof COLD_EMAIL_TEMPLATES];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Cold Email Templates",
            rules: [
              "Keep subject lines under 5 words",
              "First line should be about THEM, not you",
              "End with a clear, easy-to-answer question",
              "Under 100 words total"
            ],
            template: template
          }, null, 2)
        }]
      };
    }

    case "get_call_script": {
      const callType = args?.call_type as string;
      const script = CALL_SCRIPTS[callType as keyof typeof CALL_SCRIPTS];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Call Scripts",
            ...script
          }, null, 2)
        }]
      };
    }

    case "get_buying_signals": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            module: "Buying Signals",
            instruction: "When you see these signals, move to close — don't keep pitching.",
            signals: BUYING_SIGNALS
          }, null, 2)
        }]
      };
    }

    case "get_full_playbook": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            playbook: "SMB Sales Intelligence v2.0",
            author: "Elisabeth Hitz",
            credentials: [
              "268% quota at Criteo",
              "167% quota at Deel ($12B)",
              "Enterprise deals at HBO, Bloomberg, Autodesk, Levi's, Rolling Stone"
            ],
            modules: {
              discovery: DISCOVERY_SCRIPTS,
              objections: OBJECTION_HANDLERS,
              followup: FOLLOWUP_SEQUENCES,
              closing: CLOSING_SCRIPTS,
              pricing: PRICING_FRAMEWORK,
              emea: EMEA_INTELLIGENCE,
              cold_email: COLD_EMAIL_TEMPLATES,
              call_scripts: CALL_SCRIPTS,
              buying_signals: BUYING_SIGNALS
            }
          }, null, 2)
        }]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SMB Sales Intelligence MCP Server v2.0 running...");
}

main().catch(console.error);
