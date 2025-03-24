from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

from flask_cors import CORS
from flask_cors import cross_origin
from datetime import timedelta

app = Flask(__name__)
CORS(app)  

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["JWT_SECRET_KEY"] = "JWTsecretkey"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30) 

db = SQLAlchemy(app)
jwt = JWTManager(app)


class User_Table(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String,unique=True,nullable=False)
    pwd = db.Column(db.String, nullable=False)

class Quiz(db.Model):
    quiz_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_name = db.Column(db.String, unique=True, nullable=False) 


class Question(db.Model):
    q_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    question = db.Column(db.String, nullable=False)
    option1 = db.Column(db.String, nullable=False)
    option2 = db.Column(db.String, nullable=False)
    answer = db.Column(db.String, nullable=False)

def create_tables():
    with app.app_context():
        db.create_all()
    



@app.route('/register', methods=['POST'])
@cross_origin() 
def signup():
    try:
        username = request.get_json().get("username")
        password = request.get_json().get("password")

        newUser = User_Table(username=username,pwd=password)
        db.session.add(newUser)
        db.session.commit()

        return jsonify({"success":True,"message":"user added succesfully "})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e),"success": False})
    
@app.route('/login', methods=['POST'])
@cross_origin() 
def login():
    try:
        username = request.get_json().get("username")
        password = request.get_json().get("password")

        user = User_Table.query.filter_by(username=username).first()
        if password == user.pwd:
            JWT_token = create_access_token(identity=username)
            return jsonify({"success":True,"JWT_token":JWT_token})
        else:
            return jsonify({"success":False,"error":"Either uname or password is incorrect"})
        
    except Exception as e:
        return jsonify({"error":str(e),"success": False})
    




@app.route("/create_quiz", methods=["POST"])
@cross_origin() 
@jwt_required()
def create_quiz():
    try:
       
        name = request.get_json().get("quiz_name")

        if not name:
            return jsonify({"error": "Quiz name is required!"})

        new_quiz = Quiz(quiz_name=name)
        db.session.add(new_quiz)
        db.session.commit()

        return jsonify({"success": True, "message": "Quiz created successfully!", "quiz_id": new_quiz.quiz_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e), "success": False})
    
@app.route("/get_quizes", methods=["GET"])
@cross_origin() 
@jwt_required()
def get_quizzes():
    try:
        # Fetch all quizzes from the database
        all_quizes = Quiz.query.all()
        
        # Prepare an empty list to hold quiz data
        quiz_list = []
        
        # Loop through all quizzes and add them to quiz_list
        for quiz in all_quizes:
            quiz_list.append({"quiz_id": quiz.quiz_id, "quiz_name": quiz.quiz_name})
        
        # Return the list of quizzes after the loop
        return jsonify({"success": True, "quizes": quiz_list})

    except Exception as e:
        # Handle any errors that occur during the query
        return jsonify({"success": False, "error": str(e)})


    except Exception as e:
        return jsonify({"error": str(e), "success": False})
    


@app.route("/addquestion", methods=["POST"])
@cross_origin() 
@jwt_required()
def add_question():
    try:
        print(request.data)
        quiz_id = request.get_json().get("quiz_id")
        question = request.get_json().get("question")
        option1 = request.get_json().get("option1") 
        option2 = request.get_json().get("option2") 
        answer = request.get_json().get("answer")

        if not quiz_id or not question or not option1 or not option2 or not answer:
            return jsonify({"error": "All fields (question, option1, option2, answer) are required!"})


        new_question = Question(quiz_id=quiz_id,question=question, option1=option1, option2=option2, answer=answer)
        db.session.add(new_question)
        db.session.commit()

        return jsonify({"success":True,"message":"Question created succesfully "})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e),"success": False})
    

@app.route("/getquestions", methods=["GET"])
@cross_origin() 
@jwt_required()
def get_question():
    print(request)
    try:

        quiz_id = request.args.get("quiz_id")
        

        if not quiz_id:
            return jsonify({"error": "quiz_id parameter is required!"})
        
        questions = Question.query.filter_by(quiz_id=quiz_id).all()

        if not questions:
            return jsonify({"error": "No questions found "})


        question_bank=[]
        for question in questions:
            question_bank.append({"Question Number" : question.q_no,
                                "Question": question.question,
                                "Option1":question.option1,
                                "Option2": question.option2,
                                "Answer": question.answer
                                })
        return question_bank
        return jsonify({"Questions":question_bank,"success":True})
    except Exception as e:
        return jsonify({"error":str(e),"success": False,})
    



@app.route("/updatequestion", methods=["PUT"])
@cross_origin() 
@jwt_required()
def update_question():
    try:
        q_no = request.args.get("q_no")
        question = Question.query.get(q_no)

        question.question = request.get_json().get("question")
        question.option1 = request.get_json().get("option1")
        question.option2 = request.get_json().get("option2")
        question.answer = request.get_json().get("answer")

        db.session.commit()
        return jsonify({"success": True, "message": "Question updated successfully!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e),"success": False,})


@app.route("/deletequestion", methods=["DELETE"])
@cross_origin() 
@jwt_required()
def delete_question():
    try:
        q_no = request.args.get("q_no")
        if not q_no:
            return jsonify({"error": "Question Id is compulsory"})
        
        question = Question.query.get(q_no)
        if not question:
            return jsonify({"error": "No questions found to delete"})

        db.session.delete(question)
        db.session.commit()
        return jsonify({"success": True, "message": "Question deleted successfully!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e),"success": False,})


@app.route('/')
@cross_origin() 
def home():
    return "Server is running!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)