import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import { Box, FormControl, FormLabel, Input, Button, Typography } from '@mui/material';
import NavBar from '../utils/navbar';

const CreateQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const navigate = useNavigate();

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://3.145.190.141:5050/create_quiz', 
        { quiz_name: quizName }, 
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );
      navigate('/'); // Redirect to homepage after successful creation
    } catch (error) {
      console.error('Error creating quiz', error);
    }
  };

  return (
    <div>
      <NavBar />
      <Box component="form" onSubmit={handleCreateQuiz} sx={{ display: 'flex', mx: 'auto', width: 500, my: '10%', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h4'>Create Quiz</Typography>

        <FormControl>
          <FormLabel htmlFor="quizName">Quiz Name *</FormLabel>
          <Input
            type="text"
            required
            fullWidth
            placeholder="Quiz Name"
            id="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </FormControl>

        <Button type="submit" fullWidth variant="contained">
          Create
        </Button>
      </Box>
    </div>
  );
};

export default CreateQuiz;
