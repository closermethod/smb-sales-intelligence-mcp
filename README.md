# SMB Sales Intelligence MCP Server

**Battle-tested B2B sales playbook frameworks for AI agents.**

Built from 10+ years of B2B enterprise sales experience across ad-tech, SaaS, media, and global hiring — including a five-year stretch overshooting quota every year at a publicly-listed ad-tech company.

By [Elisabeth Hitz](https://www.linkedin.com/in/elisabethhitz).

> **Disclaimer.** Structured general-best-practice sales frameworks. Not a substitute for tailored sales coaching, legal advice, or domain-specific consulting. Use as a starting layer, not a final source.

---

## The Problem

AI agents fail at sales because they:

- **Pitch before qualifying** — talking about features to people who aren't even buyers
- **Fold on objections** with "I understand your concern" (a surrender, not a response)
- **Follow up with "just checking in"** — a near-zero reply rate everyone recognizes
- **Treat EMEA like one market** — burning trust in 5+ different cultures
- **Present one price** instead of giving the 3-option menu that converts

The result: burned leads, dead sequences, and revenue left on the table.

## The Solution

10 callable tools that give your AI agent decades of real enterprise sales experience — not theory from a blog post. Word-for-word scripts, country-specific playbooks, and psychology-backed objection handlers from deals worth $50K–$500K.

---

## 🔧 10 Tools

| Tool | What it does |
|---|---|
| `get_discovery_script` | 5 tones × qualification frameworks. Doubles close rates by qualifying before pitching. |
| `get_objection_response` | 10 most common B2B objections (price, timing, authority, ghosting…) with reframes that advance the conversation. |
| `get_followup_sequence` | 4 sequences (post-proposal, post-call, cold, revival). **Day 5 message reopens 30–40% of dead conversations.** |
| `get_closing_script` | 7 closing styles — assumptive, timeline, scarcity, retainer, choice, next-step. AI picks based on context. |
| `get_pricing_framework` | The 3-option menu that prevents anchoring and increases average deal size. |
| `get_emea_intelligence` | UK / Ireland / Spain / Germany / France / Netherlands / Nordics. Each market is different — the AI gets the playbook. |
| `get_cold_email_template` | Pattern-interrupt, observation, mutual-connection, case-study, breakup. Under 100 words each. |
| `get_call_script` | Discovery and cold-call frameworks with timing breakdowns. |
| `get_buying_signals` | The 9 signals that mean "stop pitching, start closing." |
| `get_full_playbook` | Complete dump for fine-tuning your agent or loading as system context. |

---

## 💰 Pricing (Pay-Per-Event)

Pay only for what your AI agent actually calls. No subscriptions, no tier gating.

| Event | Price |
|---|---|
| Tool call | $0.05 |
| EMEA market brief | $0.10 |
| Full playbook dump | $0.50 |

First **10 calls free** — try it on Claude Desktop, Cursor, Cline, or any MCP-compatible client.

---

## 🚀 Quick Start

### Use via Apify (no setup)

Click "Run" on this Apify page. Pass `tool` as input. Done.

### Use locally with Claude Desktop, Cursor, or any MCP client

```bash
git clone https://github.com/elibierhitz/smb-sales-mcp
cd smb-sales-mcp
npm install
npm run build
```

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "smb-sales": {
      "command": "node",
      "args": ["/path/to/smb-sales-mcp/dist/main.js"]
    }
  }
}
```

Restart Claude Desktop. Test it:

> "Use smb-sales to handle this objection: the prospect said our price is too high"

---

## 🎯 Real Example Calls

**Objection in the wild:**
```
Prospect: "Your price is too high"
→ get_objection_response({ objection_type: "too_expensive" })
→ "Fair point — let me ask: is it the total investment that feels off, 
   or the value relative to what you're getting? Because I can usually 
   solve one of those."
