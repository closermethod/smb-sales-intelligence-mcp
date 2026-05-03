# SMB Sales Intelligence MCP Server v2.0

**Enterprise-grade sales playbooks for AI agents.**

By Elisabeth Hitz — 268% quota at Criteo, Deel ($12B), HBO, Bloomberg, Autodesk.

---

## What This Does

Your AI agent calls this MCP server to get real sales playbooks:

- **Discovery scripts** — Qualify before pitching
- **Objection handling** — 10 common objections with psychology-backed responses
- **Follow-up sequences** — 4 different sequences for different situations
- **Closing scripts** — 7 different closing styles
- **Pricing frameworks** — The 3-option system that converts
- **EMEA intelligence** — UK, Ireland, Spain, Germany, France, Netherlands, Nordics
- **Cold email templates** — 5 proven templates
- **Call scripts** — Discovery and cold call frameworks

---

## Why This Exists

AI SDRs fail because they:
- Pitch before qualifying
- Respond to objections with "I understand your concern"
- Follow up with "just checking in"
- Treat EMEA like one market

This MCP server fixes that with battle-tested playbooks from 10 years of enterprise sales.

---

## Quick Start

### Option 1: Local Testing with Claude Desktop

1. Clone or download this repo
2. Install dependencies:
   ```bash
   npm install
   npm run build
   ```

3. Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):
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

4. Restart Claude Desktop

5. Test it:
   > "Use the smb-sales MCP to handle this objection: the prospect said our price is too high"

### Option 2: Deploy to Apify

1. Install Apify CLI:
   ```bash
   npm install -g apify-cli
   apify login
   ```

2. Initialize Apify actor:
   ```bash
   apify init
   ```

3. Push to Apify:
   ```bash
   apify push
   ```

4. Your MCP server is now live on Apify's marketplace.

### Option 3: Deploy to Any Node.js Host

Works on Vercel, Railway, Render, Fly.io, etc.

```bash
npm install
npm run build
npm start
```

---

## Available Tools

### `get_discovery_script`
Get a discovery script to qualify prospects before pitching.

```typescript
// Tones: professional, warm, ultra_short, cold_outbound, inbound_lead
get_discovery_script({ tone: "professional" })
```

### `get_objection_response`
Handle a specific objection with psychology-backed responses.

```typescript
// Types: too_expensive, no_budget, need_approval, comparing_options, 
//        bad_timing, already_have_someone, send_info, need_to_think, 
//        too_soon, ghosting
get_objection_response({ objection_type: "too_expensive" })
```

### `get_followup_sequence`
Get a follow-up sequence for different situations.

```typescript
// Types: post_proposal, post_call, cold_outbound, revival
get_followup_sequence({ sequence_type: "post_proposal" })
```

### `get_closing_script`
Get a closing script based on the situation.

```typescript
// Styles: standard, assumptive, timeline, scarcity, retainer, choice, next_step
get_closing_script({ style: "assumptive" })
```

### `get_pricing_framework`
Get the 3-option pricing framework.

```typescript
get_pricing_framework()
```

### `get_emea_intelligence`
Get market intelligence for a specific European country.

```typescript
// Countries: uk, ireland, spain, germany, france, netherlands, nordics
get_emea_intelligence({ country: "germany" })
```

### `get_cold_email_template`
Get a cold email template.

```typescript
// Types: pattern_interrupt, observation, mutual_connection, case_study, breakup
get_cold_email_template({ template_type: "pattern_interrupt" })
```

### `get_call_script`
Get a call script for discovery or cold calls.

```typescript
// Types: discovery_call, cold_call
get_call_script({ call_type: "discovery_call" })
```

### `get_buying_signals`
Get a list of buying signals to watch for.

```typescript
get_buying_signals()
```

### `get_full_playbook`
Get the complete playbook with all modules.

```typescript
get_full_playbook()
```

---

## Example Usage

### In an AI SDR Agent

```
User: "The prospect said they need to think about it"

AI Agent: [Calls get_objection_response({ objection_type: "need_to_think" })]

Response: "Of course — what's the main thing you're weighing? If it's timing, scope, or budget, I might be able to help narrow it down."
```

### In a Sales Copilot

```
User: "I need to follow up with a prospect who went quiet after I sent the proposal"

AI Agent: [Calls get_followup_sequence({ sequence_type: "post_proposal" })]

Day 5 message: "Had a thought for your [product/campaign]: [specific idea]. Want me to build that into Option B?"
```

### In an EMEA Sales Tool

```
User: "How should I approach this German prospect?"

AI Agent: [Calls get_emea_intelligence({ country: "germany" })]

Response: "German buyers are the most process-oriented in EMEA. Lead with data and detailed proposals. Use formal address (Herr/Frau Last Name). Expect 6-12 week cycles for SMB."
```

---

## About the Author

**Elisabeth Hitz** is a B2B sales professional with 10+ years of enterprise experience:

- **268% quota** at Criteo
- **167% quota** at Deel ($12B company)
- Enterprise deals at HBO, Bloomberg, Autodesk, Levi's, Rolling Stone, McCann, VML
- 5+ years selling across EMEA (UK, Germany, Spain, France, Ireland)

Now based in Barcelona, building sales tools for the AI agent ecosystem.

---

## Pricing (Apify Marketplace)

| Tier | Price | Requests | Best For |
|------|-------|----------|----------|
| Free | $0 | 10 | Testing |
| Starter | $29/mo | 500 | Solo founders |
| Pro | $97/mo | 2,500 | SMB sales teams |
| Enterprise | $297/mo | Unlimited | AI SDR platforms |

---

## Support

- **Issues**: Open a GitHub issue
- **Questions**: DM on LinkedIn (linkedin.com/in/elisabethhitz)
- **Custom integrations**: Email elibierhitz@gmail.com

---

## License

MIT License. Use it, modify it, ship it.
