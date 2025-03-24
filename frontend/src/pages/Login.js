import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';
import FormControl from '@mui/material/FormControl';
import { Box, Input, FormLabel, Button } from '@mui/material'
import NavBar from '../utils/navbar'


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://3.145.190.141:5050/login', credentials);
      console.log(JSON.stringify(res.data['JWT_token']))
      setAuthToken(res.data.JWT_token);
      navigate('/');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <NavBar />
      <Box component="form" onSubmit={handleLogin} sx={{display: 'flex', mx: 'auto', width: 500, my: '10%', flexDirection: 'column', gap: 2 }}>
          <h2>Login</h2>
            <FormControl>
              <FormLabel htmlFor="name">Username *</FormLabel>
                      <Input
                        type='text'
                        required
                        fullWidth
                        placeholder="Username"
                        id='username'
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      />
            </FormControl>
            <Button type="submit" fullWidth variant="contained"> Login </Button>
      </Box>
    </div>
  );
};

export default Login;
