import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
import { Container, Grid, Paper } from '@mui/material';
import { Link , useNavigate } from 'react-router-dom';
// import { Password } from '@mui/icons-material';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { signInUser } from './accountSlice';
import { useAppDispatch } from '../../app/store/configureStore';



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
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {register, handleSubmit,formState:{isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    }) // use handleSubmit from useForm

    
    async function submitForm(data: FieldValues) {  // data是React Hook Form提供的提交数据对象（表单的键值对）
        await dispatch(signInUser(data));
        navigate('/catalog');

    }

    // const[values, setValues] = React.useState({
    //     username: '',
    //     password: ''
    // })

    // const handleSubmit = (event: any) => {
    //     event.preventDefault();
    //     agent.Account.login(values);
    // }

    // function handleInputChange(event: any) {
    //     const {name, value} = event.target;  // 每个event都有一个target-object的属性
    //     setValues({...values, [name]: value});
    // }

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
                    onSubmit={handleSubmit(submitForm)}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormLabel htmlFor="username">Username</FormLabel>
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
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            // label = "password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            // required
                            fullWidth
                            variant="outlined"
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors.password}
                            helperText={errors?.password?.message as string}
                        />
                    </FormControl>
                    <LoadingButton loading={isSubmitting}
                        disabled={!isValid}  //the Button will be disabled if the form is not valid
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt:3, mb:2 }}
                    >
                        Login
                    </LoadingButton>
                </Box>

                <Grid container>
                    <Grid item>
                        <Link to='/register' style={{ textDecoration: 'none' }}>
                            {"Don't have an account? Sign Up"}
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
