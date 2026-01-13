import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

interface CalendarProps {
    onNext: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onNext }) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if (value) {
            console.log(value.format('dddd, MMMM D, YYYY'));
        }
    }, [value])

    return (
        <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue)
                                    setIsSelected(true)
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    {isSelected ? <Box sx={{ display: { xs: 'block', sm: 'block' }, mt: {xs: 2, sm: 2} }}>
                        Selected: {value?.format('dddd, MMMM D, YYYY')}
                    <Button fullWidth onClick={onNext} variant="contained" sx={{ bgcolor: 'lightgreen', mt:{xs: 2, sm: 2}, color: 'black', '&:hover': { bgcolor: '#90ee90' } }}>
                                Next
                            </Button>
                        </Box>: <></>
                    }
        </>
    )
}

export default Calendar;