import React from 'react';
import { Box, Button, TextField, Typography, Stack, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

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

const validationSchema = Yup.object({
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
});

const UserInformation: React.FC<IProps> = (props) => {
    return (
        <Box sx={{ 
            minHeight: '540px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%' 
        }}>
            {/* 1. Header Section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.5, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <PersonIcon sx={{ color: '#4a7c2c' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'serif' }}>
                        Your Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Tell us who you are.
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Selection Info Pill (Matches Previous Steps) */}
            <Box sx={{ 
                mb: 4, p: 2, borderRadius: '12px', bgcolor: '#f5f5f5', 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
            }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, letterSpacing: '0.5px' }}>
                        APPOINTMENT:
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        {props.selectedDate} at {props.selectedTime}
                    </Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#e8f5e9', px: 1.2, py: 0.5, borderRadius: '20px' }}>
                    <CheckCircleIcon sx={{ color: '#4a7c2c', fontSize: '0.9rem' }} />
                    <Typography sx={{ color: '#2e7d32', fontWeight: 700, fontSize: '0.7rem' }}>Selected</Typography>
                </Box>
            </Box>

            {/* 3. Form Section */}
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
                {({ errors, touched, isValid }) => (
                    <Form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Stack spacing={2.5} sx={{ mb: 4 }}>
                            {/* Full Name */}
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
                                    FULL NAME
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="fullName"
                                    fullWidth
                                    placeholder="Enter your name"
                                    error={touched.fullName && Boolean(errors.fullName)}
                                    helperText={touched.fullName && errors.fullName}
                                    sx={textFieldStyle}
                                />
                            </Box>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {/* Email */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
                                        EMAIL ADDRESS
                                    </Typography>
                                    <Field
                                        as={TextField}
                                        name="email"
                                        fullWidth
                                        placeholder="email@example.com"
                                        error={touched.email && Boolean(errors.email)}
                                        sx={textFieldStyle}
                                    />
                                </Box>
                                {/* Phone Number */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
                                        PHONE NUMBER
                                    </Typography>
                                    <Field
                                        as={TextField}
                                        name="phoneNumber"
                                        fullWidth
                                        placeholder="(555) 000-0000"
                                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                        sx={textFieldStyle}
                                    />
                                </Box>
                            </Stack>

                            {/* Additional Notes */}
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
                                    ADDITIONAL NOTES (OPTIONAL)
                                </Typography>
                                <Field
                                    as={TextField}
                                    name="additionalNotes"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Any specific instructions for our team?"
                                    sx={textFieldStyle}
                                />
                            </Box>
                        </Stack>

                        {/* 4. Footer Buttons */}
                        <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px solid #f5f5f5' }}>
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    fullWidth 
                                    onClick={props.onBack}
                                    sx={{ py: 2, borderRadius: '12px', color: '#666', fontWeight: 800, bgcolor: '#f5f5f5' }}
                                >
                                    BACK
                                </Button>
                                <Button 
                                    fullWidth 
                                    type="submit"
                                    disabled={!isValid}
                                    variant="contained" 
                                    sx={{ 
                                        py: 2, borderRadius: '12px', bgcolor: '#c5e1a5', color: '#1b5e20', boxShadow: 'none',
                                        fontWeight: 800, '&:hover': { bgcolor: '#aed581' }
                                    }}
                                >
                                    REVIEW BOOKING →
                                </Button>
                            </Stack>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

// Common style for the text fields to keep code clean
const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        bgcolor: '#fafafa',
        '& fieldset': { borderColor: '#eee' },
        '&:hover fieldset': { borderColor: '#4a7c2c' },
        '&.Mui-focused fieldset': { borderColor: '#4a7c2c' },
    }
};

export default UserInformation;