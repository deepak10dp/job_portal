import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  Business,
  LocationOn,
  WorkOutline,
  AccessTime,
  AttachMoney,
  Launch,
} from '@mui/icons-material';

const JobDetail = ({ job, open, onClose }) => {
  const theme = useTheme();

  if (!job) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pt: 3,
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {job.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            {job.company_name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ mt: -1, mr: -1 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Job Meta Information */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="primary" />
              <Typography variant="body2">{job.company_name}</Typography>
            </Box>
            {job.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                <Typography variant="body2">{job.location}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkOutline color="primary" />
              <Typography variant="body2">{job.employment_type}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              <Typography variant="body2">Posted {formatDate(job.posted_date)}</Typography>
            </Box>
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {job.is_remote && (
              <Chip
                label="Remote"
                color="primary"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
            {job.salary && (
              <Chip
                icon={<AttachMoney />}
                label={job.salary}
                color="success"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Job Description */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              Job Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {job.summary}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5, gap: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {job.application_url && (
          <Button
            variant="contained"
            endIcon={<Launch />}
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default JobDetail;
