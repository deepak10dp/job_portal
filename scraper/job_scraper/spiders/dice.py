import scrapy
import json
import requests
from datetime import datetime

class DiceSpider(scrapy.Spider):
    name = 'dice'
    allowed_domains = ['dhigroupinc.com']
    
    def start_requests(self):
        headers = {
            'x-api-key': '1YAt0R9wBg4WfsF9VB2778F5CHLAPMVW3WAZcKd8',
        }

        params = {
            'q': 'Software',
            'countryCode2': 'US',
            'radius': '30',
            'radiusUnit': 'mi',
            'page': '1',
            'pageSize': '20',
            'facets': 'employmentType|postedDate|workFromHomeAvailability|workplaceTypes|employerType|easyApply|isRemote|willingToSponsor',
            'filters.workplaceTypes': 'Remote',
            'filters.employmentType': 'CONTRACTS',
            'filters.postedDate': 'ONE',
            'currencyCode': 'USD',
            'fields': 'id|jobId|guid|summary|title|postedDate|modifiedDate|jobLocation.displayName|detailsPageUrl|salary|clientBrandId|companyPageUrl|companyLogoUrl|companyLogoUrlOptimized|positionId|companyName|employmentType|isHighlighted|score|easyApply|employerType|workFromHomeAvailability|workplaceTypes|isRemote|debug|jobMetadata|willingToSponsor',
            'culture': 'en',
            'recommendations': 'true',
            'interactionId': '0',
            'fj': 'true',
            'includeRemote': 'true',
        }

        url = 'https://job-search-api.svc.dhigroupinc.com/v1/dice/jobs/search'
        yield scrapy.Request(
            url=f'{url}?{requests.compat.urlencode(params)}',
            headers=headers,
            callback=self.parse,
            dont_filter=True
        )

    def parse(self, response):
        try:
            data = json.loads(response.text)
            
            for job in data.get('data', []):
                job_data = {
                    'job_id': job.get('id'),
                    'title': job.get('title'),
                    'company_name': job.get('companyName'),
                    'location': job.get('jobLocation', {}).get('displayName'),
                    'summary': job.get('summary'),
                    'salary': job.get('salary'),
                    'employment_type': job.get('employmentType'),
                    'posted_date': job.get('postedDate'),
                    'is_remote': job.get('isRemote', False),
                    'company_logo_url': job.get('companyLogoUrl'),
                    'application_url': job.get('detailsPageUrl')
                }
                
                # Send POST request to Django backend
                django_api_url = 'http://127.0.0.1:8000/api/jobs/'
                headers = {'Content-Type': 'application/json'}
                
                try:
                    response = requests.post(
                        django_api_url,
                        json=job_data,
                        headers=headers
                    )
                    if response.status_code == 201:
                        self.logger.info(f"Successfully saved job: {job_data['title']}")
                    else:
                        self.logger.error(f"Failed to save job: {response.text}")
                except Exception as e:
                    self.logger.error(f"Error saving job: {str(e)}")
                
                yield job_data
        except json.JSONDecodeError as e:
            self.logger.error(f"Failed to parse JSON response: {str(e)}")
            self.logger.error(f"Response text: {response.text}")
