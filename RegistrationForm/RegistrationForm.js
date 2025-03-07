import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { TextField, Button, Container, FormControl, Box, Alert, CircularProgress, ButtonGroup } from "@mui/material";
import { registerUser } from '../DataService';
import { Header} from '../Shared/Header/Header';
import './RegistrationForm.css';

export const RegistrationForm = () => {
    const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if(data.password !== data.cpassword) {
                setError("message", { type: "manual", message: "Password does not match" });
                setLoading(false);
            } else {
                const result = await registerUser(data.email, data.password);
                if (result.success) {
                    await setDoc(doc(db, "Users", result.user.uid), data);
                    navigate(`/profile/view/${result.user.uid}/?section=basic_details`);
                } else {
                    setError("message", { type: "manual", message: "Your user ID and/or password does not match" });
                }
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handlePageChange = () => {
        navigate(`/login`);
    };

    return (
        <div className="registrationForm">
            <Container>
                <Header />
                { loading ? (<CircularProgress color="inherit" />) : (
                    <div className="registration-form">
                        <div className="title">Welcome to <strong>myApp</strong></div>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                name='registrationForm'
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
                            <FormControl fullWidth>
                                <TextField 
                                    required
                                    fullWidth
                                    id="outlined-required"
                                    type="email"
                                    label="Email"
                                    {...register("email", { required: "Email is required" })}
                                />                               
                            </FormControl>
                            <FormControl>
                                <TextField 
                                    required 
                                    id="outlined-required" 
                                    type="password" 
                                    label="Password" 
                                    {...register("password", { required: "Password is required" })}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField 
                                    required 
                                    id="outlined-required" 
                                    type="password" 
                                    label="Confirm Password" 
                                    {...register("cpassword", { required: "Confirm password is required" })}
                                />
                            </FormControl>
                            <ButtonGroup variant="outlined" aria-label="Loading button group">
                                <Button variant="contained" type="submit" disabled={loading || !isValid}>Register</Button>
                                <Button variant="outlined" onClick={handlePageChange}>Cancel</Button>
                            </ButtonGroup>

                            {errors.message && <Alert variant="filled" severity="error">{errors.message.message}</Alert>}
                        </Box>
                    </div>
                ) }
            </Container>
        </div>
    );
}