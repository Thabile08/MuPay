# MuPay – Money Home, Made Simple (MVP)

Hackathon MVP for the Mukuru challenge. Demonstrates:

- **Bonus A:** Simulated USSD (`*120#`) and WhatsApp money-sending experience
- **Bonus C:** Low-data and offline-friendly functionality
- Languages: **English** and **chiShona** (extensible to more)
- No standalone app UI — everything runs through USSD or WhatsApp

## User story

Thandi works in Johannesburg and sends money home. She can:

1. Send via **USSD** or **WhatsApp** (shared transfer + shared status tracker)
2. See fee, rate and receiver amount **before** confirming
3. Track: SENT → IN TRANSIT → READY TO COLLECT → COLLECTED
4. Switch between English and chiShona
5. Queue transfers when offline and auto-sync when signal returns

## Run

```bash
npm install
npm run dev
```
