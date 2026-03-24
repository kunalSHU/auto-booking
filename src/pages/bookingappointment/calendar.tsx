import React from 'react';
import { Box, Button, Typography, Stack, Divider, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

interface CalendarProps {
    onNext: () => void;
    value: Dayjs | null;
    setValue: (value: Dayjs | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onNext, value, setValue }) => {
    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.5, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <CalendarMonthIcon sx={{ color: '#4a7c2c' }} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'serif' }}>
                        Select a Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Choose when you'd like your service
                    </Typography>
                </Box>
            </Stack>

            <Box sx={{
                width: '100%',
                '& .MuiDateCalendar-root': { width: '100%', maxHeight: 'none' },
                '& .MuiPickersCalendarHeader-label': { fontWeight: 900, fontSize: '1.1rem' },
                '& .MuiDayCalendar-weekDayLabel': { fontWeight: 700, color: '#333' },
                '& .MuiPickersDay-root': {
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    '&.Mui-selected': { bgcolor: '#4a7c2c !important' }
                }
            }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        disablePast
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        // 1. This centers the Month/Year and customizes the arrows
                        slots={{
                            calendarHeader: (props) => (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ px: 2, mb: 2 }}
                                >
                                    <IconButton onClick={() => props.onMonthChange(props.currentMonth.subtract(1, 'month'))} sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                        <ChevronLeft fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'serif' }}>
                                        {props.currentMonth.format('MMMM YYYY')}
                                    </Typography>
                                    <IconButton onClick={() => props.onMonthChange(props.currentMonth.add(1, 'month'))} sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                        <ChevronRight fontSize="small" />
                                    </IconButton>
                                </Stack>
                            ),
                        }}
                        slotProps={{
                            calendarHeader: { sx: { display: 'none' } } // Hide default header to use ours
                        }}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            // 2. This creates the "Big Square Green Icon" selection
                            '& .MuiPickersDay-root': {
                                width: '50px',
                                height: '50px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: '12px', // The rounded square look
                                margin: '2px',
                                '&.Mui-selected': {
                                    bgcolor: '#426b29 !important', // Deep green from design
                                    color: 'white',
                                    '&:hover': { bgcolor: '#355621 !important' }
                                },
                                '&.MuiPickersDay-today': {
                                    borderColor: 'transparent', // Remove the circle around today
                                    color: '#426b29',
                                    '&::after': { // Add the small green dot below today
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '6px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        bgcolor: '#426b29'
                                    }
                                }
                            },
                            // 3. Style the Day labels (SUN, MON, etc.)
                            '& .MuiDayCalendar-weekDayLabel': {
                                fontWeight: 800,
                                color: '#999',
                                fontSize: '0.75rem',
                                width: '50px'
                            },
                            // Hide the default MUI header since we made a custom one above
                            '& .MuiPickersCalendarHeader-root': { display: 'none' }
                        }}
                    />
                </LocalizationProvider>
            </Box>

            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #f5f5f5' }}>
                <Button
                    fullWidth
                    disabled={!value}
                    onClick={onNext}
                    variant="contained"
                    sx={{
                        py: 2,
                        borderRadius: '12px',
                        backgroundColor: '#c5e1a5',
                        color: '#1b5e20',
                        boxShadow: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        '&:hover': { backgroundColor: '#aed581', boxShadow: 'none' },
                        '&:disabled': { backgroundColor: '#f5f5f5', color: '#ccc' }
                    }}
                >
                    CONTINUE →
                </Button>
            </Box>
        </Box>
    );
};

export default Calendar;