import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import { FormLabel, Box, Button, Input } from '@mui/material';
import NavBar from '../utils/navbar';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5050/register', user);
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      alert('Error registering user');
    }
  };

  const validateData = () => {
    const password = document.getElementById('password');
    let isValid = true;

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid
  }

  return (
    <div >
      <NavBar />
       <Box component="form" onSubmit={handleRegister} sx={{display: 'flex', mx: 'auto', width: 500, my: '10%', flexDirection: 'column', gap: 2 }}>
          <h2>Register</h2>
            <FormControl>
              <FormLabel htmlFor="name">Username *</FormLabel>
                      <Input
                        type='text'
                        required
                        fullWidth
                        placeholder="Username"
                        id='username'
                        onChange={(e) => setUser({ ...user, username: e.target.value})}
                      />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        type='email'
                        fullWidth
                        placeholder="Email"
                        id='email'
                        onChange={(e) => setUser({ ...user, email: e.target.value})}
                      />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password *</FormLabel>
                      <Input
                      type='password'
                        required
                        fullWidth
                        placeholder="••••••"
                        id='password'
                        onChange={(e) => setUser({ ...user, password: e.target.value})}
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        color={passwordError ? 'error' : 'primary'}
                      />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" onClick={validateData}> Register </Button>
      </Box>
    </div>
  );
};

export default Register;
