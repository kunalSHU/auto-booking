import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Divider,
    Paper,
} from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BuildIcon from '@mui/icons-material/Build';
import PaletteIcon from '@mui/icons-material/Palette';

interface VehicleInfoCardProps {
    year?: string | number;
    make?: string;
    model?: string;
    trim?: string;
    color?: string;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ year, make, model, trim, color }) => {

    useEffect(() => {
        console.log('VehicleInfoCard props:', { year, make, model, trim, color });
    }, [])

    const fields = [
        { icon: <CalendarTodayIcon sx={{ fontSize: '0.95rem', color: '#888' }} />, label: 'YEAR', value: year },
        { icon: <DirectionsCarFilledIcon sx={{ fontSize: '0.95rem', color: '#888' }} />, label: 'MAKE & MODEL', value: `${make} ${model}` },
        { icon: <BuildIcon sx={{ fontSize: '0.95rem', color: '#888' }} />, label: 'TRIM', value: trim },
        { icon: <PaletteIcon sx={{ fontSize: '0.95rem', color: '#888' }} />, label: 'COLOR', value: color },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                bgcolor: '#f9fbf9',
                borderRadius: '24px',
                border: '1px solid #f0f4f0',
                boxShadow: '0px 20px 50px rgba(0,0,0,0.04)',
                p: { xs: 3, md: 4 },
                mb: 3,
            }}
        >
            {/* Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box
                    sx={{
                        bgcolor: '#e8f5e9',
                        p: 1,
                        borderRadius: '10px',
                        display: 'flex',
                        border: '1px solid #c8e6c9',
                    }}
                >
                    <DirectionsCarFilledIcon sx={{ color: '#4a7c2c', fontSize: '1.2rem' }} />
                </Box>
                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 800,
                            color: '#4a7c2c',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            display: 'block',
                        }}
                    >
                        YOUR VEHICLE
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 900,
                            fontFamily: 'serif',
                            color: '#1a1a1a',
                            fontSize: '1.2rem',
                            lineHeight: 1.2,
                        }}
                    >
                        {year} {make} {model} {trim}
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />

            {/* Fields */}
            <Stack
                direction="row"
                flexWrap="wrap"
                gap={3}
            >
                {fields.map((field) => (
                    <Box key={field.label} sx={{ minWidth: 120 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 800,
                                color: '#bdbdbd',
                                letterSpacing: '1px',
                                display: 'block',
                                mb: 0.5,
                            }}
                        >
                            {field.label}
                        </Typography>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                            {field.icon}
                            <Typography
                                sx={{
                                    color: '#1a1a1a',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                }}
                            >
                                {field.value}
                            </Typography>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default VehicleInfoCard;

