import React from 'react';
import { Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface ServiceLocationIconProps {
  size?: number; // Optional size parameter for flexibility
}

const ServiceLocationIcon: React.FC<ServiceLocationIconProps> = ({ size = 64 }) => {
  // Calculate relative sizes based on the container size
  const padding = size * 0.22; // approx 14px for 64px container
  const iconSize = size * 0.56; // approx 36px for 64px container

  return (
    <Box
      sx={{
        width: size,
        height: size,
        bgcolor: '#e8f5e9', // The exact light lime-green background hex
        borderRadius: '16px', // Matches the soft-square look
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: `${padding}px`, // Ensures the pin is sized correctly relative to the box
        border: '1px solid #c8e6c9', // Adds a very subtle light green border for definition
        boxShadow: '0px 2px 4px rgba(0,0,0,0.02)', // Tiny shadow for that "premium" feel
      }}
    >
      <LocationOnIcon 
        sx={{ 
          color: '#d32f2f', // Standard MUI red, slightly vibrant
          fontSize: `${iconSize}px`,
          // This creates the small metal/silver "stem" under the red ball
          // by offsetting the pin slightly downwards and masking the bottom
          transform: 'translateY(2px)', 
        }} 
      />
    </Box>
  );
};

export default ServiceLocationIcon;