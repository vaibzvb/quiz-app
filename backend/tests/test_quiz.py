import pytest
from app import app, db, User_Table
import json

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
    if 'JWT_token' not in response.json:
        print('Login response:', response.json)
        raise AssertionError(f"JWT_token not in response: {response.json}")
    return response.json['JWT_token']

def test_create_quiz(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.post('/create_quiz', json={
        'quiz_name': 'Test Quiz'
    }, headers=headers)
    assert response.status_code == 200
    assert b'Quiz created successfully' in response.data

def test_add_question_multiple_answers(client):
    # Register and login to get token
    client.post('/register', json={
        'username': 'testuser2',
        'password': 'testpass2'
    })
    login_resp = client.post('/login', json={
        'username': 'testuser2',
        'password': 'testpass2'
    })
    token = login_resp.json.get('JWT_token')
    headers = {'Authorization': f'Bearer {token}'}

    # Create a quiz
    quiz_resp = client.post('/create_quiz', json={"quiz_name": "Quiz for Multi-Answer"}, headers=headers)
    quiz_id = quiz_resp.json.get('quiz_id')

    # Add a question with multiple correct answers
    payload = {
        "quiz_id": quiz_id,
        "question": "Select even numbers",
        "option1": "2",
        "option2": "3",
        "option3": "4",
        "option4": "5",
        "answers": ["2", "4"]
    }
    response = client.post("/addquestion", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json["success"] is True

def test_get_questions_returns_answers_list(client):
    # Register and login to get token
    client.post('/register', json={
        'username': 'testuser3',
        'password': 'testpass3'
    })
    login_resp = client.post('/login', json={
        'username': 'testuser3',
        'password': 'testpass3'
    })
    token = login_resp.json.get('JWT_token')
    headers = {'Authorization': f'Bearer {token}'}

    # Create a quiz
    quiz_resp = client.post('/create_quiz', json={"quiz_name": "Quiz for Answers List"}, headers=headers)
    quiz_id = quiz_resp.json.get('quiz_id')

    # Add a question with multiple correct answers
    payload = {
        "quiz_id": quiz_id,
        "question": "Select odd numbers",
        "option1": "1",
        "option2": "2",
        "option3": "3",
        "option4": "4",
        "answers": ["1", "3"]
    }
    client.post("/addquestion", json=payload, headers=headers)

    # Get questions and check answers is a list
    response = client.get(f"/getquestions?quiz_id={quiz_id}", headers=headers)
    assert response.status_code == 200
    questions = response.json["Questions"]
    assert isinstance(questions, list)
    for q in questions:
        assert isinstance(q["Answers"], list) 