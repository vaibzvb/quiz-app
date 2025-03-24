import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getAuthToken } from '../utils/auth';
import NavBar from '../utils/navbar';

const EditQuestion = () => {
  const { quizId, questionId } = useParams();
  const navigate = useNavigate();

  const [questionDetails, setQuestionDetails] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5050/getquestion/${quizId}/${questionId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        setQuestionDetails(res.data);
      } catch (error) {
        setError('Error fetching question details');
        console.error(error);
      }
    };

    fetchQuestionDetails();
  }, [quizId, questionId]);

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:5050/updatequestion/${quizId}/${questionId}`,
        questionDetails,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error('Error updating question', error);
      setError('Error updating question');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <Typography variant="h4" sx={{ margin: 2 }}>Edit Question</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        label="Question"
        variant="outlined"
        fullWidth
        margin="normal"
        name="question"
        value={questionDetails.question}
        onChange={handleChange}
      />
      <TextField
        label="Option 1"
        variant="outlined"
        fullWidth
        margin="normal"
        name="option1"
        value={questionDetails.option1}
        onChange={handleChange}
      />
      <TextField
        label="Option 2"
        variant="outlined"
        fullWidth
        margin="normal"
        name="option2"
        value={questionDetails.option2}
        onChange={handleChange}
      />
      <TextField
        label="Option 3"
        variant="outlined"
        fullWidth
        margin="normal"
        name="option3"
        value={questionDetails.option3}
        onChange={handleChange}
      />
      <TextField
        label="Option 4"
        variant="outlined"
        fullWidth
        margin="normal"
        name="option4"
        value={questionDetails.option4}
        onChange={handleChange}
      />
      <TextField
        label="Answer"
        variant="outlined"
        fullWidth
        margin="normal"
        name="answer"
        value={questionDetails.answer}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Save Changes
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/quiz/${quizId}`)}
        sx={{ marginTop: 2, marginLeft: 2 }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default EditQuestion;
