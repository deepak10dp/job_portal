import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Button,
  InputAdornment,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Business,
  WorkOutline,
  Visibility,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import axios from 'axios';
import JobDetail from './JobDetail';

const JobList = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, employmentType, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/api/jobs/?page=${page}`;
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      if (employmentType) {
        url += `&employment_type=${employmentType}`;
      }
      const response = await axios.get(url);
      setJobs(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / 10));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleEmploymentTypeChange = (event) => {
    setEmploymentType(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setDetailOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const refreshJobs = () => {
    fetchJobs();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={employmentType}
                onChange={handleEmploymentTypeChange}
                label="Employment Type"
                sx={{
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Temporary">Temporary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="text" width={150} />
                    </Box>
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {job.title}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <Business sx={{ mr: 1, fontSize: 20 }} />
                        {job.company_name}
                      </Typography>

                      {job.location && (
                        <Typography
                          variant="body2"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                          {job.location}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <WorkOutline sx={{ mr: 1, fontSize: 20 }} />
                        {job.employment_type}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                        Posted {formatDate(job.posted_date)}
                      </Typography>
                    </Box>

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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1,
                      }}
                    >
                      {job.summary}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleJobClick(job)}
                        sx={{
                          borderWidth: 1.5,
                          '&:hover': {
                            borderWidth: 1.5,
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 500,
              },
            }}
          />
        </Box>
      )}

      <JobDetail
        job={selectedJob}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </Box>
  );
};

export default JobList;
