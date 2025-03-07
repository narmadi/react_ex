import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { Header} from '../Shared/Header/Header';
import { VerticalTabs } from "../Shared/VerticalTabs/VerticalTabs";
import './Profile.css';

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const [key, setKey] = useState(0); // Force re-render

  useEffect(() => {
    setKey((prev) => prev + 1); // Change key to force re-render
  }, [searchParams.toString()]); // Trigger when query params change

  return (
      <div key={key} className="profile">
        <Container>
          <Header />
          <VerticalTabs />
        </Container>
      </div>
  );
};
