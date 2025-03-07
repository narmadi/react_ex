import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { Stack, TextField, Button, ButtonGroup, Typography, IconButton, InputAdornment, Box, Divider } from "@mui/material";
import { db } from "../../FirebaseConfig";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from "@mui/icons-material/Add";

export const DynamicStack = (props) => {
  const { handleSubmit, formState: { isValid } } = useForm({ mode: "onChange" });
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState(props.items);
  const [loading, setLoading] = useState(props.loading);
  const params = useParams();
  const navigate = useNavigate();

  const isFormValid = items.length > 0 && items.every((value) => value && value.trim() !== "");

  useEffect(() => {
    console.log(props);
  }, []);

  const handlePageChange = () => {
    navigate(`/profile/view/${params.id}/?section=${props.section}`);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      const newItems = [...items, inputValue];
      setItems(newItems);
      props.setItems(newItems);  // Update the parent state
      setInputValue("");  // Clear input
    }
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    props.setItems(newItems);  // Update the parent state
  };

  const onSubmit = async () => {
    setLoading(true);
    const itemsDoc = await getDoc(doc(db, props.saveTo, params.id));        
    if(itemsDoc.exists()) {
        try {
            await updateDoc(doc(db, props.saveTo, params.id), {items: items});
            navigate(`/profile/view/${params.id}/?section=${props.section}`);
        } catch (error) {
            console.log("Error: No items to save");
        } finally {
            setLoading(false);
        }
    } else {
        try {
            await setDoc(doc(db, props.saveTo, params.id), {items: items});
            navigate(`/profile/view/${params.id}/?section=${props.section}`);
        } catch (error) {
            console.error("Error saving items:", error);
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <Stack spacing={2} sx={{ width: "80%", margin: "auto" }}>
      <Box component="form" noValidate autoComplete="off" name='stackForm'>
        <TextField
          label={props.label || "Enter Value"}
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleAddItem} color="primary">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* List of items */}
      <Stack 
        spacing={2} 
        direction="row" 
        useFlexGap 
        flexWrap="wrap"
        sx={{ border: "1px solid #ddd", padding: 2 }}
        divider={<Divider orientation="vertical" flexItem />}>
        { Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <Stack key={item.id || index} direction="row" alignItems="center">
              <Typography variant="body1">{item}</Typography>
              <IconButton onClick={() => handleDeleteItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))
        ) : (
          <Typography>No items added</Typography>
        )}
      </Stack>

      <ButtonGroup className="tab-indent" aria-label="Loading button group">
        <Button 
          variant="contained" 
          type="submit" 
          onClick={handleSubmit(onSubmit)} 
          disabled={loading || !isValid || !isFormValid} 
          startIcon={<SaveIcon />}
        >
          Save & Update
        </Button>
        <Button variant="outlined" onClick={handlePageChange}>Cancel</Button>
      </ButtonGroup>
    </Stack>
  );
};
