import pandas as pd
import numpy as np
import json
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import re
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import warnings
warnings.filterwarnings('ignore')

# Download required NLTK data
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('omw-1.4')
except:
    pass

class MentalHealthDataProcessor:
    def __init__(self, data_path='../data/'):
        self.data_path = data_path
        self.models_path = '../models/'
        os.makedirs(self.models_path, exist_ok=True)
        
        # Initialize NLP tools
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.analyzer = SentimentIntensityAnalyzer()
        
        # Initialize vectorizer and models
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.sentiment_model = None
        self.crisis_model = None
        
    def preprocess_text(self, text):
        """Clean and preprocess text data"""
        if pd.isna(text):
            return ""
        
        # Convert to lowercase
        text = str(text).lower()
        
        # Remove URLs, mentions, hashtags
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize and remove stopwords
        tokens = word_tokenize(text)
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens 
                 if token not in self.stop_words and len(token) > 2]
        
        return ' '.join(tokens)
    
    def load_and_process_sentiment_data(self):
        """Load and process sentiment analysis data"""
        print("Processing sentiment analysis data...")
        
        try:
            # Load sentiment analysis CSV
            sentiment_df = pd.read_csv(os.path.join(self.data_path, 'sentiment_analysis.csv'))
            print(f"Loaded sentiment data: {sentiment_df.shape}")
            
            # Assume columns: 'text', 'label' or 'sentiment'
            text_col = None
            label_col = None
            
            for col in sentiment_df.columns:
                if 'text' in col.lower() or 'message' in col.lower():
                    text_col = col
                elif 'sentiment' in col.lower() or 'label' in col.lower():
                    label_col = col
            
            if text_col and label_col:
                # Clean the data
                sentiment_df = sentiment_df.dropna(subset=[text_col, label_col])
                sentiment_df['processed_text'] = sentiment_df[text_col].apply(self.preprocess_text)
                
                # Remove empty processed texts
                sentiment_df = sentiment_df[sentiment_df['processed_text'].str.len() > 0]
                
                return sentiment_df[['processed_text', label_col]]
            
        except Exception as e:
            print(f"Error loading sentiment data: {e}")
        
        return None
    
    def load_and_process_conversations(self):
        """Load and process conversation data for chatbot training"""
        print("Processing conversation data...")
        
        conversations = []
        
        # Process dialogue training data
        try:
            dialogue_df = pd.read_csv(os.path.join(self.data_path, 'dialogue_training.csv'))
            print(f"Loaded dialogue training data: {dialogue_df.shape}")
            
            # Find input/output columns
            input_cols = [col for col in dialogue_df.columns if 'input' in col.lower() or 'question' in col.lower() or 'user' in col.lower()]
            output_cols = [col for col in dialogue_df.columns if 'output' in col.lower() or 'response' in col.lower() or 'bot' in col.lower()]
            
            if input_cols and output_cols:
                for _, row in dialogue_df.iterrows():
                    conversations.append({
                        'input': self.preprocess_text(row[input_cols[0]]),
                        'response': str(row[output_cols[0]])
                    })
        except Exception as e:
            print(f"Error loading dialogue training data: {e}")
        
        # Process mental health conversations
        try:
            mh_conv_df = pd.read_csv(os.path.join(self.data_path, 'mental_health_conversations.csv'))
            print(f"Loaded mental health conversations: {mh_conv_df.shape}")
            
            # Process based on typical structure
            for _, row in mh_conv_df.iterrows():
                if 'Context' in row and 'Response' in row:
                    conversations.append({
                        'input': self.preprocess_text(row['Context']),
                        'response': str(row['Response'])
                    })
        except Exception as e:
            print(f"Error loading mental health conversations: {e}")
        
        return conversations
    
    def detect_crisis_indicators(self, text):
        """Detect crisis indicators in text"""
        crisis_keywords = [
            'suicide', 'kill myself', 'end my life', 'want to die', 'no point living',
            'harm myself', 'hurt myself', 'cut myself', 'overdose', 'jump off',
            'worthless', 'hopeless', 'can\'t go on', 'give up', 'end it all'
        ]
        
        text_lower = str(text).lower()
        crisis_score = sum(1 for keyword in crisis_keywords if keyword in text_lower)
        
        # Get sentiment polarity
        sentiment = self.analyzer.polarity_scores(text)
        
        # Combine crisis keywords and negative sentiment
        final_score = crisis_score + abs(sentiment['neg']) * 2
        
        return final_score > 2  # Threshold for crisis detection
    
    def train_sentiment_model(self, sentiment_df):
        """Train sentiment analysis model"""
        print("Training sentiment analysis model...")
        
        if sentiment_df is None or len(sentiment_df) == 0:
            print("No sentiment data available for training")
            return
        
        X = sentiment_df['processed_text']
        y = sentiment_df.iloc[:, 1]  # Label column
        
        # Encode labels if they're not numeric
        if y.dtype == 'object':
            le = LabelEncoder()
            y = le.fit_transform(y)
            # Save label encoder
            with open(os.path.join(self.models_path, 'sentiment_label_encoder.pkl'), 'wb') as f:
                pickle.dump(le, f)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Vectorize the text
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        # Train the model
        self.sentiment_model = LogisticRegression(random_state=42)
        self.sentiment_model.fit(X_train_vec, y_train)
        
        # Evaluate
        y_pred = self.sentiment_model.predict(X_test_vec)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Sentiment Model Accuracy: {accuracy:.4f}")
        
        # Save the model and vectorizer
        with open(os.path.join(self.models_path, 'sentiment_model.pkl'), 'wb') as f:
            pickle.dump(self.sentiment_model, f)
        
        with open(os.path.join(self.models_path, 'sentiment_vectorizer.pkl'), 'wb') as f:
            pickle.dump(self.vectorizer, f)
        
        print("Sentiment model saved successfully!")
    
    def create_crisis_dataset_and_model(self):
        """Create crisis detection dataset and train model"""
        print("Creating crisis detection model...")
        
        # Load all text data for crisis detection
        all_texts = []
        labels = []
        
        # Process mental health conversations
        try:
            mh_df = pd.read_csv(os.path.join(self.data_path, 'mental_health_conversations.csv'))
            for _, row in mh_df.iterrows():
                for col in mh_df.columns:
                    if 'text' in col.lower() or 'message' in col.lower() or 'context' in col.lower():
                        text = str(row[col])
                        if len(text) > 10:
                            all_texts.append(text)
                            labels.append(1 if self.detect_crisis_indicators(text) else 0)
        except Exception as e:
            print(f"Error processing mental health data for crisis detection: {e}")
        
        # Process Reddit data
        try:
            reddit_df = pd.read_csv(os.path.join(self.data_path, 'reddit_mental_health_combined.csv'))
            for _, row in reddit_df.iterrows():
                text = str(row.get('title', '')) + ' ' + str(row.get('selftext', ''))
                if len(text) > 20:
                    all_texts.append(text)
                    labels.append(1 if self.detect_crisis_indicators(text) else 0)
        except Exception as e:
            print(f"Error processing Reddit data for crisis detection: {e}")
        
        if len(all_texts) > 0:
            # Create dataset
            crisis_df = pd.DataFrame({
                'text': all_texts,
                'crisis': labels
            })
            
            # Balance the dataset
            crisis_count = sum(labels)
            non_crisis_count = len(labels) - crisis_count
            print(f"Crisis texts: {crisis_count}, Non-crisis texts: {non_crisis_count}")
            
            if crisis_count > 0:
                # Preprocess texts
                crisis_df['processed_text'] = crisis_df['text'].apply(self.preprocess_text)
                crisis_df = crisis_df[crisis_df['processed_text'].str.len() > 0]
                
                # Train model
                X = crisis_df['processed_text']
                y = crisis_df['crisis']
                
                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                
                # Create new vectorizer for crisis detection
                crisis_vectorizer = TfidfVectorizer(max_features=3000, stop_words='english')
                X_train_vec = crisis_vectorizer.fit_transform(X_train)
                X_test_vec = crisis_vectorizer.transform(X_test)
                
                # Train crisis detection model
                self.crisis_model = RandomForestClassifier(n_estimators=100, random_state=42)
                self.crisis_model.fit(X_train_vec, y_train)
                
                # Evaluate
                y_pred = self.crisis_model.predict(X_test_vec)
                accuracy = accuracy_score(y_test, y_pred)
                print(f"Crisis Detection Model Accuracy: {accuracy:.4f}")
                print("\nClassification Report:")
                print(classification_report(y_test, y_pred))
                
                # Save the crisis model and vectorizer
                with open(os.path.join(self.models_path, 'crisis_model.pkl'), 'wb') as f:
                    pickle.dump(self.crisis_model, f)
                
                with open(os.path.join(self.models_path, 'crisis_vectorizer.pkl'), 'wb') as f:
                    pickle.dump(crisis_vectorizer, f)
                
                print("Crisis detection model saved successfully!")
    
    def create_chatbot_responses(self):
        """Create chatbot response dataset"""
        print("Creating chatbot response dataset...")
        
        conversations = self.load_and_process_conversations()
        
        if conversations and len(conversations) > 0:
            # Save conversations for chatbot training
            with open(os.path.join(self.models_path, 'chatbot_conversations.json'), 'w') as f:
                json.dump(conversations, f, indent=2)
            
            print(f"Saved {len(conversations)} conversation pairs for chatbot training")
        
        # Create basic response templates
        response_templates = {
            'greeting': [
                "Hello! I'm here to support you. How are you feeling today?",
                "Hi there! I'm glad you're here. What's on your mind?",
                "Welcome! I'm here to listen and help. How can I support you today?"
            ],
            'anxiety': [
                "I understand you're feeling anxious. Let's try some breathing exercises together.",
                "Anxiety can be overwhelming. Remember, you're not alone in this.",
                "It's okay to feel anxious sometimes. Would you like to talk about what's triggering these feelings?"
            ],
            'depression': [
                "I hear that you're going through a difficult time. Your feelings are valid.",
                "Depression can make everything feel heavy. Taking it one day at a time is okay.",
                "Thank you for sharing with me. Remember that seeking help is a sign of strength."
            ],
            'crisis': [
                "I'm very concerned about what you've shared. Please reach out to a crisis helpline immediately: 9152987821",
                "Your life has value. Please contact emergency services (108) or a mental health professional right away.",
                "I want to help you stay safe. Please call the National Suicide Prevention Lifeline: 9152987821"
            ],
            'encouragement': [
                "You're taking positive steps by reaching out. That takes courage.",
                "Remember, recovery is a journey, not a destination. Be patient with yourself.",
                "You've overcome challenges before, and you have the strength to get through this too."
            ]
        }
        
        with open(os.path.join(self.models_path, 'response_templates.json'), 'w') as f:
            json.dump(response_templates, f, indent=2)
        
        print("Response templates created and saved!")
    
    def process_all_data(self):
        """Main method to process all data and train models"""
        print("Starting data processing and model training...")
        print("="*50)
        
        # Load and process sentiment data
        sentiment_df = self.load_and_process_sentiment_data()
        
        # Train sentiment model
        self.train_sentiment_model(sentiment_df)
        
        # Create and train crisis detection model
        self.create_crisis_dataset_and_model()
        
        # Create chatbot response dataset
        self.create_chatbot_responses()
        
        print("="*50)
        print("Data processing and model training completed!")
        print(f"Models saved in: {self.models_path}")
        
        # Create a summary report
        summary = {
            'sentiment_model': os.path.exists(os.path.join(self.models_path, 'sentiment_model.pkl')),
            'crisis_model': os.path.exists(os.path.join(self.models_path, 'crisis_model.pkl')),
            'chatbot_data': os.path.exists(os.path.join(self.models_path, 'chatbot_conversations.json')),
            'response_templates': os.path.exists(os.path.join(self.models_path, 'response_templates.json')),
            'processed_date': pd.Timestamp.now().isoformat()
        }
        
        with open(os.path.join(self.models_path, 'processing_summary.json'), 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary

if __name__ == "__main__":
    processor = MentalHealthDataProcessor()
    summary = processor.process_all_data()
    print("\nProcessing Summary:", json.dumps(summary, indent=2))