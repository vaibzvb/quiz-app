import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import NavBar from '../utils/navbar';
import { Box, Button, Input, List, ListItem, Typography, TextareaAutosize, InputLabel } from '@mui/material';

const AddQuestion = () => {
  const [question, setQuestion] = useState({
    text: '',
    choices: [{ text: '', is_correct: false }, { text: '', is_correct: false }],
  });
  const { quizId } = useParams(); // Get the quiz ID from the URL
  const navigate = useNavigate();

  // Handle input change for question text and choices
  const handleInputChange = (e, index, field) => {
    const updatedChoices = [...question.choices];
    updatedChoices[index][field] = e.target.value;
    setQuestion({ ...question, choices: updatedChoices });
  };

  // Add a new choice input field
  const addChoice = () => {
    setQuestion({ ...question, choices: [...question.choices, { text: '', is_correct: false }] });
  };

  // Remove a choice input field
  const removeChoice = (index) => {
    const updatedChoices = question.choices.filter((_, i) => i !== index);
    setQuestion({ ...question, choices: updatedChoices });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure at least two options and a correct answer
    if (question.choices.length < 2) {
      console.error('At least two options are required');
      return;
    }

    let data = {
      quiz_id: quizId,
      question: question.text,
      option1: question.choices[0].text,
      option2: question.choices[1].text,
    };

    // Loop through choices to find the correct answer
    question.choices.forEach((options) => {
      if (options.is_correct) {
        data['answer'] = options.text;
      }
    });

    console.log(data);

    try {
      await axios.post(
        `http://3.145.190.141:5050/addquestion`,
        data,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <Typography sx={{ mx: 2, my: 2 }} variant="h5">
        Add Question to Quiz {quizId}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', mx: 'auto', width: 500, my: '10%', flexDirection: 'column', gap: 2 }}>
        <InputLabel color="info" variant="standard">
          Question
        </InputLabel>
        <TextareaAutosize
          minRows={5}
          type="text"
          placeholder="Type the Question!!"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
          required
        />
        <List>
          {question.choices.map((choice, index) => (
            <ListItem key={index}>
              <Input
                type="text"
                placeholder={`Choice ${index + 1}`}
                value={choice.text}
                onChange={(e) => handleInputChange(e, index, 'text')}
                required
              />
              <Input
                sx={{ mx: 1 }}
                type="checkbox"
                checked={choice.is_correct}
                onChange={(e) => handleInputChange(e, index, 'is_correct')}
              />
              <Typography sx={{ mx: 1 }} variant="span">
                Correct
              </Typography>
              <Button sx={{ mx: 1 }} variant="text" type="button" onClick={() => removeChoice(index)}>
                Remove Choice
              </Button>
            </ListItem>
          ))}
        </List>
        {question.choices.length < 4 && (
          <Button variant="contained" type="button" onClick={addChoice}>
            Add Choice
          </Button>
        )}
        <Button variant="contained" type="submit">
          Save Question
        </Button>
      </Box>
    </div>
  );
};

export default AddQuestion;
