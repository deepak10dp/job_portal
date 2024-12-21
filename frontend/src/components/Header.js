import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { Work, Notifications, AccountCircle, PostAdd } from '@mui/icons-material';
import JobPostForm from './JobPostForm';

const Header = () => {
  const theme = useTheme();
  const [postJobOpen, setPostJobOpen] = useState(false);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Work 
                sx={{ 
                  fontSize: 32, 
                  mr: 2, 
                  color: 'primary.main',
                  transform: 'rotate(-10deg)',
                }} 
              />
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  letterSpacing: '-0.5px',
                }}
              >
                Job Portal
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<PostAdd />}
                onClick={() => setPostJobOpen(true)}
                sx={{
                  mr: 2,
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                  },
                }}
              >
                Post Job
              </Button>

              <Button
                startIcon={<Notifications />}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Notifications
              </Button>
              <Button
                startIcon={<AccountCircle />}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Profile
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <JobPostForm
        open={postJobOpen}
        onClose={() => setPostJobOpen(false)}
      />
    </>
  );
};

export default Header;
