import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken"); // Clear auth token
    navigate("/login");

    const handleBackButton = () => {
      navigate("/login"); // Redirect if back button is pressed
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return <CircularProgress color="inherit" />;
};
