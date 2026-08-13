import React from 'react';
import { Box, Typography } from '@mui/material';
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

    const isWeekend = checkIsWeekend();

    return (
        <Box
            sx={{
                mt: 4,
                p: { xs: 2.5, sm: 3 },
                borderRadius: '16px',
                bgcolor: '#f2f1ed', // Light grey/cream background from design
                border: '1px solid #e2e0d8',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            {/* Top row: Label + Hours Pill */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    mb: 1.5,
                    flexWrap: 'wrap'
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: '#8c8c88',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        lineHeight: 1.2
                    }}
                >
                    Selected Date
                </Typography>

                {/* Operating Hours Pill Badge */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: '#eaf4d3', // Soft green pill background
                        px: 2,
                        py: 0.75,
                        borderRadius: '24px',
                        border: '1px solid #c5e1a5'
                    }}
                >
                    <Typography
                        sx={{
                            color: '#33691e',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {!isWeekend
                            ? 'Weekday: 10:00 AM – 9:30 PM'
                            : 'Weekend: 11:00 AM – 9:00 PM'}
                    </Typography>
                </Box>
            </Box>

            {/* Bottom row: Formatted Selected Date */}
            <Typography
                sx={{
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    lineHeight: 1.3,
                    fontFamily: 'serif'
                }}
            >
                {selectedDate.format('dddd, MMMM D, YYYY')}
            </Typography>
        </Box>
    );
};

export default DateInformation;