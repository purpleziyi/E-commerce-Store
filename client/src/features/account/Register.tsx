import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
import { Alert, AlertTitle, Container, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Link, useNavigate  } from 'react-router-dom';
// import { Password } from '@mui/icons-material';
import {useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { useState } from 'react';
import { toast } from 'react-toastify';



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


export default function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    }) // use handleSubmit from useForm

    function handleApiErrors(errors: any) {
        console.log(errors);
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('Email')) {
                    setError('email', { message: error })
                } else if (error.includes('Username')) {
                    setError('username', { message: error })
                }
            });
        }
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
                    Register
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(data => agent.Account.register(data)
                        .then(() => {
                            toast.success('Registration successful - you can now login');
                            navigate('/login');
                        })
                        .catch(error => handleApiErrors(error)))
                    }
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    {/* <FormLabel htmlFor="username">Username</FormLabel> */}
                    <TextField
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        autoFocus
                        variant="outlined"
                        {...register('username', { required: 'Username is required' })}
                        error={!!errors.username}
                        helperText={errors?.username?.message as string}
                    />
                    {/* <FormLabel htmlFor="email">Email</FormLabel> */}
                    <TextField
                        fullWidth
                        label="Email"
                        autoComplete="email"
                        variant="outlined"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                                message: 'Not a valid email address'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors?.email?.message as string}
                    />

                    <FormControl>
                        {/* <FormLabel htmlFor="password">Password</FormLabel> */}
                        <TextField
                            label = "password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            // required
                            fullWidth
                            variant="outlined"
                            {...register('password', {
                                required: 'password is required',
                                pattern: {
                                    value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                    message: 'Password does not meet complexity requirements'
                                }
                            })}
                            error={!!errors.password}
                            helperText={errors?.password?.message as string}
                        />
                    </FormControl>

                    <LoadingButton loading={isSubmitting}
                        disabled={!isValid}  //the Button will be disabled if the form is not valid
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </LoadingButton>
                </Box>

                <Grid container>
                    <Grid item>
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            {"Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
                {/* <Typography>
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} to="/register" variant="body2">
                        Sign up
                    </Link>
                </Typography> */}
            </Card>
        </Container>
    );
}
