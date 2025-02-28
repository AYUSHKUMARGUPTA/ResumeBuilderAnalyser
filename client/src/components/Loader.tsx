import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const FullPageCircularProgress = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
        zIndex: 9999, // Ensure it's on top of other content
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullPageCircularProgress;