# ML Services Tests Structure

This directory contains test files for Python-based machine learning services, models, and data processing pipelines.

## Test Organization

### /models/
Tests for machine learning model functionality:
- `test_sentiment_model.py` - Sentiment analysis model tests
- `test_crisis_detection.py` - Crisis detection model tests
- `test_chatbot_model.py` - Chatbot response generation tests
- `test_mood_prediction.py` - Mood prediction model tests
- `test_behavior_analysis.py` - Digital behavior analysis tests

### /data_processing/
Tests for data preprocessing and feature engineering:
- `test_text_preprocessing.py` - Text cleaning and preprocessing tests
- `test_feature_extraction.py` - Feature extraction pipeline tests
- `test_data_validation.py` - Data quality and validation tests
- `test_data_transformation.py` - Data transformation tests
- `test_data_loader.py` - Data loading and batching tests

### /api/
Tests for ML service API endpoints:
- `test_sentiment_api.py` - Sentiment analysis API tests
- `test_crisis_api.py` - Crisis detection API tests
- `test_chatbot_api.py` - Chatbot response API tests
- `test_prediction_api.py` - Prediction service API tests
- `test_health_check.py` - Service health monitoring tests

### /utils/
Tests for utility functions and helpers:
- `test_model_utils.py` - Model loading and saving utilities
- `test_text_utils.py` - Text processing utility functions
- `test_metrics.py` - Model evaluation metrics tests
- `test_config.py` - Configuration management tests
- `test_logging.py` - Logging utility tests

### /integration/
Integration tests for complete ML workflows:
- `test_training_pipeline.py` - Model training pipeline tests
- `test_prediction_pipeline.py` - Prediction workflow tests
- `test_data_pipeline.py` - End-to-end data processing tests
- `test_model_serving.py` - Model serving integration tests

### /performance/
Performance and load testing:
- `test_model_latency.py` - Model response time tests
- `test_throughput.py` - API throughput benchmarks
- `test_memory_usage.py` - Memory consumption tests
- `test_concurrent_requests.py` - Concurrent request handling

## Testing Technologies

- **pytest**: Python testing framework
- **pytest-cov**: Coverage reporting
- **unittest.mock**: Mocking and patching
- **pandas**: Data testing utilities  
- **numpy**: Numerical testing
- **scikit-learn**: ML model testing utilities
- **requests**: HTTP API testing
- **hypothesis**: Property-based testing

## Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/models/test_sentiment_model.py

# Run tests with verbose output
pytest -v

# Run only integration tests
pytest tests/integration/

# Run performance tests
pytest tests/performance/ -m performance

# Run tests in parallel
pytest -n auto
```

## Test Configuration

### pytest.ini
```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
markers =
    unit: Unit tests
    integration: Integration tests
    performance: Performance tests
    slow: Slow running tests
addopts = 
    --strict-markers
    --disable-warnings
    --tb=short
```

### conftest.py
Common fixtures and test configuration:
```python
import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock
from src.models.sentiment_model import SentimentModel

@pytest.fixture
def sample_text_data():
    """Sample text data for testing"""
    return [
        "I feel great today!",
        "This is terrible, I hate everything",
        "Just an ordinary day nothing special"
    ]

@pytest.fixture
def sample_labels():
    """Sample sentiment labels"""
    return ['positive', 'negative', 'neutral']

@pytest.fixture
def mock_model():
    """Mock ML model for testing"""
    model = Mock(spec=SentimentModel)
    model.predict.return_value = ['positive']
    model.predict_proba.return_value = [[0.1, 0.8, 0.1]]
    return model

@pytest.fixture
def test_database():
    """Test database connection"""
    # Setup test database
    yield db_connection
    # Cleanup
```

## Example Test Structure

```python
# tests/models/test_sentiment_model.py
import pytest
import numpy as np
import pandas as pd
from unittest.mock import patch, Mock
from src.models.sentiment_model import SentimentModel
from src.data_processing.preprocessor import TextPreprocessor

