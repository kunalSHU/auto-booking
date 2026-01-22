import { AppBar, Box, Button, Card, CardContent, CardMedia, Container, CssBaseline, Grid, Toolbar, Typography } from '@mui/material';
import Footer from '../Footer';

const LandingPage: React.FC = () => {

    return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline/>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            APEX Auto Hub
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
              display='flex'
            >
              APEX Auto Hub
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Your premium destination for auto booking and services.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained">Book Service</Button>
              <Button variant="outlined">Contact Us</Button>
            </Box>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {[1, 2, 3].map((card) => (
              <Grid key={card} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={`https://source.unsplash.com/random?car&sig=${card}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Service {card}
                    </Typography>
                    <Typography>
                      Description for service {card}. We provide top-notch auto care.
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </Box>
  )
}

export default LandingPage;