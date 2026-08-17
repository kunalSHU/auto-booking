import { Box, Button, Typography, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import React from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(customParseFormat);

interface ITimeSelectionProps {
    onBack: () => void;
    selectedDate: string | undefined;
    nextToYourInformation: () => void;
    setSelectedTime: (time: string | null) => void;
    selectedTime: string | null;
    hideNavigation?: boolean;
}

const TimeSelection: React.FC<ITimeSelectionProps> = (props) => {

    const formatDate = (): Dayjs | undefined => {
        if (!props.selectedDate) return undefined;

        const format = "dddd, MMMM D, YYYY";
        const cleanString = props.selectedDate.replace(/\u00a0/g, ' ').trim();
        const dateAsDayjs = dayjs(cleanString, format);

        if (dateAsDayjs.isValid()) {
            return dateAsDayjs;
        } else {
            const parts = cleanString.split(', ');
            if (parts.length > 1) {
                const dateWithoutDay = parts.slice(1).join(', ');
                const fallbackDate = dayjs(dateWithoutDay, "MMMM D, YYYY");
                
                if (fallbackDate.isValid()) {
                    return fallbackDate;
                }
            }
        }
        return undefined;
    };

    // Helper to determine if a slot should be disabled
    const isSlotDisabled = (timeStr: string) => {
        const parsedDate = formatDate();
        if (!parsedDate) return false;

        const now = dayjs();
        const format = "h:mm A";
        const slotTime = dayjs(timeStr, format);
        
        if (!slotTime.isValid()) return false;

        const slotDateTime = parsedDate.hour(slotTime.hour()).minute(slotTime.minute());
        
        // Disable if time slot is in the past or less than 2 hours from now
        return slotDateTime.isBefore(now) || slotDateTime.diff(now, 'hour') < 2;
    };

    const sections = [
        {
            label: 'EVENING',
            times: [
                { time: '6:00 PM', disabled: isSlotDisabled('6:00 PM') },
                { time: '6:30 PM', disabled: isSlotDisabled('6:30 PM') },
                { time: '7:00 PM', disabled: isSlotDisabled('7:00 PM') },
                { time: '7:30 PM', disabled: isSlotDisabled('7:30 PM') },
                { time: '8:00 PM', disabled: isSlotDisabled('8:00 PM') },
                { time: '8:30 PM', disabled: isSlotDisabled('8:30 PM') },
                { time: '9:00 PM', disabled: isSlotDisabled('9:00 PM') },
            ]
        }
    ];

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%' 
        }}>
            {/* 1. Header Section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.25, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <AccessTimeIcon sx={{ color: '#4a7c2c', fontSize: '1.4rem' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.35rem' }}>
                        Select a Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                        Weekday hours: 10:00 AM – 9:30 PM
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Warning Notice Banner */}
            <Box sx={{
                bgcolor: '#fffbf0',
                border: '1px solid #fce8bd',
                borderRadius: '12px',
                p: 2,
                mb: 3,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5
            }}>
                <WarningAmberOutlinedIcon sx={{ color: '#c07d2a', fontSize: '1.25rem', mt: '1px' }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#9a6118', fontWeight: 500, lineHeight: 1.4 }}>
                    Weekday slots between 10:00 AM and 5:30 PM are temporarily unavailable. Evening and weekend slots are open.
                </Typography>
            </Box>

            {/* 3. Time Sections */}
            <Box sx={{ flexGrow: 1, pr: 1 }}>
                {sections.map((section) => (
                    <Box key={section.label} sx={{ mb: 3 }}>
                        <Typography variant="caption" sx={{ 
                            fontWeight: 900, 
                            color: '#bdbdbd', 
                            mb: 1.5, 
                            display: 'block', 
                            letterSpacing: '1px' 
                        }}>
                            {section.label}
                        </Typography>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
                            gap: 1.5 
                        }}>
                            {section.times.map((time) => {
                                const isSelected = props.selectedTime === time.time;
                                return (
                                    <Button
                                        key={time.time}
                                        disabled={time.disabled}
                                        variant="outlined"
                                        onClick={() => props.setSelectedTime(time.time)}
                                        sx={{
                                            py: 1.25,
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            border: '1px solid',
                                            borderColor: isSelected ? '#4a7c2c' : '#e0e0e0',
                                            bgcolor: isSelected ? '#4a7c2c' : '#fff',
                                            color: isSelected ? '#fff' : '#1a1a1a',
                                            boxShadow: isSelected ? '0px 2px 6px rgba(74,124,44,0.3)' : 'none',
                                            '&:hover': {
                                                borderColor: '#4a7c2c',
                                                bgcolor: isSelected ? '#3f6b25' : '#f9fbf8',
                                            }
                                        }}
                                    >
                                        {time.time}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* 4. Footer Buttons */}
            {!props.hideNavigation && (
                <Box sx={{ pt: 3, borderTop: '1px solid #f5f5f5' }}>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            fullWidth 
                            onClick={props.onBack}
                            sx={{ py: 1.5, borderRadius: '12px', color: '#666', fontWeight: 800, bgcolor: '#f5f5f5' }}
                        >
                            BACK
                        </Button>
                        <Button 
                            fullWidth 
                            disabled={!props.selectedTime}
                            onClick={props.nextToYourInformation}
                            variant="contained" 
                            sx={{ 
                                py: 1.5, borderRadius: '12px', bgcolor: '#4a7c2c', color: '#fff', boxShadow: 'none',
                                fontWeight: 800, '&:hover': { bgcolor: '#3f6b25' }
                            }}
                        >
                            CONTINUE →
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default TimeSelection;