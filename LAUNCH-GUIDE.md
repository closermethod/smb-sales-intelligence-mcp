# MCP SERVER COMPLETE LAUNCH GUIDE

## 📦 WHAT'S IN THIS PACKAGE

```
mcp-complete/
├── src/main.ts          # Enhanced MCP server (10 tools, v2.0)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── README.md            # Documentation
├── actor.json           # Apify actor config
├── input_schema.json    # Apify input schema
├── Dockerfile           # For Apify deployment
├── landing-page.html    # Production landing page
└── LAUNCH-GUIDE.md      # This file
```

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Apify Marketplace (Recommended)

**Why Apify:**
- Built-in payments (they handle billing)
- 36K+ monthly developers
- MCP marketplace is new = less competition
- Easy deployment

**Steps:**

1. Create Apify account: https://apify.com
2. Install CLI:
   ```bash
   npm install -g apify-cli
   apify login
   ```
3. Navigate to this folder:
   ```bash
   cd mcp-complete
   ```
4. Initialize and push:
   ```bash
   apify init
   apify push
   ```
5. Submit to marketplace in Apify Console

### Option 2: Cline Marketplace

**Steps:**
1. Go to: https://cline.bot/mcp
2. Submit your GitHub repo
3. Fill out the form with details below

### Option 3: Self-Hosted (Any Node.js host)

**Works on:** Vercel, Railway, Render, Fly.io, DigitalOcean

```bash
npm install
npm run build
npm start
```

### Option 4: Local Testing with Claude Desktop

1. Build the server:
   ```bash
   npm install
   npm run build
   ```

