import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { Box, Drawer, List, Divider, ListItem, ListItemButton } from "@mui/material";
import { logoutUser } from '../../DataService';
import './DrawerMenu.css';

export const DrawerMenu = (props) => {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "Users", params.id));
      const userDataDoc = await getDoc(doc(db, "Basic_Details", params.id));
      if(userDoc.exists()) setUser(userDoc.data());
      if(userDataDoc.exists()) setUserData(userDataDoc.data());
    };
    fetchUserData();
  }, [params.id]); 

  const handleSignOut = () => {
    logoutUser();
    navigate('/logout');
  }

  return (
    <div className="drawerMenu">
      <Drawer anchor="right" open={props.open} onClose={props.action}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem>
              <div className="welcome">
                <div>
                  <img src={user.image_url ? user.image_url : process.env.PUBLIC_URL+"/assets/images/user.png"} />
                </div>
                <div><b>Welcome, {userData.first_name}!</b></div>
              </div>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate(`/home`)}>
                Home
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate(`/profile/view/${params.id}/?section=basic_details`)}>
                My Profile
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate(`/profile/edit/${params.id}/?section=basic_details`)}>
                Edit Profile
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleSignOut}>
                Logout
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
    </div>
  );
}