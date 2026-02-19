import { Box, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { useState } from 'react';
import AppointmentSummary from './appointmentSummary';

interface ITimeSelectionProps {
    onBack: () => void;
    selectedDate: string | undefined;
    nextToYourInformation: () => void;
    setSelectedTime: (time: string | null) => void;
    selectedTime: string | null;
}

const TimeSelection: React.FC<ITimeSelectionProps> = (props: ITimeSelectionProps) => {
    const morningLst = ['9:00 AM', '10:00 AM', '11:00 AM']
    const middayLst = ['12:00 PM', '1:00 PM', '2:00 PM']
    const afternoonLst = ['3:00 PM', '4:00 PM', '5:00 PM']

    const backToCalendar = () => {
        props.onBack();
    }

    const nextToYourInformation = () => {
        props.nextToYourInformation();
    }

    const renderTimeButtons = (times: string[]) => (
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            {times.map((time, index) => (
                <Button
                    key={index}
                    variant="outlined"
                    onClick={() => props.setSelectedTime(time)}
                    sx={{
                        borderColor: '#e0e0e0',
                        color: props.selectedTime === time ? 'white' : 'text.primary',
                        bgcolor: props.selectedTime === time ? 'green' : 'transparent',
                        '&:hover': {
                            bgcolor: props.selectedTime === time ? 'darkgreen' : '#f5f5f5',
                            borderColor: props.selectedTime === time ? 'darkgreen' : '#e0e0e0'
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
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={backToCalendar}
                            sx={{ 
                                py: 1.5, 
                                borderRadius: 2, 
                                color: 'black', 
                                borderColor: '#ccc',
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            Back
                        </Button>
                        <Button 
                            disabled={props.selectedTime ? false : true} 
                            onClick={nextToYourInformation} 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                                py: 1.5, 
                                borderRadius: 2, 
                                backgroundColor: '#ccff90', 
                                color: 'black', 
                                boxShadow: 'none', 
                                '&:hover': { backgroundColor: '#b2ff59', boxShadow: 'none' }, 
                                textTransform: 'none', 
                                fontSize: '1rem', 
                                fontWeight: 600
                            }}
                        >
                            Next
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
            <AppointmentSummary selectedDate={props.selectedDate} selectedTime={props.selectedTime} />
        </>
    )
}

export default TimeSelection;