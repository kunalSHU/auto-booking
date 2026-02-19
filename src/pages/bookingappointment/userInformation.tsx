import React from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AppointmentSummary from './appointmentSummary';
import { Field, Form, Formik } from 'formik';
import { object, string } from 'yup';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    onBack: () => void;
    nextToReviewBooking: () => void;
    userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
    }
    setUserInformation: (values: any) => void;
}

const UserInformation: React.FC<IProps> = (props) => {
    return (
        <>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
                <Formik
                    initialValues={{
                        fullName: props.userInformation.fullName,
                        email: props.userInformation.email,
                        phoneNumber: props.userInformation.phoneNumber,
                        additionalNotes: props.userInformation.additionalNotes,
                    }}
                    onSubmit={(values, formikHelpers) => {
                        console.log(values);
                        props.setUserInformation({...props.userInformation, ...values})
                        props.nextToReviewBooking();
                        // formikHelpers.resetForm();
                    }}
                    validationSchema={
                        object({
                            fullName: string().required("Please enter your full name"),
                            phoneNumber: string().required("Please enter your phone number"),
                            email: string().required("Please enter your email").email("Invalid email")
                        })
                    }
                >
                    {({ values, handleChange, handleBlur, errors, isValid, touched, dirty }) => (
                        <Form>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Your Information</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Full Name *</Typography>
                                    <Field
                                        fullWidth
                                        size="small"
                                        name="fullName"
                                        as={TextField}
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.fullName) && Boolean(errors.fullName)}
                                        helperText={Boolean(touched.fullName) && errors.fullName}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Email Address *</Typography>
                                    <Field
                                        fullWidth
                                        size="small"
                                        name="email"
                                        as={TextField}
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.email) && Boolean(errors.email)}
                                        helperText={Boolean(touched.email) && errors.email}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Phone Number *</Typography>
                                    <Field
                                        fullWidth
                                        size="small"
                                        as={TextField}
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.phoneNumber) && Boolean(errors.phoneNumber)}
                                        helperText={Boolean(touched.phoneNumber) && errors.phoneNumber}
                                    />
                                </Box>
                                <Box>
                                    <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Additional Notes</Typography>
                                    <Field
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="additionalNotes"
                                        as={TextField}
                                        value={values.additionalNotes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Box>
                            </CardContent>
                            <Box sx={{ px: 3, pb: 3 }}>
                                <Stack spacing={2}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        onClick={props.onBack}
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
                                        disabled={!isValid} 
                                        type="submit" 
                                        fullWidth
                                        variant="contained" 
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
                                        Review Booking
                                    </Button>
                                </Stack>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Card>
            <AppointmentSummary selectedDate={props.selectedDate} selectedTime={props.selectedTime} />
        </>
    )
}

export default UserInformation;