import pytest
from app import app, db
from app.models import User, Quiz

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

@pytest.fixture
def auth_token(client):
    # Register and login to get token
    client.post('/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    return response.json['token']

def test_create_quiz(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.post('/quiz', json={
        'title': 'Test Quiz',
        'description': 'Test Description',
        'questions': [
            {
                'question': 'What is 2+2?',
                'options': ['3', '4', '5', '6'],
                'correct_answer': '4'
            }
        ]
    }, headers=headers)
    assert response.status_code == 201
    assert b'Quiz created successfully' in response.data

def test_get_quiz(client, auth_token):
    # First create a quiz
    headers = {'Authorization': f'Bearer {auth_token}'}
    client.post('/quiz', json={
        'title': 'Test Quiz',
        'description': 'Test Description',
        'questions': [
            {
                'question': 'What is 2+2?',
                'options': ['3', '4', '5', '6'],
                'correct_answer': '4'
            }
        ]
    }, headers=headers)
    
    # Then try to get it
    response = client.get('/quiz/1', headers=headers)
    assert response.status_code == 200
    assert response.json['title'] == 'Test Quiz' 