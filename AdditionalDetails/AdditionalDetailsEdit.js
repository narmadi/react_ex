import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, FormControl, Box, Alert, ButtonGroup, MenuItem, CircularProgress, Grid } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";

const genderList = [
    { value: 'Male', label: 'Male'},
    { value: 'Female', label: 'Female'}
];

const maritalStatusList = [
    { value: 'Single', label: 'Single'},
    { value: 'Married', label: 'Married'}
];

export const AdditionalDetailsEdit = () => {
    const { handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });
    const [userData, setUserData] = useState({ address: '', country: '', postal_code: '', dob: '', gender: '', marital_status: '' });
    const [loading, setLoading] = useState(false);
    const [helperText, setHelperText] = useState({ address: '', country: '', postal_code: '', dob: '', gender: '', marital_status: '' });
    const [errorMessages, setErrorMessages] = useState({ address: false, country: false, postal_code: false, dob: false, gender: false, marital_status: false });
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
    const params = useParams();
    const navigate = useNavigate();
    const isFormValid = Object.values(userData).every((value) => value.trim() !== "");
    const MIN_AGE = 17;
    const section = "additional_details";
    
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
            const userDoc = await getDoc(doc(db, "Additional_Details", params.id));
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
            Promise.all([fetchImage(), fetchUserData(), getMinDOB()])
              .then(() => {
                setLoading(false);
            })
              .catch((err) => {
                setLoading(false);
            });
        }
    }, []);

    const getMinDOB = () => {
        // const currentDate = new Date();
        // const minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 17));
        // const formattedMinDate = minDate.toISOString().split("T")[0];

        // Calculate the maximum date (today - 17 years)
        const maxDate = dayjs().subtract(MIN_AGE, "year");
        return maxDate;
    }

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
        const userDoc = await getDoc(doc(db, "Additional_Details", params.id));
        if(userDoc.exists()) {
            try {
                await updateDoc(doc(db, "Additional_Details", params.id), userData);
                navigate(`/profile/view/${params.id}/?section=${section}`);
            } catch (error) {
                console.error("Error updating user:", error);
            }
            setLoading(false);
        } else {
            try {
                await setDoc(doc(db, "Additional_Details", params.id), userData);
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
                    <ImageUploader imageUrl={imageUrl} allowUpload={false} />
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
                                <div className="label">Address</div>
                                <TextField 
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="address"
                                    value={userData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.address}
                                    helperText={helperText.address}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Country</div>
                                <TextField 
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="country"
                                    value={userData.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.country}
                                    helperText={helperText.country}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Postal Code</div>
                                <TextField
                                    type="number"
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="postal_code"
                                    value={userData.postal_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.postal_code}
                                    helperText={helperText.postal_code}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Date of Birth</div>
                                <TextField
                                    type="date"
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="dob"
                                    value={userData.dob}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.dob}
                                    helperText={helperText.dob}
                                    inputProps={{
                                        min: getMinDOB(), // Min date set for 17 years ago
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Gender</div>
                                <TextField
                                    select
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="gender"
                                    value={userData.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.gender}
                                    helperText={helperText.gender}
                                >
                                    {genderList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Marital Status</div>
                                <TextField
                                    select
                                    required
                                    size="small"
                                    label="Required"
                                    id="outlined-required"
                                    name="marital_status"
                                    value={userData.marital_status}
                                    onChange={handleChange}
                                    onBlur={handleBlur} // Show error when user leaves field empty
                                    error={errorMessages.marital_status}
                                    helperText={helperText.marital_status}
                                >
                                    {maritalStatusList.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </TextField>
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