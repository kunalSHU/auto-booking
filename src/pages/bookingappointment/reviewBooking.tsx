import React from 'react';
import { Box, Button, Typography, Stack, Grid } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    onBack: () => void;
    userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
        address: string;
    };
    isResheduleOrCancel?: boolean;
    nextToBookingConfirmed: () => void;
    serviceName?: string;
    duration?: string;
}

const ReviewBooking: React.FC<IProps> = ({
    selectedDate,
    selectedTime,
    onBack,
    userInformation,
    nextToBookingConfirmed,
    serviceName = 'Tires (Repair, Replacement & Flat Fix)',
    duration = '30 minutes'
}) => {

    // Helper Card Container styled after Figma design
    const ReviewSectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
        <Box sx={{
            p: 3,
            mb: 2.5,
            borderRadius: '16px',
            bgcolor: '#f4f3f0',
            border: '1px solid #eae8e1'
        }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', color: '#4a7c2c' }}>{icon}</Box>
                <Typography sx={{ fontWeight: 800, color: '#4a7c2c', fontSize: '0.75rem', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                    {title}
                </Typography>
            </Stack>
            {children}
        </Box>
    );

    // Helper for key-value grid items with light sub-label
    const DetailField = ({ label, value }: { label: string; value?: string }) => (
        <Box>
            <Typography variant="caption" sx={{ color: '#888888', fontWeight: 500, display: 'block', mb: 0.5, fontSize: '0.8rem' }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                {value || '—'}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{
            minHeight: '540px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }}>
            {/* 1. Header Section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.25, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <EventAvailableIcon sx={{ color: '#4a7c2c', fontSize: '1.5rem' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.4rem' }}>
                        Review Your Booking
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                        Confirm all details before we lock it in
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Review Content Cards */}
            <Box sx={{ flexGrow: 1 }}>

                {/* APPOINTMENT CARD */}
                <ReviewSectionCard title="APPOINTMENT" icon={<EventAvailableIcon fontSize="small" />}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Service" value={serviceName} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Duration" value={duration} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Date" value={selectedDate} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Time" value={selectedTime || undefined} />
                        </Grid>
                    </Grid>
                </ReviewSectionCard>

                {/* SERVICE LOCATION CARD */}
                <ReviewSectionCard title="SERVICE LOCATION" icon={<LocationOnIcon fontSize="small" />}>
                    <DetailField label="Address (Home)" value={userInformation.address} />
                </ReviewSectionCard>

                {/* YOUR INFORMATION CARD */}
                <ReviewSectionCard title="YOUR INFORMATION" icon={<PersonIcon fontSize="small" />}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Name" value={userInformation.fullName} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Phone" value={userInformation.phoneNumber} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Email" value={userInformation.email} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailField label="Notes" value={userInformation.additionalNotes} />
                        </Grid>
                    </Grid>
                </ReviewSectionCard>

                {/* 3. Notification Banner */}
                <Box sx={{
                    mt: 1,
                    mb: 3,
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#edf5e6',
                    border: '1px solid #c8e6c9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <InfoOutlinedIcon sx={{ color: '#558b2f', fontSize: '1.25rem' }} />
                    <Typography variant="body2" sx={{ color: '#33691e', fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.4 }}>
                        Please review all details above. Once confirmed, a booking notification will be sent by SMS (and email if provided).
                    </Typography>
                </Box>
            </Box>

            {/* 4. Footer Buttons */}
            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #f5f5f5' }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        onClick={onBack}
                        variant="text"
                        sx={{
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
                        ← BACK
                    </Button>
                    <Button
                        onClick={nextToBookingConfirmed}
                        variant="contained"
                        sx={{
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
                    >
                        CONFIRM BOOKING
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ReviewBooking;