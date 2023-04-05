import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";

const App = () => {
  const [probability, setProbability] = useState(null);
  const [label, setLabel] = useState("");

  const handleImageUpload = async (image) => {
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
    <div className="App">
      <h1>Dinosaur Detector</h1>
      <ImageUploader onUpload={handleImageUpload} />
      {probability !== null && probability * 100 + "% certain: " + label + ""}
    </div>
  );
};

export default App;
