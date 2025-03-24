import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import NavBar from '../utils/navbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, Card, CardContent, List, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const QuizDetail = () => {
  const [quiz, setQuiz] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Initializing as null
  const [editedQuestion, setEditedQuestion] = useState({
    question: '',
    option1: '',
    option2: '',
    answer: ''
  });

  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5050/getquestions?quiz_id=${quizId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        setQuiz(res.data);
      } catch (error) {
        console.error('Error fetching quiz details', error);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  const handleDeleteQuestion = async (questionToDelete) => {
    if (!questionToDelete) return;

    console.log("Deleting question with ID:", questionToDelete["Question Number"]);

    try {
      // Use the stored questionId to delete the selected question
      await axios.delete(`http://127.0.0.1:5050/deletequestion?q_no=${questionToDelete["Question Number"]}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setOpenEditDialog(false);
      // Remove the deleted question from the state (local update)
      setQuiz(quiz.filter(question => question["Question Number"] !== questionToDelete["Question Number"]));
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateQuestion = async () => {
    try {
      const { question, option1, option2, answer } = editedQuestion;

      // Use the selected question's ID for the update request
      await axios.put(`http://127.0.0.1:5050/updatequestion?q_no=${selectedQuestion["Question Number"]}`, {
        question,       // Updated question text
        option1,        // Updated option 1
        option2,        // Updated option 2
        answer          // Updated correct answer
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },  // Bearer token for authorization
      });

      // After successful update, close the dialog and update the local state to reflect the change
      setOpenEditDialog(false);

      // Update the quiz state locally to reflect the changes without refetching the entire list
      const updatedQuiz = quiz.map(q =>
        q["Question Number"] === selectedQuestion["Question Number"]
          ? { ...q, Question: question, Option1: option1, Option2: option2, Answer: answer }
          : q
      );
      setQuiz(updatedQuiz);
    } catch (error) {
      console.error('Error updating question', error);
    }
  };

  return (
    <div>
      <NavBar />
      <Button variant="contained" onClick={() => navigate(`/quiz/${quizId}/add-question`)} sx={{ margin: 2 }}>
        Add Question
      </Button>

      {quiz.length ? (
        <List sx={{ display: 'flex', mx: 'auto', width: '90%', my: '2%', flexDirection: 'column' }}>
          <Typography variant='h6'>QUESTIONS</Typography>
          {quiz.map((question, index) => (
            <Card key={index} sx={{ display: 'flex', mx: 'auto', width: '90%', my: '2%', flexDirection: 'column', gap: 1 }}>
              <CardContent>
                <Typography variant='subtitle1'>{index + 1}. {question.Question}</Typography>
                <FormControl>
                  <FormLabel>Options</FormLabel>
                  <RadioGroup>
                    <FormControlLabel value={question.Option1} control={<Radio />} label={question.Option1} />
                    <FormControlLabel value={question.Option2} control={<Radio />} label={question.Option2} />
                    {question.Option3 && <FormControlLabel value={question.Option3} control={<Radio />} label={question.Option3} />}
                    {question.Option4 && <FormControlLabel value={question.Option4} control={<Radio />} label={question.Option4} />}
                  </RadioGroup>
                </FormControl>
                <Button variant="outlined" color="secondary" onClick={() => { 
                  setSelectedQuestion(question); 
                  setEditedQuestion({
                    questionNumber: question["Question Number"],
                    question: question.Question,
                    option1: question.Option1,
                    option2: question.Option2,
                    answer: question.Answer
                  });
                  setOpenEditDialog(true); 
                }} sx={{ marginTop: 1 }}>
                  Edit
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteQuestion(question)} sx={{ marginTop: 1 }}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <p>Loading quiz details...</p>
      )}

      {/* Edit/Delete Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            fullWidth
            value={editedQuestion.question}
            name="question"
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            label="Option 1"
            fullWidth
            value={editedQuestion.option1}
            name="option1"
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            label="Option 2"
            fullWidth
            value={editedQuestion.option2}
            name="option2"
            onChange={handleEditChange}
            margin="normal"
          />

          <TextField
            label="Answer"
            fullWidth
            value={editedQuestion.answer}
            name="answer"
            onChange={handleEditChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateQuestion} variant="contained" color="primary">
            Update
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizDetail;
