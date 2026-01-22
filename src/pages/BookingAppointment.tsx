import React, { useState } from 'react';
import { Box, Card, Typography, Stepper, Step, StepLabel, StepIconProps, LinearProgress } from '@mui/material';
import BookingSidebar from './bookingappointment/BookingSidebar';
import Calendar from './bookingappointment/calendar';
import TimeSelection from './bookingappointment/timeSelection';
import { Dayjs } from 'dayjs';
import UserInformation from './bookingappointment/userInformation';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import ReviewBooking from './bookingappointment/reviewBooking';
import BookingConfirmed from './bookingappointment/bookingConfirmed';

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
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [userInformation, setUserInformation] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        additionalNotes: ''
    });

    const handleNext = () => {

        // Need to send notification if active step equals 4

        setActiveStep((prevActiveStep: any) => {
            let currentStep = prevActiveStep + 1;
            console.log("this is the activeStep " + activeStep)
            return currentStep;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const resetStepper = () => {
        setActiveStep(0);
        setSelectedDate(null);
        setSelectedTime(null);
    }

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
                        <LinearProgress variant="determinate" value={activeStep < 4 ? (activeStep / steps.length) * 100 : 100} sx={{ mt: 1, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: 'lightgreen' } }} />
                    </Box>

                    {activeStep === 0 && <Calendar onNext={handleNext} value={selectedDate} setValue={setSelectedDate} />}
                    {activeStep === 1 && <TimeSelection onBack={handleBack} nextToYourInformation={handleNext} selectedTime={selectedTime} setSelectedTime={setSelectedTime} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                    {activeStep === 2 && <UserInformation nextToReviewBooking={handleNext} onBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}   
                    {activeStep === 3 && <ReviewBooking onBack={handleBack} nextToBookingConfirmed={handleNext} userInformation={userInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}        
                    {activeStep === 4 && <BookingConfirmed activeStep={activeStep} resetStepper={resetStepper} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} email={userInformation.email}/>}            
                    </Card>
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>APEX Auto Hub</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                        <Typography variant="body2">Feature</Typography>
                        <Typography variant="body2">Learn more</Typography>
                        <Typography variant="body2">Support</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                        <InstagramIcon />
                        <LinkedInIcon />
                        <XIcon />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BookingAppointment;
