import React, { useState } from 'react';
import { Box, Card, Typography, Stepper, Step, StepLabel, StepIconProps, LinearProgress } from '@mui/material';
import BookingSidebar from './bookingappointment/BookingSidebar';
import Calendar from './bookingappointment/calendar';
import TimeSelection from './bookingappointment/timeSelection';
import { Dayjs } from 'dayjs';

const steps = [1, 2, 3, 4, 5];

const CustomStepIcon = (props: StepIconProps) => {
    const { active, completed, icon } = props;
    return (
        <Box
            sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: active || completed ? 'lightgreen' : '#e0e0e0',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
            }}
        >
            {icon}
        </Box>
    );
};

const BookingAppointment: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // xs = mobile screens
    // sm = larger screens
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, minHeight: '100vh' }}>
            <BookingSidebar />
            <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 5 }, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
                <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ position: 'relative', fontWeight: 'bold', color: '#394508', paddingLeft: '5%' }}>APEX Auto Hub</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>Book your maintanence appointment</Typography>

                    <Box sx={{ mb: 5 }}>
                        <Stepper activeStep={activeStep} alternativeLabel connector={null}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={CustomStepIcon} />
                                </Step>
                            ))}
                        </Stepper>
                        <LinearProgress variant="determinate" value={(activeStep / steps.length) * 100} sx={{ mt: 1, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: 'lightgreen' } }} />
                    </Box>

                    {activeStep === 0 && <Calendar onNext={handleNext} value={selectedDate} setValue={setSelectedDate} />}
                    {activeStep === 1 && <TimeSelection onBack={handleBack} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                </Card>
            </Box>
        </Box>
    )
}

export default BookingAppointment;
