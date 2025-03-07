import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { Button, CircularProgress, Grid, Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";
import { DynamicStack } from "../Shared/DynamicStack/DynamicStack";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PersonalPreferencesEdit = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
    const [hobbies, setHobbies] = useState([]);
    const [sports, setSports] = useState([]);
    const [musicList, setMusicList] = useState([]);
    const [shows, setShows] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const section = "personal_preferences";
    
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
        const fetchHobbies = async () => {
          try {
            setLoading(true);
            const dataDoc = await getDoc(doc(db, "Hobbies", params.id));
            if (dataDoc.exists()) {
              setHobbies(dataDoc.data().items);
            } else {
              console.log("Document not found in Firestore!");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
        const fetchSports = async () => {
            try {
              setLoading(true);
              const dataDoc = await getDoc(doc(db, "Sports", params.id));
              if (dataDoc.exists()) {
                setSports(dataDoc.data().items);
              } else {
                console.log("Document not found in Firestore!");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            } finally {
              setLoading(false);
            }
        };
        const fetchMusic = async () => {
            try {
              setLoading(true);
              const dataDoc = await getDoc(doc(db, "Music", params.id));
              if (dataDoc.exists()) {
                setMusicList(dataDoc.data().items);
              } else {
                console.log("Document not found in Firestore!");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            } finally {
              setLoading(false);
            }
        };
        const fetchShows = async () => {
            try {
              setLoading(true);
              const dataDoc = await getDoc(doc(db, "Shows", params.id));
              if (dataDoc.exists()) {
                setShows(dataDoc.data().items);
              } else {
                console.log("Document not found in Firestore!");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            } finally {
              setLoading(false);
            }
        };
        if (params.id) {
          Promise.all([fetchImage(), fetchHobbies(), fetchSports(), fetchMusic(), fetchShows()])
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

    return (
        <div className="profile-form">
            <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={4} lg={4}>
                    <div className="title">Edit <strong>Profile</strong></div>
                    <ImageUploader imageUrl={imageUrl} allowUpload={false} />
                </Grid>
                <Grid xs={12} sm={12} md={8} lg={8}>
                    <Button variant="outlined" onClick={handlePageChange}>Go back to My Profile</Button>
                    { loading ? (<CircularProgress color="inherit" />) : (
                        <div className="preferences">
                            <Accordion defaultExpanded>
                                {/* Hobbies */}
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                                    <Typography>Hobbies & Interests</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DynamicStack 
                                        items={hobbies}
                                        setItems={setHobbies}
                                        section={section}
                                        loading={loading}
                                        saveTo="Hobbies"
                                        label="Add hobbies" 
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* Sports */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                                    <Typography>Favorite Sport(s)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DynamicStack 
                                        items={sports} 
                                        setItems={setSports} 
                                        section={section} 
                                        loading={loading} 
                                        saveTo="Sports" 
                                        label="Add sports" 
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* Music */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
                                    <Typography>Preferred Music Genre(s)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DynamicStack 
                                        items={musicList} 
                                        setItems={setMusicList} 
                                        section={section} 
                                        loading={loading} 
                                        saveTo="Music" 
                                        label="Add music" 
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* TV Shows */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
                                    <Typography>Preferred Movie/TV Show(s)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DynamicStack 
                                        items={shows} 
                                        setItems={setShows} 
                                        section={section} 
                                        loading={loading} 
                                        saveTo="Shows" 
                                        label="Add TV shows" 
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </div> 
                    )}  
                </Grid>
            </Grid>
        </div>
    );
}