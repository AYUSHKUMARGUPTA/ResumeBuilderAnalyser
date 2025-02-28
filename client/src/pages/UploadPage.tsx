import React, { useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import pdfToText from "react-pdftotext";
import TextField from "@mui/material/TextField";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "../styles/upload.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadPage = () => {
  const [jdText, setInputText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const file = event.target.files[0];
        pdfToText(file)
          .then((text) => {
            setPdfText(text);
            console.log("PDF Text", text);
          })
          .catch((error) =>
            console.error("Failed to extract text from pdf", error)
          );
      } else {
        alert("Please upload a resume to analyze.");
      }
    },
    []
  );

  const processLine = (line: string, accumulatedResult: string) => {
    if (line.startsWith("data:")) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") {
        setIsLoading(false);
        return accumulatedResult;
      }
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.response) {
          accumulatedResult += parsedData.response;
          setResult(accumulatedResult);
        }
      } catch (err) {
        console.error("Error parsing JSON chunk:", err);
      }
    }
    return accumulatedResult;
  };

  const streamResponse = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) => {
    let done = false;
    let accumulatedResult = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");
      // eslint-disable-next-line no-loop-func
      lines.forEach((line) => {
        accumulatedResult = processLine(line, accumulatedResult);
      });
    }
  };

  const analyze = useCallback(async () => {
    try {
      const jd = jdText;
      const extractedText = pdfText;

      setIsLoading(true);

      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jd, extractedText }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      await streamResponse(reader, decoder);
    } catch (error) {
      console.error("Error during streaming:", error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jdText, pdfText]);

  return (
    <div>
      <h2>Upload Your Resume</h2>

      <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
        <div className="upload-form-container">
          <TextField
            id="outlined-multiline-static"
            label="JD"
            multiline
            value={jdText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleAnalyze}
              multiple={false}
            />
          </Button>
          <Button
            variant="outlined"
            startIcon={<QueryStatsIcon />}
            onClick={analyze}
          >
            Analyze
          </Button>
        </div>
      </Box>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      {result && (
        <div>
          <h2>Analysis Result:</h2>
          <MarkdownPreview source={result} className="markdown-preview" />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
