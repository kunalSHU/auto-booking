import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Stepper, Step, StepLabel, Stack, Paper, Button, StepConnector, stepConnectorClasses
} from '@mui/material';
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
import ScheduleBanner from './bookingappointment/ScheduleBanner'; // Adjust path as needed
import VehicleInfoCard from './bookingappointment/VehicleInfoCard';
import { Navigate, useNavigate } from 'react-router-dom';

const steps = ['DATE & TIME', 'LOCATION', 'DETAILS', 'REVIEW', 'DONE'];

const colors = {
    primaryGreen: '#4a6b36',
    darkText: '#111111',
    labelGray: '#444444',
    subtextGray: '#888888',
    borderGray: '#e0e0e0',
    bgLight: '#fafafa',
    errorRed: '#d32f2f'
};

const CustomStepConnector = () => (
    <StepConnector
        sx={{
            [`&.${stepConnectorClasses.alternativeLabel}`]: {
                top: { xs: 5, sm: 7 },
                left: 'calc(-50% + 8px)',
                right: 'calc(50% + 8px)',
            },
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: '#eee',
                borderTopWidth: 2,
                borderRadius: 1,
            },
            [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
                borderColor: '#4a7c2c',
            },
            [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
                borderColor: '#4a7c2c',
            },
        }}
    />
);

