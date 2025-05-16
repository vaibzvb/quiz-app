import pytest
from app import app, db, User_Table

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_register_user(client):
    response = client.post('/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    assert response.status_code == 201
    assert response.json["message"] == "user added succesfully "

def test_login_user(client):
    # First register a user
    client.post('/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    
    # Then try to login
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    assert response.status_code == 200
    assert 'JWT_token' in response.json 