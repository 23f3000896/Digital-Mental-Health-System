#!/bin/bash

# Digital Mental Health Platform - Project Setup Script
# This script sets up the complete project structure and initializes the development environment

set -e

echo "=========================================="
echo "Digital Mental Health Platform Setup"
echo "SIH 2025 - Problem ID 25092"
echo "=========================================="

# Function to print colored output
print_status() {
    echo -e "\033[1;32m[INFO]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Create main project directory
PROJECT_NAME="digital-mental-health-platform"
print_status "Creating project directory: $PROJECT_NAME"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Create directory structure
print_status "Creating directory structure..."

# Main directories
mkdir -p docs
mkdir -p data
mkdir -p notebooks
mkdir -p frontend/{public,src/{components/{Auth,},assets/{images,styles},contexts,store,utils}}
mkdir -p backend/{src/{routes,controllers,models,middleware,utils},config}
mkdir -p ml-services/{models,data_processing,api}
mkdir -p database
mkdir -p tests/{frontend,backend,ml-services}
mkdir -p deploy
mkdir -p logs
mkdir -p uploads

print_status "Directory structure created successfully!"

# Create essential files
print_status "Creating configuration files..."

# Create package.json files
cat > backend/package.json << 'EOF'
{
  "name": "mental-health-backend",
  "version": "1.0.0",
  "description": "Backend API for Digital Mental Health Platform",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0",
    "pg": "^8.11.3",
    "redis": "^4.6.8",
    "joi": "^17.9.2",
    "socket.io": "^4.7.2",
    "axios": "^1.5.0",
    "nodemailer": "^6.9.4",
    "csv-parser": "^3.0.0",
    "natural": "^6.6.0",
    "sentiment": "^5.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "eslint": "^8.47.0"
  }
}
EOF

cat > frontend/package.json << 'EOF'
{
  "name": "mental-health-frontend",
  "version": "1.0.0",
  "description": "Frontend for Digital Mental Health Platform",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "redux": "^4.2.1",
    "react-redux": "^8.1.2",
    "@reduxjs/toolkit": "^1.9.5",
    "@mui/material": "^5.14.5",
    "@mui/icons-material": "^5.14.3",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.7.2",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "react-hook-form": "^7.45.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "proxy": "http://localhost:5000"
}
EOF

# Create Python requirements.txt
cat > requirements.txt << 'EOF'
# Core ML and Data Science Libraries
tensorflow==2.13.0
torch==2.0.1
transformers==4.33.2
scikit-learn==1.3.0
pandas==2.1.0
numpy==1.24.3
matplotlib==3.7.2
seaborn==0.12.2

# Natural Language Processing
nltk==3.8.1
spacy==3.6.1
textblob==0.17.1
vaderSentiment==3.3.2

# Web Framework for ML API
flask==2.3.3
flask-cors==4.0.0
gunicorn==21.2.0

# Database
sqlalchemy==2.0.20
psycopg2-binary==2.9.7
redis==4.6.0

# Utilities
jupyter==1.0.0
requests==2.31.0
python-dotenv==1.0.0
EOF

# Create .env template
cat > .env.example << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mental_health_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# ML Service Configuration
ML_SERVICE_URL=http://localhost:8000

# Crisis Detection
CRISIS_THRESHOLD=0.8
EMERGENCY_CONTACT_EMAIL=crisis@your-platform.com
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
.env
.venv/
venv/

# Build outputs
build/
dist/
*.log

