import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DropOffInformationBanner: React.FC = () => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '12px',
        bgcolor: '#e9f3e7', 
        border: '1px solid #53dd5e',
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%', // Ensures it doesn't expand horizontally
        boxSizing: 'border-box'
      }}
    >
      <Stack direction="row" spacing={1.5}>
        <Box>
          <Typography
            sx={{
              color: '#666',
              fontSize: '0.85rem',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            ℹ️ By selecting this option you confirm you'll drop off your vehicle at our shop. Our team will contact you with drop-off instructions.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default DropOffInformationBanner;