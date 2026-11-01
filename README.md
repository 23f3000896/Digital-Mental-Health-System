Digital Mental Health and Psychological Support System
A comprehensive digital platform designed to provide mental health and psychological support for students in higher education institutions.

Features
AI-Powered Chatbot: Intelligent conversational agent trained on mental health data
Mood Tracking: Digital behavior analysis and mood monitoring
Peer Support Forum: Safe community space for students to connect
Counselor Booking: Secure appointment scheduling with mental health professionals
Crisis Response: Immediate help and escalation procedures
Admin Dashboard: Institution-wide analytics and insights
VR Calm Room: Immersive relaxation experiences
Resource Hub: Educational content and self-help materials
Tech Stack
Frontend
React.js
Material-UI/Chakra UI
Redux for state management
WebRTC for video calls
Backend
Node.js with Express.js
Python Flask/FastAPI for ML services
PostgreSQL/MongoDB for data storage
Redis for caching and sessions
AI/ML
TensorFlow/PyTorch for model training
Hugging Face Transformers
Natural Language Processing (NLP)
Sentiment Analysis
Deployment
Docker containerization
AWS/Azure cloud deployment
CI/CD with GitHub Actions
Installation
Prerequisites
Node.js (v14+)
Python (v3.8+)
PostgreSQL
Redis
Docker (optional)
Setup
Clone the repository
git clone <repository-url>
cd digital-mental-health-platform
Install frontend dependencies
cd frontend
npm install
Install backend dependencies
cd backend
npm install
Set up Python environment for ML services
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Set up environment variables
cp .env.example .env
# Edit .env with your configuration
Initialize database
cd database
psql -U postgres -f schema.sql
Start the services
# Backend
cd backend && npm start

# Frontend  
cd frontend && npm start

# ML Services
cd ml-services && python app.py
Data Files
The project includes several datasets for training and analysis:

mental_health_digital_behavior_data.csv - Digital behavior metrics
sentiment_analysis.csv - Sentiment labeled data
mental_health_conversations.csv - Training dialogues
dialogue_training.csv - Conversation pairs
reddit_mental_health_combined.csv - Community discussions
mental_health.json - Chatbot intents and responses
Contributing
Fork the repository
Create a feature branch
Make your changes
Submit a pull request
