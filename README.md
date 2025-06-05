⚖️ LawyerUp AI — Intelligent Legal Assistant for Nepal
A civic-tech platform leveraging AI and web APIs to make Nepalese legal knowledge, documents, and professionals accessible for all.

🧠 Project Summary
LawyerUp AI is a smart, mobile-first legal platform that empowers users with:

Instant legal Q&A via chatbot

Lawyer discovery and appointment booking

Access to Nepalese Constitution and major legal codes

Tiered role-based access for free and paid users

Legal news, searchable PDFs, and interpretation tools

Built for students, citizens, lawyers, and researchers.

🎯 Project Objectives
✅ Provide AI-powered answers to Nepalese legal queries

📚 Offer categorized access to national codes: Civil, Criminal, Land, Tax, Company Acts

👩‍⚖️ Help users find and book verified legal professionals

🧑‍🎓 Support research, legal education, and documentation

🌐 Build a scalable, multilingual legal assistant platform

🏗️ System Architecture
Users: Free, Basic, Premium, and Lawyer tiers

Resources: News posts, lawyers, legal documents, and chat logs

Auth: JWT-secured login, session-based routing

Monetization: Tiered services (chat limits, appointments, support access)

🛠️ Technology Stack
Layer	Stack Used
Frontend	React (Web), Flutter (Mobile)
Backend	Flask (Python API)
AI/NLP	Gemma LLM, SentenceTransformers
Search	FAISS for vector-based document retrieval
Database	MongoDB

🚀 Key Features
🤖 AI Chatbot trained on Nepalese law

📄 Law Document Library with searchable PDFs

👨‍⚖️ Lawyer Booking System with filters (location, expertise, rating)

📰 Legal News Feed from verified sources

👍👎 Like/Dislike & Comments (1 action per user)

🧩 Role-based Access Control (Free, Basic, Premium, Lawyer)

📎 PDF Upload & Interpretation (planned)

🌐 Multi-language Support (future scope)

🧪 Setup & Deployment (Web)
bash
Copy
Edit
# Clone & enter project
git clone https://github.com/sachin/lawyerup-web
cd lawyerup-web

# Install dependencies
npm install

# Environment config
echo "REACT_APP_API_URL=http://localhost:5000/api/" > .env

# Start dev server
npm start
🔐 Auth Flow
JWT stored in localStorage as lawyerup_token

Logged-in user info stored as lawyerup_user

Protected API routes use Authorization: Bearer <token> header

📚 References
Constitution of Nepal (2015)

Nepal Law Commission (legal codes, acts)

OpenAI: SentenceTransformers

Google AI: Gemma LLM

Facebook AI: FAISS

Figma, MongoDB, Flask

📜 License & Copyright
© 2025 Sachin Khatri — All rights reserved.

This project was developed as part of a final year Web API Development module (ST6003CEM) at Softwarica College of IT and E-Commerce / Coventry University.

This code and design are not to be reproduced, modified, or distributed without explicit written permission.
