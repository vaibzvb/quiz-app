import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import NavBar from '../utils/navbar';
import { Button, Card, CardContent, List, Typography, Checkbox, FormControlLabel, Box } from '@mui/material';

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // { questionNo: [selectedOptions] }
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const { quizId } = useParams();

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://10.0.0.33:5050/get_quizes', {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        setQuizzes(res.data.quizes || []);
      } catch (error) {
        console.error('Error fetching quizzes', error);
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch questions when a quiz is selected
  useEffect(() => {
    if (!selectedQuizId) return;
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://10.0.0.33:5050/getquestions?quiz_id=${selectedQuizId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        setQuestions(res.data.Questions || []);
      } catch (error) {
        console.error('Error fetching questions', error);
      }
    };
    fetchQuestions();
  }, [selectedQuizId]);

  // Handle answer selection
  const handleAnswerChange = (qNo, option) => {
    setUserAnswers(prev => {
      const prevAnswers = prev[qNo] || [];
      if (prevAnswers.includes(option)) {
        // Uncheck
        return { ...prev, [qNo]: prevAnswers.filter(o => o !== option) };
      } else {
        // Check
        return { ...prev, [qNo]: [...prevAnswers, option] };
      }
    });
  };

  // Calculate score
  const handleSubmit = () => {
    let total = 0;
    questions.forEach(q => {
      const correct = Array.isArray(q.Answers) ? [...q.Answers].sort() : [q.Answers];
      const user = (userAnswers[q["Question Number"]] || []).sort();
      if (
        correct.length === user.length &&
        correct.every((ans, idx) => ans === user[idx])
      ) {
        total += 1;
      }
    });
    setScore(total);
  };

  // UI
  return (
    <div>
      <NavBar />
      <Typography variant="h4" sx={{ m: 2 }}>Take Quiz</Typography>
      {!selectedQuizId ? (
        <Box sx={{ m: 2 }}>
          <Typography variant="h6">Select a Quiz:</Typography>
          <List>
            {quizzes.map(quiz => (
              <Card key={quiz.quiz_id} sx={{ my: 1 }}>
                <CardContent>
                  <Button variant="contained" onClick={() => setSelectedQuizId(quiz.quiz_id)}>
                    {quiz.quiz_name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ m: 2 }}>
          <Typography variant="h5">Quiz Questions</Typography>
          <List>
            {questions.map((q, idx) => (
              <Card key={q["Question Number"]} sx={{ my: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{idx + 1}. {q.Question}</Typography>
                  {[q.Option1, q.Option2, q.Option3, q.Option4].filter(Boolean).map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={(userAnswers[q["Question Number"]] || []).includes(option)}
                          onChange={() => handleAnswerChange(q["Question Number"], option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
          {score !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Your Score: {score} / {questions.length}
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default TakeQuiz; 