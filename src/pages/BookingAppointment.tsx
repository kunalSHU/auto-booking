import React, { useState } from 'react';
import { 
  Box, Typography, Stepper, Step, StepLabel, IconButton, Container, Stack, Paper 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Calendar from './bookingappointment/calendar';
import AppHeader from '../Components/AppHeader';
import { Dayjs } from 'dayjs';
import UserAddress from './bookingappointment/userAddress';
import TimeSelection from './bookingappointment/timeSelection';
import ReviewBooking from './bookingappointment/reviewBooking';
import BookingConfirmed from './bookingappointment/bookingConfirmed';
import UserInformation from './bookingappointment/userInformation';
import AppFooter from '../Components/AppFooter';

const steps = ['DATE', 'LOCATION', 'TIME', 'DETAILS', 'REVIEW', 'DONE'];

const BookingAppointment: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [userInformation, setUserInformation] = useState({
        fullName: '', email: '', phoneNumber: '', additionalNotes: '', address: ''
    });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const resetStepper = () => {
        setActiveStep(0);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    return (
        <>
            <AppHeader selectedService="Oil Change for your 2022 Dodge Durango Sport" />
            <Box sx={{ 
                bgcolor: '#fcfdfc', 
                minHeight: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start',
                pt: { xs: 2, md: 8 }, 
                pb: 4, 
                px: { xs: 0, sm: 2 } 
            }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        width: '100%', 
                        maxWidth: '850px', 
                        borderRadius: { xs: 0, sm: '24px' }, 
                        border: '1px solid #f0f0f0',
                        boxShadow: '0px 10px 40px rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        bgcolor: '#fbfbfb'
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ borderBottom: '1px solid #f5f5f5', py: 3, px: { xs: 2, md: 5 } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'serif' }}>
                                    Step {activeStep + 1} of 6 — {activeStep === 0 ? 'Select a Date' : steps[activeStep]}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Choose an available date to get started
                                </Typography>
                            </Box>
                            <IconButton sx={{ bgcolor: '#f5f5f5', borderRadius: 2, '&:hover': { bgcolor: '#efefef' } }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Content Section */}
                    <Box sx={{ p: { xs: 2, md: 6 } }}>
                        <Stepper activeStep={activeStep} alternativeLabel connector={null} sx={{ mb: 6 }}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Box sx={{
                                                width: 40, height: 40, borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '2px solid',
                                                borderColor: index <= activeStep ? '#4a7c2c' : '#e0e0e0',
                                                bgcolor: index === activeStep ? '#4a7c2c' : 'white',
                                                color: index === activeStep ? 'white' : index < activeStep ? '#4a7c2c' : '#bdbdbd',
                                                fontWeight: 800,
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
                                                {index + 1}
                                                {/* Manual Connector Line */}
                                                {index < steps.length - 1 && (
                                                    <Box sx={{ 
                                                        position: 'absolute', left: '100%', top: '50%', 
                                                        width: { xs: '30px', sm: '60px', md: '80px' }, 
                                                        height: '1px', bgcolor: '#e0e0e0', zIndex: -1 
                                                    }} />
                                                )}
                                            </Box>
                                        )}
                                    >
                                        <Typography sx={{ 
                                            fontSize: '0.7rem', fontWeight: 800, 
                                            color: index <= activeStep ? '#4a7c2c' : '#bdbdbd', mt: 1 
                                        }}>
                                            {label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box sx={{ mt: 2 }}>
                            {activeStep === 0 && <Calendar onNext={handleNext} value={selectedDate} setValue={setSelectedDate} />}
                            {activeStep === 1 && <UserAddress handleBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} handleNext={handleNext} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')}/>}
                            {activeStep === 2 && <TimeSelection onBack={handleBack} nextToYourInformation={handleNext} selectedTime={selectedTime} setSelectedTime={setSelectedTime} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                            {activeStep === 3 && <UserInformation nextToReviewBooking={handleNext} onBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}   
                            {activeStep === 4 && <ReviewBooking onBack={handleBack} nextToBookingConfirmed={handleNext} userInformation={userInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}        
                            {activeStep === 5 && <BookingConfirmed activeStep={activeStep} resetStepper={resetStepper} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} notes={userInformation.additionalNotes} selectedTime={selectedTime} email={userInformation.email} address={userInformation.address} phoneNumber={userInformation.phoneNumber} customerName={userInformation.fullName}/>}  
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <AppFooter/>
        </>
    );
};

export default BookingAppointment;