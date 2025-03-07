import { Box } from "@mui/material";

export const TabPanel = ({ children, value, index, isMarried }) => {
    return (
      <div hidden={(value !== index) || !isMarried}>
        {value === index && (<Box p={2}>{children}</Box>)}
      </div>
    );
};