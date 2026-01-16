import React, { useEffect } from 'react';
import { Box, Button, Card, CardContent } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

interface CalendarProps {
    onNext: () => void;
    value: Dayjs | null;
    setValue: (value: Dayjs | null) => void;
}

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
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue)
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    {value ? <Box sx={{ display: { xs: 'block', sm: 'block' }, mt: { xs: 2, sm: 2 } }}>
                        Selected: {value?.format('dddd, MMMM D, YYYY')}
                        <Button fullWidth onClick={onNext} variant="contained" sx={{ bgcolor: 'lightgreen', mt: { xs: 2, sm: 2 }, textTransform: 'none', color: 'black', '&:hover': { bgcolor: '#90ee90' } }}>
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