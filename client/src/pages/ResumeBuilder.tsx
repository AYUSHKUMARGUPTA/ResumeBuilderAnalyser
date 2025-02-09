import React from "react";
import Grid from "../components/DataGrid";
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
const ResumeBuilder = () => {
    return (
      <>
      <Button variant="contained" startIcon={<CreateIcon />}>
        Create New Resume
      </Button>
      <Grid />
    </>
    );
};

export default ResumeBuilder;
