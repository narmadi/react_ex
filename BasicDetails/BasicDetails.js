import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { TextField, FormControl, Box, CircularProgress, Button, Grid } from "@mui/material";
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";
import './BasicDetails.css';
import '../Shared/VerticalTabs/VerticalTabs.css';

export const BasicDetails = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
    const params = useParams();
    const navigate = useNavigate();
    const section = "basic_details";

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
          const userDoc = await getDoc(doc(db, "Basic_Details", params.id));
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
      navigate(`/profile/edit/${params.id}/?section=${section}`);
    };

    return (
      <div className="detail-form">
        <Grid container spacing={2}>
          <Grid xs={12} sm={12} md={4} lg={4}>
            <div className="title">My <strong>Profile</strong></div>
            <ImageUploader imageUrl={imageUrl} allowUpload={true} />
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
                      <div className="label">Salutation</div>
                      <TextField value={userData.salutation} size="small" disabled />
                  </FormControl>
                  <FormControl fullWidth>
                      <div className="label">First Name</div>
                      <TextField value={userData.first_name} size="small" disabled />
                  </FormControl>
                  <FormControl fullWidth>
                      <div className="label">Last Name</div>
                      <TextField value={userData.last_name} size="small" disabled />
                  </FormControl>
                  <FormControl fullWidth>
                      <div className="label">Email</div>
                      <TextField type="email" value={userData.email} size="small" disabled/>
                  </FormControl>   
              </Box> 
            ) }       
          </Grid>
        </Grid>
      </div>
    );
}