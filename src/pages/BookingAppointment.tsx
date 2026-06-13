import React, { useState } from 'react';
import {
    Box, Typography, Stepper, Step, StepLabel, IconButton, Container, Stack, Paper, Button, Divider
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
import AppointmentSummary from './bookingappointment/appointmentSummary';
import AppFooter from '../Components/AppFooter';
import BookingDetails from './bookingappointment/bookingDetails';

const steps = ['DATE', 'LOCATION', 'TIME', 'DETAILS', 'REVIEW', 'DONE'];

const BookingAppointment: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [userInformation, setUserInformation] = useState({
        fullName: '', email: '', phoneNumber: '', additionalNotes: '', address: ''
    });
    const [isViewingSummary, setIsViewingSummary] = useState(false);

    const selectedService = "Oil Change for your 2022 Dodge Durango Sport";

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const resetStepper = () => {
        setActiveStep(0);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    return (
        <>
            <AppHeader />
            
            {/* Vehicle Bar - Continuity from VehiclePage */}
            {!isViewingSummary && (
                <Box sx={{ 
                    bgcolor: '#fff', 
                    borderBottom: '1px solid #f0f0f0', 
                    py: 1.5, 
                    display: 'flex', 
                    justifyContent: 'center' 
                }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: '1300px', px: { xs: 2, sm: 4 } }}>
                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>
                            <span style={{ fontSize: '1.1rem' }}>🚗</span> 2022 Dodge Durango Sport
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem', color: '#666' }}>
                            <span style={{ fontSize: '1.1rem' }}>📍</span> {userInformation.address || 'Location pending'}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="caption" sx={{ bgcolor: '#f1f8e9', color: '#4a7c2c', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 800 }}>
                            STEP 3: SCHEDULE
                        </Typography>
                    </Stack>
                </Box>
            )}

            <Box sx={{
                bgcolor: '#fcfbfb',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                pt: { xs: 2, md: 6 },
                pb: 4,
                px: { xs: 2, sm: 4 }
            }}>
                {/* Layout Wrapper: Stacks on mobile, Rows on desktop */}
                <Stack
                    direction={{ xs: 'column', lg: 'row' }} // Stacks vertically on mobile/tablet, row on large screens
                    spacing={4} // This creates the "bit of space" (32px) between the components
                    alignItems="flex-start"
                    justifyContent="center"
                    sx={{ maxWidth: '1300px', mx: 'auto' }} // Keeps the total layout from getting too wide
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            maxWidth: '850px',
                            borderRadius: { xs: 0, sm: '32px' },
                            border: '1px solid #f0f0f0',
                            boxShadow: '0px 20px 50px rgba(0,0,0,0.04)',
                            overflow: 'hidden',
                            bgcolor: '#fff'
                        }}
                    >
                        {/* Header Section */}
                        <Box sx={{ borderBottom: '1px solid #f5f5f5', py: 3, px: { xs: 2, md: 5 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#4a7c2c', fontWeight: 700, letterSpacing: '0.5px', display: 'block', mb: 0.5 }}>
                                        {isViewingSummary ? 'Management' : `Step ${activeStep + 1} of 6`}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', fontFamily: 'serif', lineHeight: 1.2 }}>
                                        {isViewingSummary ? 'Manage Appointment' : (activeStep === 0 ? 'Select a Date' : steps[activeStep])}
                                    </Typography>
                                    {!isViewingSummary && (
                                        <Button 
                                            size="small" 
                                            onClick={() => setIsViewingSummary(true)}
                                            sx={{ 
                                                color: '#4a7c2c', 
                                                fontWeight: 700, 
                                                p: 0, 
                                                minWidth: 0, 
                                                mt: 0.5, 
                                                textTransform: 'none', 
                                                fontSize: '0.8rem',
                                                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
                                            }}
                                        >
                                            View or Cancel existing appointments
                                        </Button>
                                    )}
                                </Box>
                                <IconButton onClick={resetStepper} sx={{ bgcolor: '#f5f5f5', borderRadius: '12px', '&:hover': { bgcolor: '#efefef' } }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ p: { xs: 3, md: 6 } }}>
                            {!isViewingSummary && (
                            <Stepper activeStep={activeStep} alternativeLabel connector={null} sx={{ mb: 6 }}>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel
                                            StepIconComponent={() => (
                                                <Box sx={{
                                                    width: 36, height: 36, borderRadius: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: '1.5px solid',
                                                    borderColor: index <= activeStep ? '#4a7c2c' : '#eeeeee',
                                                    bgcolor: index === activeStep ? '#4a7c2c' : index < activeStep ? '#f1f8e9' : 'white',
                                                    color: index === activeStep ? 'white' : index < activeStep ? '#4a7c2c' : '#aaa',
                                                    fontWeight: 800,
                                                    fontSize: '0.9rem',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    {index < activeStep ? '✓' : index + 1}
                                                    {/* Manual Connector Line */}
                                                    {index < steps.length - 1 && (
                                                        <Box sx={{
                                                            position: 'absolute', left: '100%', top: '50%',
                                                            width: { xs: '30px', sm: '60px', md: '80px' },
                                                            height: '2px', bgcolor: index < activeStep ? '#4a7c2c' : '#eee', zIndex: -1
                                                        }} />
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            <Typography sx={{
                                                fontSize: '0.65rem', fontWeight: 900,
                                                color: index <= activeStep ? '#1a1a1a' : '#bbb', mt: 1,
                                                textTransform: 'uppercase', letterSpacing: '0.5px'
                                            }}>
                                                {label}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            )}

                            <Box sx={{ mt: 0 }}>
                                {isViewingSummary ? (
                                    <AppointmentSummary onBack={() => setIsViewingSummary(false)} />
                                ) : (
                                    <>
                                        {activeStep === 0 && <Calendar onNext={handleNext} value={selectedDate} setValue={setSelectedDate} />}
                                        {activeStep === 1 && <UserAddress handleBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} handleNext={handleNext} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                                        {activeStep === 2 && <TimeSelection onBack={handleBack} nextToYourInformation={handleNext} selectedTime={selectedTime} setSelectedTime={setSelectedTime} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                                        {activeStep === 3 && <UserInformation nextToReviewBooking={handleNext} onBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}
                                        {activeStep === 4 && <ReviewBooking onBack={handleBack} nextToBookingConfirmed={handleNext} userInformation={userInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}
                                        {activeStep === 5 && <BookingConfirmed activeStep={activeStep} resetStepper={resetStepper} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} notes={userInformation.additionalNotes} selectedTime={selectedTime} email={userInformation.email} address={userInformation.address} phoneNumber={userInformation.phoneNumber} customerName={userInformation.fullName} />}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                    {/* The Booking Details Side Card */}
                    {!isViewingSummary && 
                    <Box sx={{
                        width: { xs: '100%', lg: '60%' }, // Full width on mobile, fixed width on desktop
                        position: { lg: 'sticky' }, // Optional: keeps it visible while scrolling on desktop
                        top: 40
                    }}>
                        <BookingDetails
                            selectedDate={selectedDate?.format('MMM D, YYYY')}
                            selectedTime={selectedTime}
                            selectedContact={userInformation.email}
                            location={userInformation.address}
                        />
                    </Box>}

                </Stack>
            </Box>
            <AppFooter />
        </>
    );
};

export default BookingAppointment;