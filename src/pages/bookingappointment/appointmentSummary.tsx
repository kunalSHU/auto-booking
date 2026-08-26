import { Box, Typography, TextField, Button, InputAdornment, CircularProgress, Alert, DialogActions, DialogContent, Dialog, DialogTitle } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react'
import { getAppointmentInRedisCache, cancelAppointmentInRedisCache, generateOtp, verifyOtp } from '../../apiServer/api';

interface IProps {
    onBack?: () => void;
}

const AppointmentSummary: React.FC<IProps> = ({ onBack }) => {
    const [searchEmail, setSearchEmail] = useState('');
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showAppointment, setShowAppointment] = useState(false);

    // --- Add these OTP States ---
    const [otpOpen, setOtpOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [tempAppointment, setTempAppointment] = useState<any>(null);

    // Manages the 60s resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const viewAppointment = async () => {
        if (!searchEmail) return;

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await getAppointmentInRedisCache({ email: searchEmail });

            // Handle 404 error here
            if (res.status === 404) {
                setError("No active appointment found for this email.");
                return;
            }

            // Store the appointment data in localStorage and send OTP to user email here
            // since appointment is found
            localStorage.setItem('appointment', JSON.stringify(res.data.appointment));

            // Assuming the API returns data in res.data based on your other components
            const otpResponse = await generateOtp({ email: searchEmail });
            console.log("OTP generation response:", otpResponse);

            setOtpOpen(true);
            // Set appointment after verifying otp
            setAppointment(res.data.appointment);
            console.log("Appointment found:", res.data.appointment);
        } catch (err: any) {
            console.error("Error fetching appointment:", err);
            setError("Error fetching appointment. Please try again.");
            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtpSubmit = async () => {
        if (resendTimer > 0) return;
        setOtpError(null);
        try {
            // await generateOtp({ email: searchEmail });

            // Check if the entered OTP matches the one sent to the user's email
            const res = await verifyOtp({ email: searchEmail, otp: otpCode });

            if (res && res.status === 200) {
                setShowAppointment(true);
                setOtpOpen(false);
                setOtpCode('');
                setOtpError(null);
                setSuccess("OTP verified successfully. You can now view your appointment.");
            }

            setResendTimer(60);
        } catch (err: any) {
            setOtpError("Failed to resend code. Please try again.");
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await cancelAppointmentInRedisCache({ email: searchEmail });
            setAppointment(null);
            setSuccess("Your appointment has been cancelled successfully.");
        } catch (err: any) {
            console.error("Error cancelling appointment:", err);
            setError("Failed to cancel appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Box sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, fontFamily: 'serif' }}>
                Find Your Appointment
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 4 }}>
                Enter your email address to view or manage your current booking.
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="email@example.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#4a7c2c' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px', bgcolor: '#fafafa',
                            '& fieldset': { borderColor: '#eee' },
                            '&:hover fieldset': { borderColor: '#4a7c2c' },
                            '&.Mui-focused fieldset': { borderColor: '#4a7c2c' },
                        }
                    }}
                />
                <Button
                    variant="contained"
                    disabled={loading || !searchEmail}
                    sx={{
                        mt: 2,
                        textTransform: 'uppercase',
                        bgcolor: '#4a6b36',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.5px',
                        py: 1.5,
                        borderRadius: '6px',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#3b542b', boxShadow: 'none' }
                    }}
                    onClick={viewAppointment}
                >
                    {loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'SEARCH APPOINTMENT'}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '20px' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 4, borderRadius: '20px' }}>{success}</Alert>}

            {showAppointment && (
                <Box sx={{ p: 3, bgcolor: '#f1f8e9', borderRadius: '16px', border: '1px solid #c8e6c9', mb: 4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#4a7c2c', display: 'block', mb: 1 }}>
                        APPOINTMENT FOUND
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {appointment.date}
                    </Typography>
                    <Typography sx={{ color: '#4a7c2c', fontWeight: 700 }}>
                        at {appointment.time}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                        Status: <b>{appointment.status?.toUpperCase()}</b>
                    </Typography>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        disabled={loading}
                        sx={{
                            mt: 3,
                            borderRadius: '12px',
                            fontWeight: 800,
                            borderColor: '#ffcdd2',
                            color: '#d32f2f',
                            '&:hover': {
                                borderColor: '#d32f2f',
                                bgcolor: '#ffebee'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'CANCEL APPOINTMENT'}
                    </Button>
                </Box>
            )}

            {otpOpen && (
                <Dialog open={true} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, pb: 0 }}>Security Verification</DialogTitle>
                    <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                            Please enter the 6-digit validation sequence routed to <b>{searchEmail}</b>.
                        </Typography>

                        <TextField
                            variant="outlined"
                            value={otpCode}
                            disabled={otpLoading}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            inputProps={{
                                maxLength: 6,
                                inputMode: 'numeric',
                                style: { textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '8px' }
                            }}
                            sx={{
                                width: '220px', mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fafafa' }
                            }}
                        />

                        {otpError && <Alert severity="error" sx={{ my: 1, borderRadius: '12px', fontSize: '0.85rem' }}>{otpError}</Alert>}

                        <Box sx={{ mt: 1 }}>
                            {resendTimer > 0 ? (
                                <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
                                    Request code retry active in <b>{resendTimer}s</b>
                                </Typography>
                            ) : (
                                <Button size="small" sx={{ color: '#4a7c2c', fontWeight: 700 }} onClick={() => console.log('Resend OTP clicked')}>
                                    Resend Verification Code
                                </Button>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                        <Button variant="text" sx={{ color: '#666', fontWeight: 700 }} onClick={() => setOtpOpen(false)} disabled={otpLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleVerifyOtpSubmit}
                            disabled={otpLoading || otpCode.length < 6}
                            sx={{ bgcolor: '#4a6b36', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#3b542b' } }}
                        >
                            {otpLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'CONFIRM'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {!appointment && !loading && !error && !success && (
                <Box sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: '1px dashed #e0e0e0',
                    bgcolor: '#fcfcfc',
                    mb: 4
                }}>
                    <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 600 }}>
                        Enter your email above to retrieve and manage your booking.
                    </Typography>
                </Box>
            )}

            {onBack && (
                <Button
                    fullWidth
                    onClick={onBack}
                    sx={{
                        mt: 'auto',
                        textTransform: 'uppercase',
                        color: '#444',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.5px',
                        py: 1.5,
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        bgcolor: 'white',
                        '&:hover': { bgcolor: '#f5f5f5', borderColor: '#cccccc' }
                    }}
                >
                    BACK TO BOOKING
                </Button>
            )}
        </Box>
    )
}

export default AppointmentSummary;