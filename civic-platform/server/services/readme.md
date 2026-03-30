← Escalation logic, email sender

Module 4 — Auto Escalation Engine
Logic kya hai?
Har ghante ek cron job chalega
→ Dhundhega complaints jinka deadline nikal gaya
→ Aur status abhi bhi submitted/assigned/in-progress hai
→ Unka status "escalated" kar dega
→ Citizen ko email bhejega

Step 1 — Email Service banao
server/services/ mein emailService.js banao:

Step 2 — Gmail App Password setup karo
Normal Gmail password kaam nahi karega — App Password banana padega:

Google Account kholo → Security
2-Step Verification ON karo (agar nahi hai)
Phir App Passwords dhundho
App name likho: civic-platform → Create
16 digit password milega — copy karo

.env file update karo:
EMAIL_USER=tumhari_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

Step 3 — Escalation Service banao
server/services/ mein escalationService.js banao:

Step 4 — Cron Job banao
server/jobs/ mein escalationJob.js banao:

Step 5 — Cron Job index.js mein start karo
server/index.js update karo:

Step 6 — Test karo manually
Cron job har ghante chalti hai — but hum abhi test karna chahte hain. Ek temporary test route banao.
server/index.js mein yeh route add karo test ke liye:


### Step 7 — Ek complaint manually expire karo test ke liye

MongoDB Atlas mein jaao → **Browse Collections** → `complaints` collection → apni complaint find karo → **Edit** → `deadline` ki value change karo purani date mein:
```
2024-01-01T00:00:00.000Z
```

Save karo.

---
### Step 8 — Test karo Postman mein
```
Method : GET
URL    : http://localhost:5000/api/test-escalation
```
⏰ Escalation job running... 
Found 1 complaints to escalate
✅ Escalated: Pothole on main road
Escalation email sent to rahul@gmail.com