# Data files (large files)
*.csv
*.json
data/*.csv
data/*.json

# Model files
models/*.pkl
models/*.joblib
models/*.h5

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/
EOF

# Create basic README
cat > README.md << 'EOF'
# Digital Mental Health and Psychological Support System

## SIH 2025 - Problem ID 25092

A comprehensive digital platform designed to provide mental health and psychological support for students in higher education institutions.

## Quick Start

1. Clone the repository and navigate to the project directory
2. Set up environment variables: `cp .env.example .env`
3. Install backend dependencies: `cd backend && npm install`
4. Install frontend dependencies: `cd frontend && npm install`
5. Set up Python environment: `python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
6. Set up database (PostgreSQL required)
7. Run the application:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm start`
   - ML Services: `cd ml-services && python app.py`

## Features

- AI-Powered Chatbot
- Mood Tracking
- Peer Support Forum
- Counselor Booking
- Crisis Detection
- Admin Dashboard
- VR Calm Room
- Resource Hub

## Technology Stack

- Frontend: React.js, Material-UI, Redux
- Backend: Node.js, Express.js
- ML Services: Python, Flask, TensorFlow, scikit-learn
- Database: PostgreSQL, Redis
- Deployment: Docker, Docker Compose

For detailed setup instructions, see the documentation in the `docs/` directory.
EOF

# Create basic Docker files
cat > deploy/docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mental_health_2025
      POSTGRES_DB: mental_health_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ../backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres

volumes:
  postgres_data:
EOF

# Create basic database schema
cat > database/schema.sql << 'EOF'
-- Basic schema for mental health platform
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message_text TEXT NOT NULL,
    is_bot BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mood_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

print_status "Configuration files created!"

# Create placeholder component files
print_status "Creating React component templates..."

# Create basic App.js
cat > frontend/src/App.js << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <h1>Mental Health Platform</h1>
          <p>Welcome to the Digital Mental Health Platform</p>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
EOF

# Create basic backend index.js
cat > backend/src/index.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mental Health Platform API is running' });
});

// Basic route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

print_status "Basic component files created!"

# Create data directory structure for user's files
print_status "Setting up data directory for your files..."
print_warning "Please move your data files to the data/ directory:"
echo "  - mental_health_digital_behavior_data.csv -> data/"
echo "  - reddit_mental_health_combined.csv -> data/"
echo "  - mental_health.json -> data/"
echo "  - something.json -> data/"
echo "  - sentiment_analysis.csv -> data/"
echo "  - mental_healt_comprehensive.csv -> data/"
echo "  - mental_health_conversations.csv -> data/"
echo "  - dialogue_training.csv -> data/"
echo "  - conversations_training.csv -> data/"
echo "  - input_output.json -> data/"
echo ""
print_warning "Please move your notebook files to the notebooks/ directory:"
echo "  - chatbot-for-mental-health-conversations.ipynb -> notebooks/"
echo "  - mental-health-support-model-tpu-genie.ipynb -> notebooks/"

# Create setup instructions
cat > SETUP.md << 'EOF'
# Setup Instructions

## Prerequisites

1. Node.js (v14 or higher)
2. Python (v3.8 or higher)
3. PostgreSQL
4. Redis (optional, for caching)

## Installation Steps

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env file with your database credentials and configuration
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Python/ML Services Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Database Setup
```bash
# Create PostgreSQL database
createdb mental_health_db
# Run schema
psql -d mental_health_db -f database/schema.sql
```

### 6. Move Your Data Files
- Copy all your CSV and JSON files to the `data/` directory
- Copy your Jupyter notebooks to the `notebooks/` directory

### 7. Process Your Data (Optional)
```bash
cd ml-services
python data_processing/process_datasets.py
```

## Running the Application

1. Start PostgreSQL and Redis (if using)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm start`
4. Start ML services: `cd ml-services && python app.py`

## Docker Setup (Alternative)

```bash
cd deploy
docker-compose up -d
```

This will start all services in containers.
EOF

print_status "Setup complete!"
echo ""
echo "=========================================="
print_status "Project structure created successfully!"
echo "=========================================="
echo ""
print_status "Next steps:"
echo "1. Move your data files to the data/ directory"
echo "2. Move your notebooks to the notebooks/ directory" 
echo "3. Follow the instructions in SETUP.md"
echo "4. Start developing your mental health platform!"
echo ""
print_warning "Don't forget to:"
echo "- Configure your .env file with database credentials"
echo "- Install PostgreSQL and Redis"
echo "- Set up your development environment"
echo ""
echo "Happy coding! 🚀"