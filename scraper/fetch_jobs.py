import requests
import json
import re
from collections import defaultdict

# Define skill categories
SKILL_CATEGORIES = {
    'Programming Languages': [
        'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust',
        'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala', 'Perl', 'Haskell', 'Lua', 'Shell', 'SQL', 'ABAP'
    ],
    'Web Technologies': [
        'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Svelte', 'Node.js', 'Express.js', 'Django',
        'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'jQuery', 'Bootstrap', 'Tailwind',
        'WebSocket', 'GraphQL', 'REST API', 'SOAP'
    ],
    'Databases': [
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server',
        'DynamoDB', 'Cassandra', 'Neo4j', 'Firebase', 'MariaDB', 'SQLite'
    ],
    'Cloud & DevOps': [
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
        'Terraform', 'Ansible', 'Chef', 'Puppet', 'CircleCI', 'Travis CI', 'ECS', 'EKS', 'Lambda',
        'S3', 'EC2', 'RDS', 'CloudFront', 'Route53', 'IAM'
    ],
    'AI & Data Science': [
        'Machine Learning', 'Deep Learning', 'AI', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
        'Pandas', 'NumPy', 'SciPy', 'Computer Vision', 'NLP', 'Data Mining', 'Big Data', 'Hadoop',
        'Spark', 'Power BI', 'Tableau'
    ],
    'Mobile Development': [
        'iOS', 'Android', 'React Native', 'Flutter', 'Xamarin', 'Swift', 'Kotlin', 'Objective-C',
        'Mobile UI', 'App Development', 'PWA'
    ],
    'Software Development': [
        'OOP', 'Design Patterns', 'Microservices', 'SOA', 'TDD', 'BDD', 'CI/CD', 'Unit Testing',
        'Integration Testing', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence'
    ],
    'Security': [
        'Cybersecurity', 'Encryption', 'OAuth', 'JWT', 'SAML', 'SSO', 'Penetration Testing',
        'Security Auditing', 'Firewall', 'VPN', 'SSL/TLS'
    ]
}

# Flatten skills for easy lookup
ALL_SKILLS = {skill: category 
              for category, skills in SKILL_CATEGORIES.items() 
              for skill in skills}

def extract_skills(summary):
    # Create a pattern that matches whole words only
    pattern = r'\b(?:' + '|'.join(map(re.escape, ALL_SKILLS.keys())) + r')\b'
    
    # Find all matches in the summary (case-insensitive)
    found_skills = list(set(re.findall(pattern, summary, re.IGNORECASE)))
    
    # Group skills by category
    categorized_skills = defaultdict(list)
    for skill in found_skills:
        category = ALL_SKILLS[skill]
        categorized_skills[category].append(skill)
    
    # Convert defaultdict to regular dict and sort skills within categories
    return {
        category: sorted(skills)
        for category, skills in categorized_skills.items()
    }

def fetch_jobs():
    headers = {
        'x-api-key': '1YAt0R9wBg4WfsF9VB2778F5CHLAPMVW3WAZcKd8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
    
    try:
        response = requests.get(url, params=params, headers=headers)
        print(f"API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            for job in data.get('data', []):
                # Extract skills from job summary
                skills = extract_skills(job.get('summary', ''))
                
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
                    'application_url': job.get('detailsPageUrl'),
                    'skills': skills
                }
                
                # Send POST request to Django backend
                django_api_url = 'http://127.0.0.1:8000/api/jobs/'
                headers = {'Content-Type': 'application/json'}
                
                try:
                    django_response = requests.post(
                        django_api_url,
                        json=job_data,
                        headers=headers
                    )
                    if django_response.status_code == 201:
                        print(f"Successfully saved job: {job_data['title']}")
                        for category, skills in skills.items():
                            print(f"{category}: {', '.join(skills)}")
                    else:
                        print(f"Failed to save job: {django_response.text}")
                except Exception as e:
                    print(f"Error saving job: {str(e)}")
                
        else:
            print(f"Failed to fetch jobs: {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    fetch_jobs()