const BookingAppointment: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [userInformation, setUserInformation] = useState({
        fullName: '', email: '', phoneNumber: '', additionalNotes: '', address: ''
    });
    const [isViewingSummary, setIsViewingSummary] = useState(false);
    const navigate = useNavigate();
    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveStep((prev) => prev + 1);
    };
    const handleBack = () => { 
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveStep((prev) => prev - 1);
    };

    const resetStepper = () => {
        setActiveStep(0);
        setSelectedDate(null);
        setUserInformation({ fullName: '', email: '', phoneNumber: '', additionalNotes: '', address: '' });
        setSelectedTime(null);
    };

    const storedVehicle = sessionStorage.getItem('autovivo_vehicle');
    useEffect(() => {
        console.log('Stored vehicle from sessionStorage:', storedVehicle);
        if (storedVehicle) {
            const selectedVehicle: string = JSON.parse(storedVehicle);
            setSelectedVehicle(selectedVehicle);
        }   
    }, []);

    // Direct Route Guard: Redirect back to home if no vehicle exists
    if (!storedVehicle || storedVehicle === "") {
        console.log('No vehicle found in sessionStorage. Redirecting to home page.');
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <AppHeader />

            {/* New Schedule Service Banner Header */}
            {!isViewingSummary && (
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ScheduleBanner
                        serviceName="Oil Change"
                        vehicleName="2022 Dodge Durango Sport"
                    />
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
                px: { xs: 1.5, sm: 4 }
            }}>
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="center"
                    sx={{ width: '100%', maxWidth: '1400px', mx: 'auto' }}
                >
                    {/* Vehicle Info Card + Main Step Form Card */}
                    <Box sx={{ flex: '2 1 800px', width: '100%', minWidth: { xs: '100%', sm: 320 } }}>
                        {/* Vehicle Info Card */}
                        {!isViewingSummary && (
                            <VehicleInfoCard year={selectedVehicle?.year} make={selectedVehicle?.make} model={selectedVehicle?.model} trim={selectedVehicle?.trim} color={selectedVehicle?.color} />
                        )}

                    {/* Main Step Form Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            borderRadius: { xs: '16px', sm: '32px' },
                            border: '1px solid #f0f0f0',
                            boxShadow: '0px 20px 50px rgba(0,0,0,0.04)',
                            height: 'auto',
                            minHeight: 'fit-content',
                            overflow: 'visible',
                            bgcolor: '#f5f5f5'
                        }}
                    >
                        {/* Header Section */}
                        <Box sx={{ borderBottom: '1px solid #f5f5f5', py: 3, px: { xs: 2.5, md: 5 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#4a7c2c', fontWeight: 700, letterSpacing: '0.5px', display: 'block', mb: 0.5 }}>
                                        {isViewingSummary ? 'Management' : `Step ${activeStep + 1} of 5`}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', fontFamily: 'serif', lineHeight: 1.2 }}>
                                        {isViewingSummary ? 'Manage Appointment' : steps[activeStep]}
                                    </Typography>
                                    {!isViewingSummary && (
                                        <Button
                                            size="small"
                                            onClick={() => {setIsViewingSummary(true); /*navigate('/manage-appointment');*/}}
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
                            </Stack>
                        </Box>

                        {/* Content Body */}
                        <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
                            {!isViewingSummary && (
                                <Stepper
                                    activeStep={activeStep}
                                    alternativeLabel
                                    connector={<CustomStepConnector />}
                                    sx={{ mb: { xs: 3, sm: 6 }, px: 0 }}
                                >
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel
                                                StepIconComponent={() => (
                                                    <Box sx={{
                                                        width: { xs: 10, sm: 14 },
                                                        height: { xs: 10, sm: 14 },
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '2px solid',
                                                        borderColor: index <= activeStep ? '#4a7c2c' : '#e0e0e0',
                                                        bgcolor: index <= activeStep ? '#4a7c2c' : 'white',
                                                        color: 'white',
                                                        fontSize: '0.65rem',
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        {index < activeStep ? '✓' : ''}
                                                    </Box>
                                                )}
                                            >
                                                <Typography sx={{
                                                    fontSize: { xs: '0.6rem', sm: '0.65rem' },
                                                    fontWeight: 900,
                                                    color: index <= activeStep ? '#1a1a1a' : '#bbb',
                                                    mt: 1,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    textAlign: 'center'
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
                                    <AppointmentSummary onBack={() => { setIsViewingSummary(false); resetStepper(); }} />
                                ) : (
                                    <>
                                        {activeStep === 0 && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                {/* Calendar View */}
                                                <Box sx={{ width: '100%' }}>
                                                    <Calendar onNext={handleNext} value={selectedDate} setValue={setSelectedDate} hideContinueButton />
                                                </Box>

                                                {/* Time Selection Section */}
                                                {selectedDate && (
                                                    <Box sx={{
                                                        width: '100%',
                                                        mt: 3,
                                                        pt: 3,
                                                        borderTop: '1px solid #eee',
                                                        display: 'block'
                                                    }}>
                                                        <TimeSelection
                                                            onBack={handleBack}
                                                            nextToYourInformation={handleNext}
                                                            selectedTime={selectedTime}
                                                            setSelectedTime={setSelectedTime}
                                                            selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')}
                                                            hideNavigation
                                                        />
                                                    </Box>
                                                )}

                                                {/* Continue Action Button */}
                                                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'flex-end' }}>

                                                    <Button
                                                        disabled={!selectedDate || !selectedTime}
                                                        onClick={handleNext}
                                                        variant="contained"
                                                        sx={{
                                                            textTransform: 'uppercase',
                                                            bgcolor: colors.primaryGreen,
                                                            fontWeight: 700,
                                                            fontSize: '0.85rem',
                                                            letterSpacing: '0.5px',
                                                            px: 3,
                                                            py: 1.5,
                                                            borderRadius: '6px',
                                                            boxShadow: 'none',
                                                            '&:hover': { bgcolor: '#3b542b', boxShadow: 'none' }
                                                        }}
                                                    >
                                                        CONTINUE →
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                        {activeStep === 1 && <UserAddress handleBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} handleNext={handleNext} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} />}
                                        {activeStep === 2 && <UserInformation nextToReviewBooking={handleNext} onBack={handleBack} userInformation={userInformation} setUserInformation={setUserInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}
                                        {activeStep === 3 && <ReviewBooking onBack={handleBack} nextToBookingConfirmed={handleNext} userInformation={userInformation} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} selectedTime={selectedTime} />}
                                        {activeStep === 4 && <BookingConfirmed activeStep={activeStep} resetStepper={resetStepper} selectedDate={selectedDate?.format('dddd, MMMM D, YYYY')} notes={userInformation.additionalNotes} selectedTime={selectedTime} email={userInformation.email} address={userInformation.address} phoneNumber={userInformation.phoneNumber} customerName={userInformation.fullName} selectedVehicle={selectedVehicle}/>}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                    </Box> {/* end Vehicle Info Card + Main Step Form wrapper */}

                    {/* Booking Details Side/Bottom Card */}
                    {!isViewingSummary && (
                        <Box sx={{
                            flex: '1 1 360px',
                            width: '100%',
                            minWidth: { xs: '100%', sm: 320 },
                            position: { lg: 'sticky' },
                            top: 40
                        }}>
                            <BookingDetails
                                selectedDate={selectedDate?.format('MMM D, YYYY')}
                                selectedTime={selectedTime}
                                selectedContact={userInformation.email}
                                location={userInformation.address}
                            />
                        </Box>
                    )}

                </Stack>
            </Box>
            <AppFooter />
        </>
    );
};

export default BookingAppointment;