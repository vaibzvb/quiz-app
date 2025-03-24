import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import NavBar from '../utils/navbar';
import { Box, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/get_quizes', {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        // Check if the response has a 'quizes' property and is an array
        if (res.data && Array.isArray(res.data.quizes)) {
          setQuizzes(res.data.quizes); // Set the quizzes state
        } else {
          console.error('Quizzes data is not in the expected format', res.data);
        }
      } catch (error) {
        console.error('Error fetching quizzes', error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div>
      <NavBar />
      <Box sx={{ display: 'flex', mx: 'auto', width: '90%', my: '2%', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h5'>Quizzes</Typography>
        <List>
          {quizzes.map((quiz) => (
            <Card key={quiz.quiz_id} sx={{ display: 'flex', mx: 'auto', width: '90%', my: '2%', flexDirection: 'column', gap: 2 }}>
              <ListItem button onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}>
                <ListItemText primary={quiz.quiz_name} />
              </ListItem>
            </Card>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default QuizList;
