import * as React from "react";
import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TerminalIcon from "@mui/icons-material/Terminal";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Image from "mui-image";
import "./App.css";
import Helvetica from "./fonts/HelveticaNeueLTPro-Roman.otf";

const theme = createTheme({
  typography: {
    fontFamily: "Helvetica, Arial",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Helvetica';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Helvetica'), local('Helvetica'), url(${Helvetica}) format('otf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

const App = () => {
  const [probability, setProbability] = useState(null);
  const [label, setLabel] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const base64Image = await fileToBase64(image);

      const response = await fetch(
        "https://e1010101-dinosaur-detector.hf.space/run/predict",
        {
          method: "POST",
          body: JSON.stringify({ data: [base64Image] }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":
              "https://dinosaur-detector.netlify.app/",
            "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data from Huggingface API:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <TerminalIcon />
            <Link
              href="https://github.com/e1010101/dinosaur-detector-site"
              underline="hover"
              target="_blank"
            >
              <Typography component="body1" variant="button">
                Github
              </Typography>
            </Link>
            <Link
              href="https://huggingface.co/spaces/e1010101/dinosaur-detector"
              underline="hover"
              target="_blank"
            >
              <Typography component="body1" variant="button">
                Huggingface
              </Typography>
            </Link>
            <Link
              href="https://www.kaggle.com/code/e1010101/dinosaur-detector"
              underline="hover"
              target="_blank"
            >
              <Typography component="body1" variant="button">
                Kaggle
              </Typography>
            </Link>
          </Stack>
          <Typography component="h1" variant="h1">
            Dinosaur Detector
          </Typography>
          <Box sx={{ mt: 1 }} alignItems="center">
            <input
              accept="image/*"
              type="file"
              id="select-image"
              style={{ display: "none" }}
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            {imageUrl && selectedImage && (
              <Box mt={2} textAlign="center" sx={{ margin: 2 }}>
                <div>Image Preview:</div>
                <Box display="flex" flexDirection="column" alignItems="center">
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
              justifyContent="center"
              alignItems="center"
            >
              <label htmlFor="select-image">
                <Button variant="contained" color="primary" component="span">
                  Upload Image
                </Button>
              </label>
              {loading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                >
                  Loading...
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleImageUpload(selectedImage)}
                >
                  Check Image
                </Button>
              )}
            </Stack>
          </Box>
          <Typography component="h1" variant="h3">
            {probability !== null &&
              Number.parseFloat(probability * 100).toFixed(2) +
                "% certain: " +
                label +
                ""}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
