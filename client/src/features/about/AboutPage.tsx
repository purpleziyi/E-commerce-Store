import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError() {
        agent.TestErrors.getValidationError()
            .then(() => console.log('should not see this!')) // request sucessfully fullfilled
            .catch(error => setValidationErrors(error));  // 验证error并传入error-layer
    }
    
    return (
        <Container>
            <Typography gutterBottom variant={'h2'}>Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
                {/*使用catch来捕捉方法中所有的error*/}
                <Button onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))} variant={'contained'}>Test 500 error</Button>
                <Button onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))} variant={'contained'}>Test 404 error</Button>
                <Button onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))} variant={'contained'}>Test 400 error</Button>
                <Button onClick={getValidationError} variant={'contained'}>Test validation error</Button>
                <Button onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))} variant={'contained'}>Test 401 error</Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&  // if error occurs, then execute rightside of &&
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => (
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>}
        </Container>
    )
}