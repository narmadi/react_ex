import { useState } from "react";
import { useParams } from "react-router-dom";
import { IconButton, Grid } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DrawerMenu } from '../DrawerMenu/DrawerMenu';
import './Header.css';

export const Header = () => {
  const [open, setOpen] = useState(false);
  const id = useParams().id;
  const toggleDrawer = (state) => () => setOpen(state);
  
  return (
    <div className="Header">
      <Grid container spacing={2}>
        <Grid xs={4} sm={4} md={4} lg={4}>
          <img className="logo" src={process.env.PUBLIC_URL+"/assets/images/logo.png"} />
        </Grid>
        <Grid xs={8} sm={8} md={8} lg={8}>
          { id ? (
              <>
                <IconButton onClick={toggleDrawer(true)} sx={{ float: "right" }}>
                  <MenuIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <DrawerMenu open={open} action={toggleDrawer(false)} />
              </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </div>
  );
}