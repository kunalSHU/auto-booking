import { Box, Button, Typography, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
            return dateAsDayjs; // FIX 1: Added missing return statement!
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
            label: 'MORNING',
            times: [
                { time: '10:00 AM', disabled: isSlotDisabled('10:00 AM') },
                { time: '10:30 AM', disabled: isSlotDisabled('10:30 AM') },
                { time: '11:00 AM', disabled: isSlotDisabled('11:00 AM') },
                { time: '11:30 AM', disabled: isSlotDisabled('11:30 AM') },
                { time: '12:00 PM', disabled: isSlotDisabled('12:00 PM') },
                { time: '12:30 PM', disabled: isSlotDisabled('12:30 PM') },
            ]
        },
        {
            label: 'AFTERNOON',
            times: [
                { time: '1:00 PM', disabled: isSlotDisabled('1:00 PM') },
                { time: '1:30 PM', disabled: isSlotDisabled('1:30 PM') },
                { time: '2:00 PM', disabled: isSlotDisabled('2:00 PM') },
                { time: '2:30 PM', disabled: isSlotDisabled('2:30 PM') },
                { time: '3:00 PM', disabled: isSlotDisabled('3:00 PM') },
                { time: '3:30 PM', disabled: isSlotDisabled('3:30 PM') },
                { time: '4:00 PM', disabled: isSlotDisabled('4:00 PM') },
                { time: '4:30 PM', disabled: isSlotDisabled('4:30 PM') },
            ]
        },
        {
            label: 'EVENING',
            times: [
                { time: '5:00 PM', disabled: isSlotDisabled('5:00 PM') },
                { time: '5:30 PM', disabled: isSlotDisabled('5:30 PM') },
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
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.5, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <AccessTimeIcon sx={{ color: '#4a7c2c' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'serif' }}>
                        Select Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        When should we arrive?
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Time Sections (FIX 2: Removed maxHeight/overflowY to prevent nested scroll clipping) */}
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
                            gap: 1 
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
                                            py: 1,
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            border: '1px solid',
                                            borderColor: isSelected ? '#4a7c2c' : '#eeeeee',
                                            bgcolor: isSelected ? '#f1f8e9' : 'transparent',
                                            color: isSelected ? '#1b5e20' : '#666',
                                            '&:hover': {
                                                borderColor: '#4a7c2c',
                                                bgcolor: isSelected ? '#f1f8e9' : '#fafafa',
                                            }
                                        }}
                                    >
                                        {time.time.replace(' ', '')}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* 3. Footer Buttons */}
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
                                py: 1.5, borderRadius: '12px', bgcolor: '#c5e1a5', color: '#1b5e20', boxShadow: 'none',
                                fontWeight: 800, '&:hover': { bgcolor: '#aed581' }
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