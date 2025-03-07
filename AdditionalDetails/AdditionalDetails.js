
import { useParams, useNavigate , useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { TextField, FormControl, Box, CircularProgress, Button, Grid } from "@mui/material";
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";
import '../BasicDetails/BasicDetails.css';

export const AdditionalDetails = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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
            Promise.all([fetchImage(), fetchUserData()])
              .then(() => {
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
              });
        }
    }, [searchParams]); 

    const handlePageChange = () => {
        navigate(`/profile/edit/${params.id}/?section=${section}`);
    };

    return (
        <div className="detail-form">            
            <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={4} lg={4}>
                    <div className="title">My <strong>Profile</strong></div>
                    <ImageUploader imageUrl={imageUrl} allowUpload={false} />
                </Grid>
                <Grid xs={12} sm={12} md={8} lg={8}>
                    <Button variant="outlined" onClick={handlePageChange}>Edit Profile</Button>
                    { loading ? (<CircularProgress color="inherit" />) : (
                        <Box 
                            component="form"
                            noValidate
                            autoComplete="off"
                            name='detailForm'
                            >
                            <FormControl fullWidth>
                                <div className="label">Address</div>
                                <TextField value={userData.address} size="small" disabled />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Country</div>
                                <TextField value={userData.country} size="small" disabled />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Postal Code</div>
                                <TextField value={userData.postal_code} size="small" disabled />
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">DOB</div>
                                <TextField value={userData.dob} size="small" disabled/>
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Gender</div>
                                <TextField value={userData.gender} size="small" disabled/>
                            </FormControl>
                            <FormControl fullWidth>
                                <div className="label">Marital Status</div>
                                <TextField value={userData.marital_status} size="small" disabled/>
                            </FormControl>   
                        </Box>
                    ) }  
                </Grid>
            </Grid> 
        </div>
    );
}