import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import Image from "mui-image";

const theme = createTheme();

const App = () => {
  const [probability, setProbability] = useState(null);
  const [label, setLabel] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleImageUpload = async (image) => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }
    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Image = await fileToBase64(image);

      const response = await fetch(
        "https://e1010101-dinosaur-detector.hf.space/run/predict",
        {
          method: "POST",
          body: JSON.stringify({ data: [base64Image] }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
          },
        }
      );

      const data = await response.json();
      // Process the response data and extract the probability value
      const label = data["data"][0]["confidences"][0]["label"];
      const confidence = data["data"][0]["confidences"][0]["confidence"];
      console.log("label:", label);
      console.log("confidence:", confidence);
      setProbability(confidence);
      setLabel(label);
    } catch (error) {
      console.error("Error fetching data from Huggingface API:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h1">
            Dinosaur Detector
          </Typography>
          <Box sx={{ mt: 1 }}>
            <input
              accept="image/*"
              type="file"
              id="select-image"
              style={{ display: "none" }}
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <Stack spacing={2} direction="column" alignItems="center">
              <label htmlFor="select-image">
                <Button variant="contained" color="primary" component="span">
                  Upload Image
                </Button>
              </label>
              {imageUrl && selectedImage && (
                <Box mt={2} textAlign="center">
                  <div>Image Preview:</div>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Image
                      src={imageUrl}
                      alt={selectedImage.name}
                      showLoading={true}
                      width="50%"
                      shiftDuration={900}
                      easing="cubic-bezier(0.7, 0, 0.6, 1)"
                    />
                  </Box>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={() => handleImageUpload(selectedImage)}
              >
                Check for dinosaur!
              </Button>
            </Stack>
          </Box>
          <Typography component="h1" variant="h3">
            {probability !== null &&
              probability * 100 + "% certain: " + label + ""}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
