# MuPay: Money Home, Made Simple

MuPay is a Mukuru-powered way to send money home from a basic phone.
Built for Mukuru SheHacks, Challenge A.

## What it does (mapped to the brief)

| Brief item                         | How MuPay does it                                              |
| ---------------------------------- | -------------------------------------------------------------- |
| Send-money journey                 | Sender (Johannesburg) to receiver (Harare) on one screen       |
| Fee and exchange-rate transparency | Fee, rate and "receiver gets" shown before the sender confirms |
| Status tracking                    | Sent, In transit, Ready to collect, Collected                  |
| Two languages                      | English and chiShona (chiShona pending native review)          |
| Simulated USSD / WhatsApp          | USSD `*120#` simulator and a WhatsApp-style chat bot           |
| Low-data / offline mode            | Low Data Mode toggle; offline actions are queued and synced    |
| Notify the receiver                | SMS-style "money waiting" message and receiver screen          |

Extras: receiver phone verification (OTP), one-time collect guard, per-bank
account validation, cash or bank choice, sender receipt, 8-currency picker.

## What is simulated

Exchange rates, the OTP (shown on screen), the SMS/USSD/WhatsApp channels and
the status timers are all simulated in the frontend for the hackathon.

## Run

```bash
npm install
npm run dev
```
