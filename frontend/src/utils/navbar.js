import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';

const NavBar = () => {
    const navItems = {
        'Add Quiz' : '/create-quiz',
        'Logout' : '/login'
    };

    const navigate = useNavigate();
    const currentURL = window.location.pathname.replace('/', '');

    const LoggedNav = () => {
        return (
            <List sx={{ display: 'flex', gap: 2 }}>
                {Object.keys(navItems).map((key, index) => (
                    <ListItem key={index} sx={{ width: 'auto' }} button onClick={() => navigate(navItems[key])}>
                        <ListItemText primary={key} />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'brown' }}> {/* Change the background color to brown */}
            <Box sx={{ flexGrow: 1 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left side - Logo */}
                    <Button variant="inherit" onClick={() => navigate('/')}>
                        <Typography variant="h6" mx={1}>QUIZ APP</Typography>
                    </Button>

                    {/* Right side - Buttons */}
                    <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                        {currentURL === 'login' && (
                            <Button variant="inherit" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        )}
                        {currentURL === 'register' && (
                            <Button variant="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        )}
                        {!(currentURL === 'login' || currentURL === 'register') && <LoggedNav />}
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default NavBar;
