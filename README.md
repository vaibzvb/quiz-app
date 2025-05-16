# Quiz App - Full Stack Deployment (Flask + React)

##  GitHub Repository (Private)
This project is hosted in a private repository to comply with academic integrity policies.

---

##  Live Application

- **Frontend URL**: [http://3.143.242.34:3000/login](http://3.143.242.34:3000/login)
- **Backend URL**: [http://3.145.190.141:5050](http://3.145.190.141:5050)

---

## 🛠️ Software Stack

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: SQLite
- **Authentication**: JWT Tokens
- **Containerization**: Docker
- **Cloud Deployment**: AWS ECS Fargate
- **CI/CD**: GitHub Actions

---

##  API Overview

| Endpoint                  | Method | Description                  |
|---------------------------|--------|------------------------------|
| `/register`              | POST   | Register a new user          |
| `/login`                 | POST   | Authenticate a user and get JWT |
| `/create_quiz`           | POST   | Add a new quiz               |
| `/add_question`          | POST   | Add question to a quiz       |
| `/delete_question`       | DELETE | Remove a specific question   |
| `/edit_question`         | PUT    | Edit an existing question    |

> 📂 **Postman Test Collection**: `backend/Cloud HW1.postman_collection.json`

---

## 🧪 API Testing

- All APIs were tested using **Postman**.
- JWT tokens were added to headers where needed (`Authorization: Bearer <token>`).
- Test cases include register, login, create quiz, add/edit/delete question.
- Unit test cases were created using pytest and exceuted 


---

##  Continuous Integration (CI)

CI is handled via **GitHub Actions**:

- On every push to `cloud-new` branch:
  - Builds Docker images for **frontend** and **backend**
  - Pushes them to **Docker Hub**
  - Manual ECS update to new Task Definition Revision

 **Screenshots included**:
- GitHub Actions success pipeline
- Docker image push logs

Workflow files:
- `.github/workflows/frontend.yml`
- `.github/workflows/backend.yml`

---

##  Docker & ECS Deployment

- Frontend and backend each have separate **Dockerfiles**.
- A `docker-compose.yml` is used for local dev & testing.
- Both services deployed on **AWS ECS Fargate** using **Docker images**.
- ECS services are **not deployed directly to hardware** — they run serverlessly.

---

## Security Implementation

- **JWT tokens** are used to authenticate and protect routes.
- Tokens are stored client-side and sent with each API call.
- CORS is enabled in Flask to allow cross-origin requests.
- No hardcoded secrets or credentials are exposed.

---


---

##  Screenshot Highlights

-  GitHub Actions - CI/CD Success
-  Docker images pushed to Docker Hub
-  ECS Cluster with frontend/backend services running
-  ECS Task Definitions and Service details
-  Postman API Testing (register, login, quiz operations)
-  Working frontend + endpoint integrations



---

##  Author

**Vaibhav Achar**  
 Submitted on: **March 24, 2025**
