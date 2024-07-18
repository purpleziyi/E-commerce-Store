import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from 'react-router-dom';

export default function ServerError() {
    const { state } = useLocation();   // use Hook-function useLocation

    return (
        <Container component={Paper}>
            {state?.error ? (   // when there is error
                <>
                    <Typography gutterBottom variant='h3' color='secondary'>{state.error.title}</Typography>
                    <Divider />
                    <Typography variant='body1'>{state.error.detail || 'Internal Server Error'}</Typography> 
                    {/*如果在production中运行，那就无法使用stacktrace，所以就简单写一个Internal Server Error */}
                </>
            ) : ( 
                <Typography gutterBottom variant='h3' color='secondary'>Server error</Typography>
            )}
        </Container>
    )
}