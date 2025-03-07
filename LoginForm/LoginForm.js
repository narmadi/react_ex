import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { TextField, Button, FormControl, FormControlLabel, Box, Checkbox, Alert, CircularProgress, Typography, Stack } from "@mui/material";
import { Header} from '../Shared/Header/Header';
import { loginUser } from '../DataService';
import './LoginForm.css';
import { Container } from "@mui/system";

export const LoginForm = () => {
    const { register, handleSubmit, setError, formState: { errors, isValid }, setValue } = useForm({ mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate(`/register`);
        window.location.reload();
    }

    /* submit */
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await loginUser(data.email, data.password);
            if(result.success) {
                navigate(`/profile/view/${result.user.uid}/?section=basic_details`);
            }    
        } catch (error) {
            setError("message", { type: "manual", message: "Your user ID and/or password does not match" });
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="loginForm">
            <Container>
                <Header />
                { loading ? (<CircularProgress color="inherit" />) : (
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        name='loginForm'
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" }, // Responsive width
                            padding: { xs: 1, sm: 2, md: 3, lg: 4 }, // Responsive padding
                            margin: "auto", // Center align
                            display: "flex",
                            flexDirection: "column",
                            gap: 2, // Adds spacing between elements
                        }}
                    >
                        <div className="title">Welcome to <b>myApp</b></div>
                        <FormControl fullWidth>
                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                spacing={2} 
                                sx={{ 
                                    flexDirection: { xs: "column", sm: "row" }, 
                                    alignItems: "center" 
                                }}
                            >
                                <TextField 
                                    required
                                    fullWidth
                                    id="outlined-required"
                                    type="email"
                                    label="Email"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </Stack>                                
                        </FormControl>
                        <FormControl fullWidth>
                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                spacing={2}
                                sx={{ 
                                    flexDirection: { xs: "column", sm: "row" }, 
                                    alignItems: "center" 
                                }}
                            >
                                <TextField 
                                    required 
                                    fullWidth
                                    id="outlined-required" 
                                    type="password" 
                                    label="Password"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </Stack>                                
                        </FormControl>
                        <FormControl fullWidth>
                            <FormControlLabel 
                                control={<Checkbox defaultChecked />} 
                                onChange={() => setRememberMe(!rememberMe)} 
                                label="keep me logged in"
                            />
                        </FormControl>
                        <FormControl>
                            <Button variant="contained" type="submit" disabled={loading || !isValid}>
                                Login
                            </Button>
                        </FormControl>
                        
                        {errors.message && <Alert variant="filled" severity="error">{errors.message.message}</Alert>}
                        <p>No account? <Button onClick={handleRegister}>Register here</Button></p>
                    </Box>
                )}
            </Container>
        </div>
    );
}