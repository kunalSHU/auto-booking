import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Dayjs } from 'dayjs';

interface DateInformationProps {
    selectedDate: Dayjs | null;
}

const DateInformation: React.FC<DateInformationProps> = ({ selectedDate }) => {
    if (!selectedDate) return null;

    const checkIsWeekend = () => {
        const dayOfWeek = selectedDate.day();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    return (
        <Box
            sx={{
                mt: 4,
                p: 2,
                borderRadius: '12px',
                bgcolor: '#f5f5f5', // Neutral light grey background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                {/* Icon Box */}
                <Box sx={{
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: '8px',
                    display: 'flex',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.02)'
                }}>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#888',
                            fontWeight: 700,
                            display: 'block',
                            lineHeight: 1.2,
                            fontSize: '0.65rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        SELECTED DATE
                    </Typography>
                    <Typography
                        sx={{
                            color: '#1a1a1a',
                            fontWeight: 800,
                            fontSize: '0.95rem'
                        }}
                    >
                        {selectedDate.format('dddd, MMMM D, YYYY')}
                    </Typography>
                </Box>
            </Stack>

            {/* Operating Hours Badge */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#e8f5e9', // Very light green
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    border: '1px solid #c8e6c9'
                }}
            >
                <CheckCircleIcon sx={{ color: '#4a7c2c', fontSize: '1rem' }} />
                {!checkIsWeekend() ? <Typography
                    sx={{
                        color: '#2e7d32',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Weekday: 10:00 AM - 9:30 PM
                </Typography> :
                    <Typography
                        sx={{
                            color: '#2e7d32',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Weekend: 11:00 AM - 9:00 PM
                    </Typography>
                }
            </Box>
        </Box>
    );
};

export default DateInformation;