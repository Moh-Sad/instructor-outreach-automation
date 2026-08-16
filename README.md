# Instructor Outreach Automation

An AI-powered automation that generates personalized outreach messages for prospective course instructors, logs them to Google Sheets, and runs automatically every week — built as a summer AI-automation program project.

## What it does

1. Reads a list of candidate instructors from `instructors.csv` (name, subject, background note)
2. Uses **Groq** (Llama 3.1 8B) to generate a short, personalized outreach message for each instructor
3. Logs every generated message to a **Google Sheet** for tracking and review
4. Runs automatically every Monday via **GitHub Actions** — no server required

This automates a process I previously did manually for instructor recruitment at [Zelaki Learn](https://zelaki.com), an Ethiopian e-learning platform.

## Tech stack

| Layer | Tool | Cost |
|---|---|---|
| AI text generation | [Groq API](https://console.groq.com) (`llama-3.1-8b-instant`) | Free tier |
| Data logging | Google Sheets API | Free |
| Scheduling | GitHub Actions (cron) | Free |
| Runtime | Node.js | — |

## Project structure

```
instructor-outreach-automation/
├── .github/workflows/
│   └── weekly-outreach.yml    # scheduled automation
├── instructors.csv             # input data
├── message.js                  # main script: generate + log
├── log-to-sheet.js              # Google Sheets logging logic
├── credentials.json             # Google service account key (gitignored, not in repo)
├── .env                         # Groq API key (gitignored, not in repo)
└── output.json                  # local backup of last run's results
```

## Setup (to run locally)

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Moh-Sad/instructor-outreach-automation.git
   cd instructor-outreach-automation
   npm install
   ```

2. Create a `.env` file with your Groq API key:
   ```
   GROQ_API_KEY=your_key_here
   ```

3. Add your Google service account credentials as `credentials.json` in the project root (see [Google Cloud Console](https://console.cloud.google.com) → IAM & Admin → Service Accounts).

4. Share your target Google Sheet with the service account's email (found in `credentials.json` under `client_email`), giving it Editor access.

5. Update the `SHEET_ID` constant in `log-to-sheet.js` with your Sheet's ID (from its URL).

6. Run it:
   ```bash
   node message.js
   ```

## How the weekly automation works

A GitHub Actions workflow (`.github/workflows/weekly-outreach.yml`) runs every Monday at 8:00 UTC. It:
- Installs dependencies fresh
- Rebuilds `credentials.json` from a GitHub Secret (never stored in the repo)
- Runs `message.js` using a `GROQ_API_KEY` secret
- Writes results directly to the connected Google Sheet

Secrets used (set under repo **Settings → Secrets and variables → Actions**):
- `GROQ_API_KEY`
- `GOOGLE_CREDENTIALS` (full contents of the service account JSON)

## What I'd improve next

- Add a `status` column workflow so messages are only sent after manual approval in the Sheet
- Send messages directly via the Gmail API instead of stopping at draft generation
- Add retry/error handling for failed Groq calls mid-batch
- Track response outcomes (accepted/rejected/negotiating) back into the same Sheet to match the full recruitment pipeline

## Why this project

Built during a summer AI-automation program to practice combining an LLM API, a real data-logging destination, and scheduled automation into one working pipeline — rather than a one-off script.