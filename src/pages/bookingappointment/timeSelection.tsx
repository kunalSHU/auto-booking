import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { useState } from 'react';

interface ITimeSelectionProps {
    onBack: () => void;
    selectedDate: string | undefined;
}

const TimeSelection: React.FC<ITimeSelectionProps> = (props: ITimeSelectionProps) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const morningLst = ['9:00 AM', '10:00 AM', '11:00 AM']
    const middayLst = ['12:00 PM', '1:00 PM', '2:00 PM']
    const afternoonLst = ['3:00 PM', '4:00 PM', '5:00 PM']

    const backToCalendar = () => {
        props.onBack();
    }

    const renderTimeButtons = (times: string[]) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            {times.map((time, index) => (
                <Button
                    key={index}
                    variant="outlined"
                    onClick={() => setSelectedTime(time)}
                    sx={{
                        borderColor: '#e0e0e0',
                        color: selectedTime === time ? 'white' : 'text.primary',
                        bgcolor: selectedTime === time ? 'green' : 'transparent',
                        '&:hover': {
                            bgcolor: selectedTime === time ? 'darkgreen' : '#f5f5f5',
                            borderColor: selectedTime === time ? 'darkgreen' : '#e0e0e0'
                        },
                        minWidth: '100px',
                        width: '100%'
                    }}
                >
                    {time}
                </Button>
            ))}
        </Box>
    );

    return (
        <>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Select a Time</Typography>
                    </Box>
                    <Box sx={{ ml: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 3, fontSize: 14 }}>
                            {props.selectedDate}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Morning</Typography>
                            {renderTimeButtons(morningLst)}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ display: 'flex', fontWeight: 'bold' }}>Mid-day</Typography>
                            {renderTimeButtons(middayLst)}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ display: 'flex', fontWeight: 'bold' }}>Afternoon</Typography>
                            {renderTimeButtons(afternoonLst)}
                        </Box>
                    </Box>
                    <Button onClick={backToCalendar} variant="outlined" sx={{ mt: 2, color: 'black', borderColor: 'black' }}>Back</Button>
                </CardContent>
            </Card>

            <Box sx={{ bgcolor: '#f5f5f5', p: 2, mt: 3, borderRadius: 1 }}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold', mb: 2, display: 'flex'
                }}>
                    Appointment Summary
                </Typography>
                <Box sx={{ gap: 1 }}>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Service:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>Silver Package</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Date:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.selectedDate}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Time:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{selectedTime || 'Not Selected'}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Duration:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold' }}>60 minutes</Typography>
                </Box>
            </Box>
        </>
    )
}

export default TimeSelection;