import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Typography, CircularProgress, Button, Grid, Accordion, AccordionSummary, AccordionDetails, Stack, Divider } from "@mui/material";
import { db } from "../FirebaseConfig";
import { ImageUploader } from "../Shared/ImageUploader/ImageUploader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../BasicDetails/BasicDetails.css';
import './PersonalPreferences.css';

export const PersonalPreferences = () => {
    const [loading, setLoading] = useState(false);
    const [hobbies, setHobbies] = useState([]);
    const [sports, setSports] = useState([]);
    const [musicList, setMusicList] = useState([]);
    const [shows, setShows] = useState([]);
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL+"/assets/images/user.png"); 
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
            console.log(shows);
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
      navigate(`/profile/edit/${params.id}/?section=${section}`);
    };

    return (
        <div className="personal-preferences">
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={4} lg={4}>
              <div className="title">My <strong>Profile</strong></div>
              <ImageUploader imageUrl={imageUrl} allowUpload={true} />
            </Grid>
            <Grid xs={12} sm={12} md={8} lg={8}>
              <Button variant="outlined" onClick={handlePageChange}>Edit Profile</Button>
              { loading ? (<CircularProgress color="inherit" />) : ( 
                <div className="preferences">
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                      <Typography>Hobbies & Interests</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack 
                        spacing={2} 
                        direction="row" 
                        useFlexGap 
                        flexWrap="wrap"
                        sx={{ border: "1px solid #ddd", padding: 2 }} 
                        divider={<Divider orientation="vertical" flexItem
                      />}>
                        { Array.isArray(hobbies) && hobbies.length > 0 ? (
                          hobbies.map((item, index) => (
                            <Stack key={item.id || index} direction="row" alignItems="center">
                              <Typography variant="body1">{item}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography>No items added</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                      <Typography>Favorite Sport(s)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack 
                        spacing={2} 
                        direction="row" 
                        useFlexGap 
                        flexWrap="wrap"
                        sx={{ border: "1px solid #ddd", padding: 2 }} 
                        divider={<Divider orientation="vertical" flexItem
                      />}>
                        { Array.isArray(sports) && sports.length > 0 ? (
                          sports.map((item, index) => (
                            <Stack key={item.id || index} direction="row" alignItems="center">
                              <Typography variant="body1">{item}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography>No items added</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
                      <Typography>Preferred Music Genre(s)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack 
                        spacing={2} 
                        direction="row" 
                        useFlexGap 
                        flexWrap="wrap"
                        sx={{ border: "1px solid #ddd", padding: 2 }} 
                        divider={<Divider orientation="vertical" flexItem
                      />}>
                        { Array.isArray(musicList) && musicList.length > 0 ? (
                          musicList.map((item, index) => (
                            <Stack key={item.id || index} direction="row" alignItems="center">
                              <Typography variant="body1">{item}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography>No items added</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
                      <Typography>Preferred Movie/TV Show(s)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack 
                        spacing={2} 
                        direction="row" 
                        useFlexGap 
                        flexWrap="wrap"
                        sx={{ border: "1px solid #ddd", padding: 2 }} 
                        divider={<Divider orientation="vertical" flexItem
                      />}>
                        { Array.isArray(shows) && shows.length > 0 ? (
                          shows.map((item, index) => (
                            <Stack key={item.id || index} direction="row" alignItems="center">
                              <Typography variant="body1">{item}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography>No items added</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
    );
}