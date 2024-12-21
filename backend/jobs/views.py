from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer
from django.db.models import Q
from django.utils import timezone

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-posted_date')
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employment_type', 'is_remote', 'company_name']
    search_fields = ['title', 'company_name', 'summary']
    ordering_fields = ['posted_date', 'title', 'company_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('q', None)
        
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(company_name__icontains=search_query) |
                Q(summary__icontains=search_query)
            )
        
        return queryset

    def create(self, request, *args, **kwargs):
        # Handle both single and bulk creation
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            # Add job_id and ensure posted_date is set
            data = request.data.copy()
            data['job_id'] = f"JOB_{timezone.now().strftime('%Y%m%d%H%M%S')}"
            if 'posted_date' not in data:
                data['posted_date'] = timezone.now().isoformat()
            
            serializer = self.get_serializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )