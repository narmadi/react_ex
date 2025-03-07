import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { Tabs, Tab, Box, Grid } from "@mui/material";
import { db } from "../../FirebaseConfig";
import { BasicDetails } from "../../BasicDetails/BasicDetails";
import { BasicDetailsEdit } from "../../BasicDetails/BasicDetailsEdit";
import { AdditionalDetails } from "../../AdditionalDetails/AdditionalDetails";
import { AdditionalDetailsEdit } from "../../AdditionalDetails/AdditionalDetailsEdit";
import { SpouseDetails } from "../../SpouseDetails/SpouseDetails";
import { SpouseDetailsEdit } from "../../SpouseDetails/SpouseDetailsEdit";
import { PersonalPreferences } from "../../PersonalPreferences/PersonalPreferences";
import { PersonalPreferencesEdit } from "../../PersonalPreferences/PersonalPreferencesEdit";
import './VerticalTabs.css';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (<Box p={2}>{children}</Box>)}
    </div>
  );
};

export const VerticalTabs = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMarried, setIsMarried] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const isEditMode = location.pathname.includes("/edit");

  const tabPaths = {
    basicdetails: [`/profile/view/${params.id}/?section=basic_details`, `/profile/edit/${params.id}/?section=basic_details`],
    additionaldetails: [`/profile/view/${params.id}/?section=additional_details`, `/profile/edit/${params.id}/?section=additional_details`],
    spousedetails: [`/profile/view/${params.id}/?section=spouse_details`, `/profile/edit/${params.id}/?section=spouse_details`],
    personalpreferences: [`/profile/view/${params.id}/?section=personal_preferences`, `/profile/edit/${params.id}/?section=personal_preferences`],
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, "Additional_Details", params.id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setIsMarried(userData.marital_status === 'Married'); 
        } else {
          console.log("User document not found in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        getTabIndex();
        setLoading(false);
      }
    };
    if (params.id) { fetchUserData(); };
  }, [userData]);

  const tabs = [
    { label: "Basic Details", component: isEditMode ? <BasicDetailsEdit /> : <BasicDetails /> },
    { label: "Additional Details", component: isEditMode ? <AdditionalDetailsEdit /> : <AdditionalDetails /> },
    ...(isMarried ? [{ label: "Spouse Details", component: isEditMode ? <SpouseDetailsEdit /> : <SpouseDetails /> }] : []),
    { label: "Personal Preferences", component: isEditMode ? <PersonalPreferencesEdit /> : <PersonalPreferences /> },
  ];
  
  
  const getTabIndex = () => {
    const tabLabels = tabs.map(tab => tab.label.toLowerCase().replace(/\s/g, '')); // Use dynamic labels
    for (let i = 0; i < tabLabels.length; i++) {
      const tabKey = tabLabels[i];  
      const matchingPaths = tabPaths[tabKey];  
      if (matchingPaths && matchingPaths.includes(location.pathname + location.search)) return i;  // Return the index of the matched tab
    }
    return 0;  // Default to first tab if no match is found
  };
  
  
  const handleChange = (event, newValue) => {
    const tabKey = tabs[newValue].label.toLowerCase().replace(/\s/g, ''); // Safe lookup from tabs
    const selectedTabPath = tabPaths[tabKey]?.[0];
    if (selectedTabPath) {
      navigate(selectedTabPath);
    } else {
      console.error('No path found for the selected tab:', tabKey);
    }
  };

  return (
    <div className="verticalTabs">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4} md={3} lg={3} className="panel-left">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={getTabIndex()}
            onChange={handleChange}
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            { tabs.map((tab, index) => ( <Tab key={index} label={tab.label} />)) }
          </Tabs>
        </Grid>
        <Grid item xs={12} sm={8} md={9} lg={9} className="panel-right">
          <Box sx={{ flexGrow: 1, p: 2 }}>
            {tabs.map((tab, index) => ( <TabPanel key={index} value={getTabIndex()} index={index}>{tab.component}</TabPanel> ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};