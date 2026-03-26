import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface BookingDetailsProps {
  serviceName?: string;
  duration?: string;
  location?: string;
  selectedDate?: string | null;
  selectedTime?: string | null;
  selectedContact?: string | null;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  serviceName = "Oil Change",
  duration = "30 min",
  location = null,
  selectedDate = null,
  selectedTime = null,
  selectedContact = null,
}) => {
  const summaryItems = [
    { label: 'DATE', value: selectedDate },
    { label: 'TIME', value: selectedTime },
    { label: 'LOCATION', value: location }, // Example conditional
    { label: 'CONTACT', value: selectedContact },
  ];

  useEffect(() => {
    console.log(location)
  }, [location])

  return (
    <Box
      component="aside"
      sx={{
        width: '100%',
        maxWidth: '350px',
        bgcolor: '#f9fbf9', // Very soft off-white green background
        p: 4,
        borderRadius: '24px',
        border: '1px solid #f0f4f0',
        display: 'flex',
        flexDirection: 'column',
        // Ensuring it aligns with the height of the calendar box on desktop
        height: { md: '100%' },
      }}
    >
      {/* 1. Header with Icon and Title */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ 
            bgcolor: '#e8f5e9', // Green icon box
            p: 1, 
            borderRadius: '10px', 
            display: 'flex',
            border: '1px solid #c8e6c9' 
        }}>
          <AssignmentIcon sx={{ color: '#4a7c2c', fontSize: '1.2rem' }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: '#4a7c2c',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          YOUR BOOKING
        </Typography>
      </Stack>

      {/* 2. Service and Duration */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontFamily: 'serif', // Match the logo font style
            color: '#1a1a1a',
            fontSize: '1.5rem',
          }}
        >
          {serviceName}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTimeFilledIcon sx={{ color: '#888', fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
            {duration} . {location}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 4, borderColor: '#f0f0f0' }} />

      {/* 3. Booking Details List */}
      <List disablePadding sx={{ mb: 4, flexGrow: 1 }}>
        {summaryItems.map((item) => (
          <ListItem key={item.label} disableGutters sx={{ py: 1.5 }}>
            <ListItemText
              primary={
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: '#bdbdbd',
                    letterSpacing: '1px',
                    mb: 0.5,
                    display: 'block',
                  }}
                >
                  {item.label}
                </Typography>
              }
              secondary={
                <Typography
                  sx={{
                    color: item.value ? '#1a1a1a' : '#bdbdbd',
                    fontWeight: item.value ? 700 : 500,
                    fontSize: '1rem',
                    fontStyle: item.value ? 'normal' : 'italic',
                  }}
                >
                  {item.value || 'Not selected yet'}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* 4. Secure Note */}
      <Box sx={{ mt: 'auto' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircleIcon sx={{ color: '#999', fontSize: '1rem' }} />
          <Typography
            variant="caption"
            sx={{ color: '#999', lineHeight: 1.4, fontWeight: 500 }}
          >
            Your information is secure and will only be used for this
            appointment.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default BookingDetails;