class TestSentimentModel:
    """Test suite for sentiment analysis model"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.model = SentimentModel()
        self.preprocessor = TextPreprocessor()
        
    def test_model_initialization(self):
        """Test model initializes correctly"""
        assert self.model is not None
        assert hasattr(self.model, 'predict')
        assert hasattr(self.model, 'train')
    
    def test_predict_positive_sentiment(self, sample_text_data):
        """Test prediction of positive sentiment"""
        text = "I am very happy today!"
        prediction = self.model.predict([text])
        
        assert len(prediction) == 1
        assert prediction[0] in ['positive', 'negative', 'neutral']
    
    def test_predict_batch(self, sample_text_data, sample_labels):
        """Test batch prediction"""
        predictions = self.model.predict(sample_text_data)
        
        assert len(predictions) == len(sample_text_data)
        assert all(pred in ['positive', 'negative', 'neutral'] for pred in predictions)
    
    def test_predict_empty_input(self):
        """Test handling of empty input"""
        with pytest.raises(ValueError):
            self.model.predict([])
    
    def test_predict_probability_scores(self, sample_text_data):
        """Test probability score output"""
        probabilities = self.model.predict_proba(sample_text_data)
        
        assert probabilities.shape[0] == len(sample_text_data)
        assert probabilities.shape[1] == 3  # 3 classes
        assert np.allclose(probabilities.sum(axis=1), 1.0)  # Probabilities sum to 1
    
    @patch('src.models.sentiment_model.joblib.load')
    def test_model_loading(self, mock_load):
        """Test model loading from file"""
        mock_load.return_value = Mock()
        
        model = SentimentModel.load('test_model.pkl')
        
        mock_load.assert_called_once_with('test_model.pkl')
        assert model is not None
    
    def test_training_data_validation(self):
        """Test training data validation"""
        # Test with invalid data
        with pytest.raises(ValueError):
            self.model.train([], [])
        
        # Test with mismatched lengths
        with pytest.raises(ValueError):
            self.model.train(['text1', 'text2'], ['label1'])

class TestCrisisDetection:
    """Test suite for crisis detection functionality"""
    
    def test_crisis_keyword_detection(self):
        """Test crisis keyword identification"""
        from src.models.crisis_detection import detect_crisis_keywords
        
        crisis_text = "I want to hurt myself"
        normal_text = "I want to help myself"
        
        assert detect_crisis_keywords(crisis_text) == True
        assert detect_crisis_keywords(normal_text) == False
    
    def test_crisis_scoring(self):
        """Test crisis risk scoring"""
        from src.models.crisis_detection import calculate_crisis_score
        
        high_risk_text = "I have no reason to live anymore"
        low_risk_text = "I'm having a bad day"
        
        high_score = calculate_crisis_score(high_risk_text)
        low_score = calculate_crisis_score(low_risk_text)
        
        assert high_score > low_score
        assert 0 <= high_score <= 1
        assert 0 <= low_score <= 1
```

## Data Testing

### Test Data Management
```python
# tests/fixtures/data_fixtures.py
import pandas as pd
import pytest

@pytest.fixture
def mental_health_conversations():
    """Sample conversation data"""
    return pd.DataFrame({
        'context': ['I feel anxious', 'I am depressed'],
        'response': ['I understand...', 'That sounds difficult...']
    })

@pytest.fixture
def sentiment_training_data():
    """Sample sentiment analysis training data"""
    return pd.DataFrame({
        'text': ['Great day!', 'Terrible experience', 'Okay I guess'],
        'sentiment': ['positive', 'negative', 'neutral']
    })
```

### Data Quality Tests
```python
def test_data_completeness(mental_health_conversations):
    """Test data has no missing values in critical columns"""
    assert not mental_health_conversations['context'].isnull().any()
    assert not mental_health_conversations['response'].isnull().any()

def test_data_types(sentiment_training_data):
    """Test correct data types"""
    assert sentiment_training_data['text'].dtype == 'object'
    assert sentiment_training_data['sentiment'].dtype == 'object'

def test_label_distribution(sentiment_training_data):
    """Test balanced label distribution"""
    label_counts = sentiment_training_data['sentiment'].value_counts()
    assert len(label_counts) == 3  # positive, negative, neutral
```

## Model Performance Tests

```python
def test_model_accuracy_threshold():
    """Test model meets minimum accuracy threshold"""
    from src.models.sentiment_model import SentimentModel
    from src.evaluation.metrics import calculate_accuracy
    
    model = SentimentModel.load('trained_model.pkl')
    X_test, y_test = load_test_data()
    
    predictions = model.predict(X_test)
    accuracy = calculate_accuracy(y_test, predictions)
    
    assert accuracy >= 0.80  # Minimum 80% accuracy

def test_model_inference_speed():
    """Test model inference speed"""
    import time
    from src.models.sentiment_model import SentimentModel
    
    model = SentimentModel.load('trained_model.pkl')
    test_texts = ["Sample text"] * 100
    
    start_time = time.time()
    predictions = model.predict(test_texts)
    end_time = time.time()
    
    inference_time = (end_time - start_time) / len(test_texts)
    assert inference_time < 0.1  # Less than 100ms per prediction
```

## API Testing

```python
# tests/api/test_sentiment_api.py
import pytest
import requests
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_sentiment_analysis_endpoint():
    """Test sentiment analysis API endpoint"""
    response = client.post(
        "/api/sentiment/analyze",
        json={"text": "I am very happy today!"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"]

def test_crisis_detection_endpoint():
    """Test crisis detection API endpoint"""
    response = client.post(
        "/api/crisis/detect",
        json={"text": "I don't want to live anymore", "user_id": 123}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "crisis_detected" in data
    assert "risk_level" in data
    assert isinstance(data["crisis_detected"], bool)
```

## Coverage Targets

- **Statements**: 90%+
- **Branches**: 85%+  
- **Functions**: 95%+
- **Lines**: 90%+

## Mock Strategy

Mock external dependencies and heavy computations:
```python
@patch('src.models.sentiment_model.joblib.load')
@patch('src.data_processing.preprocessor.nltk.download')
def test_with_mocked_dependencies(mock_nltk, mock_joblib):
    """Test with mocked external dependencies"""
    # Test implementation
    pass
```