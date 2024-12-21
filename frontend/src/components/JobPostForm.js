import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Close, PostAdd } from '@mui/icons-material';
import axios from 'axios';

const JobPostForm = ({ open, onClose }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    summary: '',
    salary: '',
    employment_type: '',
    is_remote: false,
    application_url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/jobs/', {
        ...formData,
        posted_date: new Date().toISOString(),
      });

      setSuccess(true);
      setFormData({
        title: '',
        company_name: '',
        location: '',
        summary: '',
        salary: '',
        employment_type: '',
        is_remote: false,
        application_url: '',
      });

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error posting job. Please try again.');
    }

    setLoading(false);
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
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PostAdd sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Post a New Job
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ mt: -1, mr: -1 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Job posted successfully!
              </Alert>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                required
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., $50,000 - $70,000"
              />
            </Box>

            <FormControl fullWidth required>
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                label="Employment Type"
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Temporary">Temporary</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              label="Application URL"
              name="application_url"
              value={formData.application_url}
              onChange={handleChange}
              fullWidth
              placeholder="https://..."
            />

            <TextField
              required
              label="Job Description"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_remote}
                  onChange={handleSwitchChange}
                  name="is_remote"
                  color="primary"
                />
              }
              label="Remote Position"
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5, gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<PostAdd />}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JobPostForm;
