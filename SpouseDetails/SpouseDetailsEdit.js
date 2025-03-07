import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, FormControl, Box, Alert, ButtonGroup, MenuItem, CircularProgress, Grid } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";

const salutations = [
    { value: 'Mr', label: 'Mr'},
    { value: 'Ms', label: 'Ms'},
    { value: 'Mrs', label: 'Mrs'}
];

export const SpouseDetailsEdit = () => {
    const { handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });
    const [userData, setUserData] = useState({salutation: '', first_name: '', last_name: '' });
    const [loading, setLoading] = useState(false);
    const [helperText, setHelperText] = useState({salutation: '', first_name: '', last_name: '' });
    const [errorMessages, setErrorMessages] = useState({salutation: false, first_name: false, last_name: false });
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
    const params = useParams();
    const navigate = useNavigate();
    const isFormValid = Object.values(userData).every((value) => value.trim() !== "");
    const section = "spouse_details";
    
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const userRef = doc(db, "Users", params.id);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().image_url) {
                    setImageUrl(userSnap.data().image_url);
                } else {
                    console.log("No profile image found.");
                }
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };
        const fetchUserData = async () => {
          try {
            setLoading(true);
            const userDoc = await getDoc(doc(db, "Spouse_Details", params.id));
            if (userDoc.exists()) {
              setUserData(userDoc.data());
              console.log("Fetched user data:", userDoc.data());
            } else {
              console.log("User document not found in Firestore!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };
        if (params.id) {
        Promise.all([fetchImage(), fetchUserData()])
            .then(() => {
            setLoading(false);
            })
            .catch((err) => {
            setLoading(false);
            });
        }
    }, []);

    const handlePageChange = () => {
        navigate(`/profile/view/${params.id}/?section=${section}`);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
        // Clear error when user starts typing again
        setErrorMessages({ ...errorMessages, [name]: false });
        setHelperText({ ...helperText, [name]: "" });
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        if (!value.trim()) { 
            setErrorMessages({ ...errorMessages, [name]: true });
            setHelperText({ ...helperText, [name]: "This field cannot be empty!" });
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        const userDoc = await getDoc(doc(db, "Spouse_Details", params.id));        
        if(userDoc.exists()) {
            try {
                // Save user details to Firestore in the 'Spouse_Details' collection using UID as the document ID
                await updateDoc(doc(db, "Spouse_Details", params.id), userData);
                navigate(`/profile/view/${params.id}/?section=${section}`);
            } catch (error) {
                console.error("Error updating user:", error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                await setDoc(doc(db, "Spouse_Details", params.id), userData);
                navigate(`/profile/view/${params.id}/?section=${section}`);
            } catch (error) {
                console.error("Error saving user:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="detail-form">
            <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={4} lg={4}>
                    <div className="title">Edit <strong>Profile</strong></div>
                    <ImageUploader imageUrl={imageUrl} allowUpload={true} />
                </Grid>
                <Grid xs={12} sm={12} md={8} lg={8}>
                    <Button variant="outlined" onClick={handlePageChange}>Go back to My Profile</Button>
                    { loading ? (<CircularProgress color="inherit" />) : (
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            name='detailsForm'
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <FormControl fullWidth>
                                <div className="label">Salutation</div>
                                <TextField
                                    select
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="salutation"
                                    value={userData.salutation}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.salutation}
                                    helperText={helperText.salutation}
                                >
                                    {salutations.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">First Name</div>
                                <TextField
                                    required
                                    label="Required"
                                    size="small"
                                    id="outlined-required"
                                    name="first_name"
                                    value={userData.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.first_name}
                                    helperText={helperText.first_name}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Last Name</div>
                                <TextField 
                                    required
                                    label="Required"
                                    size="small"
                                    id="outlined-required"
                                    name="last_name"
                                    value={userData.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.last_name}
                                    helperText={helperText.last_name}
                                />
                            </FormControl>             
                            <ButtonGroup className="tab-indent" aria-label="Loading button group">
                                <Button variant="contained" type="submit" disabled={loading || !isValid || !isFormValid} startIcon={<SaveIcon />}>Save & Update</Button>
                                <Button variant="outlined" onClick={handlePageChange}>Cancel</Button>
                            </ButtonGroup>

                            {errors.message && <Alert variant="filled" severity="error">{errors.message.message}</Alert>}
                        </Box>  
                    )}                
                </Grid>
            </Grid>
        </div>
    );
}