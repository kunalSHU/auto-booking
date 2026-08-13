import React from 'react';
import { Box, Button, Typography, Stack, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';
import DateInformation from './dateInformation';

interface CalendarProps {
    onNext: () => void;
    value: Dayjs | null;
    setValue: (value: Dayjs | null) => void;
    hideContinueButton?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ onNext, value, setValue, hideContinueButton }) => {
    const [isDateSelected, setIsDateSelected] = React.useState(false);

    return (
        <Box sx={{ width: '100%' }}>
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

            <Box sx={{ width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        disablePast
                        fixedWeekNumber={6} // Ensures 6 rows are always rendered
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            setIsDateSelected(true);
                        }}
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
                            calendarHeader: { sx: { display: 'none' } }
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: 'none',
                            // Override MUI's hardcoded 320px height constraint
                            height: 'auto !important',
                            minHeight: '380px',

                            '& .MuiDayCalendar-root': {
                                width: '100%',
                                maxWidth: 'none',
                            },
                            '& .MuiDayCalendar-slideTransition': {
                                width: '100%',
                                minHeight: '320px',
                                height: 'auto !important',
                                overflow: 'visible',
                            },
                            '& .MuiDayCalendar-monthContainer': {
                                width: '100%',
                            },
                            '& .MuiDayCalendar-headerContainer': {
                                width: '100%',
                                justifyContent: 'space-around',
                            },
                            '& .MuiDayCalendar-weekContainer': {
                                width: '100%',
                                justifyContent: 'space-around',
                                margin: '2px 0',
                            },

                            '& .MuiPickersDay-root': {
                                flex: 1,
                                maxWidth: '48px',
                                height: '44px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                borderRadius: '12px',
                                color: '#1a1a1a',
                                transition: 'all 0.2s ease',

                                '&.Mui-selected': {
                                    bgcolor: '#426b29 !important',
                                    color: '#ffffff !important',
                                    '&:hover': { bgcolor: '#355621 !important' },
                                    border: 'none !important',
                                },

                                '&.MuiPickersDay-today': {
                                    borderColor: 'transparent',
                                    color: '#426b29',
                                    fontWeight: 800,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '6px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        bgcolor: 'currentColor'
                                    }
                                },

                                '&:focus': {
                                    bgcolor: 'transparent',
                                    '&.Mui-selected': { bgcolor: '#426b29 !important' }
                                }
                            },

                            '& .MuiDayCalendar-weekDayLabel': {
                                flex: 1,
                                maxWidth: '48px',
                                fontWeight: 800,
                                color: '#999',
                                fontSize: '0.75rem',
                            },
                            '& .MuiPickersCalendarHeader-root': { display: 'none' },
                        }}
                    />
                </LocalizationProvider>

                {isDateSelected && <DateInformation selectedDate={value}/>}
            </Box>

            {!hideContinueButton && (
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
            )}
        </Box>
    );
};

export default Calendar;