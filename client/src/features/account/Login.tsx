import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
import { Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// import { Password } from '@mui/icons-material';
import agent from '../../app/api/agent';



const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));


export default function Login() {
    const[values, setValues] = React.useState({
        username: '',
        password: ''
    })

    const handleSubmit = (event: any) => {
        event.preventDefault();
        agent.Account.login(values);
    }

    function handleInputChange(event: any) {
        const {name, value} = event.target;  // 每个event都有一个target-object的属性
        setValues({...values, [name]: value});
    }

    return (
        <Container
            component={Paper}
            maxWidth='sm'
            sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    {/* <FormControl> */}
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <TextField
                            fullWidth
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            name="username"  // name 属性的值要确保与 values 对象中的键一致
                            // required
                            variant="outlined"
                            onChange={handleInputChange}
                            value = {values.username}
                        />
                    {/* </FormControl> */}
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            name="password"
                            label = "password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            // required
                            fullWidth
                            variant="outlined"
                            onChange={handleInputChange}
                            value={values.password}

                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt:3, mb:2 }}
                    >
                        Login
                    </Button>
                </Box>

                {/* <Grid container>
                    <Grid item>
                        <Link to='/register' style={{ textDecoration: 'none' }}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid> */}
                <Typography>
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} to="/register" variant="body2">
                        Sign up
                    </Link>
                </Typography>
            </Card>
        </Container>
    );
}