2. Add to Claude config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "smb-sales": {
         "command": "node",
         "args": ["/full/path/to/mcp-complete/dist/main.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop

4. Test:
   > "Use smb-sales to handle this objection: prospect said price is too high"

---

## 📝 MARKETPLACE LISTING COPY

### Apify Listing

**Title (50 chars max):**
```
SMB Sales Intelligence for AI Agents
```

**Short Description (150 chars):**
```
Enterprise sales playbooks for AI SDRs. Objection handling, discovery, EMEA intelligence. By Elisabeth Hitz (268% quota at Criteo, Deel $12B).
```

**Full Description:**
```
## Why This Exists

AI SDRs fail because they:
- Pitch before qualifying
- Respond to objections with "I understand your concern"
- Follow up with "just checking in"
- Treat EMEA like one market

This MCP server fixes that with battle-tested playbooks from 10 years of enterprise sales.

## What You Get

**10 MCP Tools:**
- get_discovery_script — 5 tones for different contexts
- get_objection_response — Handle 10 common objections
- get_followup_sequence — 4 sequences (proposal, call, cold, revival)
- get_closing_script — 7 closing styles
- get_pricing_framework — 3-option system that converts
- get_emea_intelligence — UK, Ireland, Spain, Germany, France, Netherlands, Nordics
- get_cold_email_template — 5 proven templates
- get_call_script — Discovery and cold call frameworks
- get_buying_signals — 9 signals to watch for
- get_full_playbook — Everything in one call

## Credentials

- 268% quota at Criteo
- 167% quota at Deel ($12B company)
- Enterprise deals at HBO, Bloomberg, Autodesk, Levi's, Rolling Stone
- 5+ years selling across EMEA

## Use Cases

- AI SDR platforms (11x, Artisan, etc.)
- Sales copilots
- CRM integrations
- Email automation tools
- Revenue intelligence platforms

## Pricing

- Free: 10 requests/month
- Starter ($29/mo): 500 requests
- Pro ($97/mo): 2,500 requests
- Enterprise ($297/mo): Unlimited
```

**Tags:**
```
sales, b2b, ai-agent, sdr, mcp, playbook, outbound, emea, enterprise, objection-handling, discovery, closing, cold-email
```

**Category:**
```
Business / Sales
```

---

## 🎬 DEMO VIDEO SCRIPT (60-90 seconds)

### Hook (10 sec)
*Show AI chatbot failing at sales*
"Your AI agent responds to 'your price is too high' with 'I understand your concern.' That's why it's not closing deals."

### Problem (15 sec)
"Most AI sales tools use generic playbooks. They pitch before qualifying. They follow up with 'just checking in.' They treat all of Europe like one market."

### Solution (20 sec)
"I built an MCP server with 10 years of enterprise sales playbooks. Not theory — actual scripts that generated millions at Criteo, Deel, HBO, Bloomberg."

### Demo (30 sec)
*Screen recording of MCP call*
"Watch this. Prospect says 'price is too high.' The MCP returns a psychology-backed response plus follow-up paths. Same for objections, follow-ups, EMEA markets, cold emails — everything."

### Credentials (10 sec)
*Show logos: Criteo, Deel, HBO, Bloomberg*
"268% quota at Criteo. Deals at Deel, HBO, Bloomberg. This isn't theoretical — it's battle-tested."

### CTA (10 sec)
"Link below to try it free. First 10 requests are on me."

---

## 📧 OUTREACH TO AI SDR COMPANIES

### Target List

| Company | Contact | Role | LinkedIn |
|---------|---------|------|----------|
| 11x.ai | Prabhav Jain | CEO | linkedin.com/in/prabhavjain |
| Artisan AI | Jaspar Carmichael-Jack | CEO | Search |
| Regie.ai | Srinath Sridhar | CEO | Search |
| Copy.ai | Paul Yacoubian | CEO | Search |
| Outreach | Product/AI Lead | | Search |
| Salesloft | Product/AI Lead | | Search |
| Gong | Product/AI Lead | | Search |
| Clari | Product/AI Lead | | Search |
| 6sense | Product/AI Lead | | Search |
| Lavender | Will Allred | CEO | linkedin.com/in/willallred |

### Email Template

**Subject:** Sales playbooks for [Product Name]

```
Hey [Name],

Quick question: is [Product] trained on real sales playbooks, or generic scripts?

I ask because I built an MCP server with 10 years of enterprise sales data — the actual scripts that closed deals at Criteo (268% quota), Deel ($12B), HBO, Bloomberg.

It includes:
- Objection handlers for 10 common pushbacks
- Discovery scripts that qualify before pitching
- Follow-up sequences (Day 5 reopens 30-40% of dead convos)
- EMEA market intelligence (7 countries)

Could be useful training data for [Product]. Want to test it? Free access for feedback.

— Eli
```

### LinkedIn DM

```
Hey [Name] — I built an MCP server with real B2B sales playbooks (268% quota at Criteo, deals at Deel, HBO, Bloomberg).

Could be useful for [Product]. Your AI gets:
• Objection handlers that work
• Discovery scripts
• EMEA intelligence
• Follow-up sequences

Want to test it? Free access for feedback.
```

---

## 📣 LAUNCH LINKEDIN POST

```
I just made every sales script I've used over 10 years available to AI agents.

268% quota at Criteo. Deals at Deel ($12B), HBO, Bloomberg, Autodesk.

Now it's an MCP server with 10 tools:

→ get_discovery_script — qualify before pitching
→ get_objection_response — handle "too expensive" properly
→ get_followup_sequence — Day 5 reopens 30-40% of dead convos
→ get_closing_script — 7 ways to close
→ get_emea_intelligence — UK, Germany, Spain, France, Ireland, Netherlands, Nordics
→ get_cold_email_template — 5 proven templates
→ get_call_script — discovery + cold call frameworks

Why?

Because AI agents fail at sales. They pitch before qualifying. They respond to objections with "I understand your concern." They follow up with "just checking in."

This fixes that.

Free trial: [link]

If you're building AI sales tools, DM me — happy to give extended access for feedback.
```

---

## ✅ LAUNCH CHECKLIST

### Pre-Launch (Today)
- [ ] Create Apify account
- [ ] Create GitHub repo (optional but recommended)
- [ ] Deploy landing page to Netlify
- [ ] Test MCP server locally

### Launch (This Week)
- [ ] Push to Apify: `apify push`
- [ ] Submit to Apify marketplace
- [ ] Submit to Cline marketplace
- [ ] Post on LinkedIn
- [ ] Email 10 AI SDR companies
- [ ] Post in RevGenius Slack
- [ ] Post in Sales Hacker Slack

### Post-Launch (Ongoing)
- [ ] Monitor usage analytics
- [ ] Collect feedback
- [ ] Iterate on playbook content
- [ ] Add new objection handlers
- [ ] Create case studies
- [ ] Queue Product Hunt launch

---

## 💰 PRICING STRATEGY

### Recommended Tiers

| Tier | Price | Requests | Target |
|------|-------|----------|--------|
| Free | $0 | 10/month | Testing, lead gen |
| Starter | $29/mo | 500 | Solo founders |
| Pro | $97/mo | 2,500 | SMB teams |
| Enterprise | $297/mo | Unlimited | AI platforms |

### Why This Works

1. **Free tier** generates leads and social proof
2. **Starter** is low-risk entry
3. **Pro** is where you make money (most will upgrade)
4. **Enterprise** for platform partnerships (11x, Artisan, etc.)

### Upgrade Triggers

- Free → Starter: Hit 10 request limit
- Starter → Pro: Need more requests OR want custom playbooks
- Pro → Enterprise: AI SDR platform integration

---

## 📊 SUCCESS METRICS

### Week 1
- [ ] MCP server deployed
- [ ] 50+ free users
- [ ] 5 LinkedIn DMs to AI companies

### Month 1
- [ ] 200+ free users
- [ ] 10 paid subscribers
- [ ] $500+ MRR

### Month 3
- [ ] 500+ users
- [ ] 1 enterprise partnership (11x, Artisan, etc.)
- [ ] $3,000+ MRR

---

## 🆘 TROUBLESHOOTING

### "MCP server not connecting"
- Check Claude Desktop config path
- Make sure you ran `npm run build`
- Restart Claude Desktop after config change

### "Apify push failing"
- Make sure you're logged in: `apify login`
- Check Dockerfile exists
- Run `npm install` first

### "Tools not showing up"
- MCP tools require Claude Desktop (not web)
- Check server logs for errors
- Verify all tools are registered in ListToolsRequestSchema

---

**You have everything. Go ship it.** 🚀
