import React from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

interface IProps {
    onBack: () => void;
    nextToReviewBooking: () => void;
    userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
    };
    setUserInformation: (values: any) => void;
    // Add these two lines back to accept the props passed from the parent component
    selectedDate: string | undefined;
    selectedTime: string | null;
}

// Visual styling variables mapped directly from the screenshot template
const colors = {
    primaryGreen: '#4a6b36',
    darkText: '#111111',
    labelGray: '#444444',
    subtextGray: '#888888',
    borderGray: '#e0e0e0',
    bgLight: '#fafafa',
    errorRed: '#d32f2f'
};

const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: colors.bgLight,
        '& fieldset': { borderColor: colors.borderGray, borderWidth: '1px' },
        '&:hover fieldset': { borderColor: '#b0b0b0' },
        '&.Mui-focused fieldset': { borderColor: colors.primaryGreen, borderWidth: '1px' },
    },
    '& .MuiInputBase-input': {
        padding: '16px 14px',
        fontSize: '1rem',
        color: colors.darkText
    }
};

// Email is now optional to match the design
const validationSchema = Yup.object({
    fullName: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').optional(),
});

const UserInformation: React.FC<IProps> = (props) => {
    return (
        <Box sx={{ width: '100%', maxWidth: '640px', mx: 'auto', p: 1 }}>
            {/* 1. Header Section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{
                    bgcolor: '#eaf2e8', p: 1.2, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <PersonIcon sx={{ color: colors.primaryGreen, fontSize: '1.4rem' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: colors.darkText, lineHeight: 1.2 }}>
                        Your Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.subtextGray, mt: 0.5 }}>
                        We'll use this to confirm your appointment
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Form Section */}
            <Formik
                initialValues={{
                    fullName: props.userInformation.fullName,
                    email: props.userInformation.email,
                    phoneNumber: props.userInformation.phoneNumber,
                    additionalNotes: props.userInformation.additionalNotes,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    props.setUserInformation({ ...props.userInformation, ...values });
                    props.nextToReviewBooking();
                }}
            >
                {({ errors, touched }) => (
                    <Form style={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={3.5} sx={{ mb: 5 }}>
                            
                            {/* Full Name */}
                            <Box>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.labelGray, mb: 1.2 }}>
                                    FULL NAME <span style={{ color: colors.errorRed }}>*</span>
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="fullName"
                                    fullWidth
                                    error={touched.fullName && Boolean(errors.fullName)}
                                    helperText={touched.fullName && errors.fullName}
                                    sx={textFieldStyle}
                                />
                            </Box>

                            {/* Phone Number */}
                            <Box>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.labelGray, mb: 1.2 }}>
                                    PHONE NUMBER <span style={{ color: colors.errorRed }}>*</span>
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="phoneNumber"
                                    fullWidth
                                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                    sx={textFieldStyle}
                                />
                                <Typography sx={{ fontSize: '0.75rem', color: colors.subtextGray, mt: 1, pl: 0.2 }}>
                                    Format: 647-555-0123 — we'll send SMS confirmation here
                                </Typography>
                            </Box>

                            {/* Email Address */}
                            <Box>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.labelGray, mb: 1.2 }}>
                                    EMAIL ADDRESS <span style={{ color: colors.subtextGray, fontWeight: 500 }}>(Optional)</span>
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="email"
                                    fullWidth
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={textFieldStyle}
                                />
                                <Typography sx={{ fontSize: '0.75rem', color: colors.subtextGray, mt: 1, pl: 0.2 }}>
                                    If provided, we'll also send confirmation by email
                                </Typography>
                            </Box>

                            {/* Additional Notes */}
                            <Box>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.labelGray, mb: 1.2 }}>
                                    ADDITIONAL NOTES <span style={{ color: colors.subtextGray, fontWeight: 500 }}>(Optional)</span>
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="additionalNotes"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={textFieldStyle}
                                />
                            </Box>
                        </Stack>

                        {/* 3. Actions Footer Area */}
                        <Box sx={{ pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button 
                                onClick={props.onBack}
                                variant="text"
                                startIcon={<ArrowBackIcon fontSize="small" />}
                                sx={{ 
                                    textTransform: 'uppercase',
                                    color: '#444', 
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    px: 2,
                                    py: 1,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#cccccc' }
                                }}
                            >
                                Back
                            </Button>
                            
                            <Button 
                                type="submit"
                                variant="contained"
                                endIcon={<ArrowForwardIcon fontSize="small" />}
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
                                Review Booking
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default UserInformation;