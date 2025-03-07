import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import { Button, CircularProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const ImageUploader = (props) => {
    const [imageUrl, setImageUrl] = useState(""); // To store the uploaded image URL
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState({});
    const params = useParams();
    const db = getFirestore();

    useEffect(() => {
        setImageUrl(props.imageUrl);
        const fetchUserData = async () => {
            try {
              const userDoc = await getDoc(doc(db, "Basic_Details", params.id));
              if (userDoc.exists()) {
                setUserData(userDoc.data());
                console.log("Fetched user data:", userDoc.data());
              } else {
                console.log("User document not found in Firestore!");
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [props.imageUrl]);

    // Handle image upload
    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // Attach file
        formData.append("upload_preset", "profile_images"); // Set your Cloudinary upload preset

        try {
            setUploading(true);
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dqnqmfcae/image/upload`, // Replace with your Cloud Name
                formData
            );
            // Cloudinary response includes the uploaded file's URL
            const uploadedImageUrl = response.data.secure_url;
            setImageUrl(uploadedImageUrl);

            // Store image URL in Firestore under the logged-in user ID
            const userDoc = await getDoc(doc(db, "Usered", params.id));
            const newData = { ...userDoc.data(), image_url: uploadedImageUrl };
            await updateDoc(doc(db, "Users", params.id), newData);
            console.log("Uploaded & saved:", uploadedImageUrl);
        } catch (error) {
            console.error("Upload failed", error.response || error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="image-container">
                { uploading ? ((<CircularProgress color="inherit" />)) : (<img src={ imageUrl } alt="User" width="150px" />) }
                <div className="btn-upload">
                    { props.allowUpload && (
                        <Button
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            >
                            {uploading ? "Uploading..." : "Upload Image"}
                            <VisuallyHiddenInput type="file" onChange={uploadFile} multiple/>
                        </Button>
                    ) }
                    {
                        userData.first_name && (
                            <div className="userdata">
                                Welcome <p>{userData.first_name} {userData.last_name}!</p>
                            </div>
                        )
                    }
                    
                </div>
            </div>
        </div>
    );
};