```

**Reviving a dead deal:**
```
Prospect went silent 5 days after proposal
→ get_followup_sequence({ sequence_type: "post_proposal" })
→ Day 5 message: "Had a thought for your [product]: [specific idea]. 
   Want me to build that into Option B?"
   (Reopens 30–40% of dead conversations.)
```

**Selling into Germany:**
```
First touch with German prospect
→ get_emea_intelligence({ country: "germany" })
→ "Most process-oriented market in EMEA. Lead with data and detailed 
   proposals. Use formal address (Herr/Frau Last Name). Expect 6–12 week 
   cycles for SMB. GDPR compliance non-negotiable. Don't be casual."
```

---

## Who This Is For

- **AI SDR platforms** (11x, Artisan, Landbase, Alta) needing real training data
- **Outbound automation tools** that want better conversion rates than "just checking in"
- **CRM AI assistants** making intelligent recommendations on live deals
- **Sales coaching bots** requiring proven script frameworks
- **Lead qualification agents** that need structured discovery flows
- **Founders building sales AI** who want expert data without hiring a sales consultant

---

## Why This Is Different

Most sales content online is theory. This is from the trenches.

**Five consecutive years of overshooting quota at a publicly-listed ad-tech company** is the kind of repetition that produces working sales frameworks. The scripts here aren't blog-post best practice — they're structured around real B2B enterprise selling experience layered onto general best-practice methodology (BANT, MEDDIC, SPIN, Sandler).

Your AI agent gets that structured layer as API calls.

> Disclaimer: This MCP returns structured general-best-practice frameworks. Not a substitute for tailored sales coaching, legal advice, or domain-specific consulting. None of the outputs reproduce any former employer's proprietary methodology.

---

## 🌍 EMEA Module — Why It Matters

Most AI SDR tools assume EMEA is one market. It isn't.

| Country | What works | What kills deals | Cycle |
|---|---|---|---|
| 🇬🇧 UK | Data, specificity, dry humor | Superlatives, aggressive follow-up | 2–4 wks SMB |
| 🇮🇪 Ireland | Warm intros, Dublin tech context | Treating it like London | Faster w/ referrals |
| 🇪🇸 Spain | Trust over time, Spanish for SMBs | Rushing, August launches | 4–8 wks SMB |
| 🇩🇪 Germany | Documentation, formal address, GDPR | Casual tone, vague claims | 6–12 wks SMB |
| 🇫🇷 France | French language, intellectual rigor | Generic mass messaging | 4–8 wks SMB |
| 🇳🇱 Netherlands | Direct, transparent, fast | Overpromising, fluff | Among fastest in EMEA |
| 🇸🇪 Nordics | Consensus, sustainability framing | Hard sells, after-hours emails | 3–6 wks SMB |

Built from 5+ years of EMEA B2B enterprise sales experience.

---

## 👤 About the Author

**Elisabeth Hitz** — Swiss-American B2B sales executive based in Barcelona.

- 10+ years of B2B enterprise sales experience across ad-tech, SaaS, media, and global hiring
- Five consecutive years overshooting quota at a publicly-listed ad-tech company
- 5+ years EMEA B2B enterprise sales (UK, Germany, Spain, France, Ireland, Netherlands)
- Closed mid-five to mid-six-figure deals across multiple industries
- Now building [closermethod.com](https://closermethod.com) and sales tools for the AI agent ecosystem

LinkedIn: [linkedin.com/in/elisabethhitz](https://www.linkedin.com/in/elisabethhitz)

---

## 📦 Integration

Works with any MCP-compatible client:
- Claude Desktop
- Cursor
- Cline
- Windsurf
- Custom MCP implementations

---

## 🤝 For AI SDR Platforms

If you're building 11x/Artisan/Alta-style products and want extended access for fine-tuning your agent, [DM me on LinkedIn](https://www.linkedin.com/in/elisabethhitz). Happy to discuss white-label deals.

---

## License

MIT. Use it, modify it, ship it.
