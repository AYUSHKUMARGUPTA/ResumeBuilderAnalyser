import React from "react";
import Grid from "./DataGrid";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const ResumeAnalyzer = () => {
  return (
    <>
      <Button variant="contained" startIcon={<CloudUploadIcon />}>
        Upload Resume to Analyze
      </Button>
      <Grid />
    </>
  );
};

export default ResumeAnalyzer;
