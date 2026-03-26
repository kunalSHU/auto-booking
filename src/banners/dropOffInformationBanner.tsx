import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DropOffInformationBanner: React.FC = () => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '12px',
        bgcolor: '#e9f3e7', 
        border: '1px solid #53dd5e',
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%', // Ensures it doesn't expand horizontally
        boxSizing: 'border-box'
      }}
    >
      <Stack direction="row" spacing={1}>
        <Typography sx={{ color: '#444', fontSize: '0.8rem', lineHeight: 1.4 }}>
          ℹ️ By selecting this option you confirm you'll drop off your vehicle at our shop.
        </Typography>
      </Stack>
    </Box>
  );
};

export default DropOffInformationBanner;