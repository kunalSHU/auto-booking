import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { bookingColors } from '../pages/bookingappointment/bookingTheme';

const WeekdaySlotsBanner: React.FC = () => (
    <Box
        sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: bookingColors.warningBg,
            border: '1px solid rgba(160, 92, 0, 0.2)',
            mb: 3,
        }}
    >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <WarningAmberOutlinedIcon sx={{ color: bookingColors.warning, fontSize: '1.1rem', mt: 0.15 }} />
            <Typography sx={{ color: '#5c4a32', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Weekday slots between 10:00 AM and 5:30 PM are temporarily unavailable.
                Evening and weekend slots are open.
            </Typography>
        </Stack>
    </Box>
);

export default WeekdaySlotsBanner;
