from django.db import models

class Job(models.Model):
    job_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200, null=True, blank=True)
    summary = models.TextField()
    salary = models.CharField(max_length=100, null=True, blank=True)
    employment_type = models.CharField(max_length=50)
    posted_date = models.DateTimeField()
    is_remote = models.BooleanField(default=False)
    company_logo_url = models.URLField(null=True, blank=True)
    application_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company_name}"

    class Meta:
        ordering = ['-posted_date']