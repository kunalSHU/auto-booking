import React, { useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

interface CalendarProps {
    onNext: () => void;
    value: Dayjs | null;
    setValue: (value: Dayjs | null) => void;
}

const CustomCalendarHeader = (props: any) => {
    const { currentMonth, onMonthChange } = props;

    const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'), 'left');
    const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'), 'right');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1 }}>
            <IconButton onClick={selectPreviousMonth}>
                <ChevronLeftIcon />
            </IconButton>
            <Typography variant="body1" sx={{ mx: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
                {currentMonth.format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={selectNextMonth}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
};

const Calendar: React.FC<CalendarProps> = ({ onNext, value, setValue }) => {

    useEffect(() => {
        if (value) {
            console.log(value.format('dddd, MMMM D, YYYY'));
        }
    }, [value])

    return (
        <>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarMonthIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Select a Date</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                disablePast
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue)
                                }}
                                slots={{ calendarHeader: CustomCalendarHeader }}
                                dayOfWeekFormatter={(date) => date.format('ddd')}
                                sx={{
                                    width: '100%',
                                    '& .MuiDayCalendar-header': { justifyContent: 'space-around' },
                                    '& .MuiDayCalendar-weekContainer': { justifyContent: 'space-around' },
                                    '& .MuiPickersDay-root': { fontSize: '1rem' },
                                    '& .MuiDayCalendar-weekDayLabel': { fontSize: '1rem' }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    {value ? <Box sx={{ display: { xs: 'block', sm: 'block' }, mt: { xs: 2, sm: 2 } }}>
                        Selected: {value?.format('dddd, MMMM D, YYYY')}
                        <Button fullWidth onClick={onNext} variant="contained" sx={{ bgcolor: '#bef264', mt: { xs: 2, sm: 2 }, textTransform: 'none', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#a3e635' } }}>
                            Next
                        </Button>
                    </Box> : <></>
                    }
                </CardContent>
            </Card>
        </>
    )
}

export default Calendar;