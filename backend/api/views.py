from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import User, Queue
from .serializers import UserSerializer, QueueSerializer
import random

# User CRUD API
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Queue CRUD API with advanced logic
class QueueViewSet(ModelViewSet):
    queryset = Queue.objects.select_related('user').all()
    serializer_class = QueueSerializer

    def perform_create(self, serializer):
        queue = serializer.save()
        queue.estimated_wait_time = self.estimate_wait_time(queue)
        queue.save()

    # Mock logic for estimating wait-time based on service type
    def estimate_wait_time(self, queue):
        base_times = {
            'Bank': random.randint(10, 20),
            'Restaurant': random.randint(5, 15),
            'Healthcare': random.randint(15, 30),
        }
        return base_times.get(queue.service_type, 10)

# Predictive Wait-Time API Endpoint
@api_view(['GET'])
def predict_wait_time(request, queue_id):
    queue = get_object_or_404(Queue, pk=queue_id)

    # Realistic mock logic (could integrate AI here later)
    historical_avg_wait = {
        'Bank': 15,
        'Restaurant': 10,
        'Healthcare': 25,
    }

    random_factor = random.randint(-3, 3)
    predicted_wait = historical_avg_wait.get(queue.service_type, 10) + random_factor

    queue.estimated_wait_time = predicted_wait
    queue.save()

    # Alternative coordination logic example
    alternative = suggest_alternative(queue.service_type, predicted_wait)

    return Response({
        "queue_id": queue.id,
        "service_type": queue.service_type,
        "estimated_wait_time": predicted_wait,
        "alternative_suggestion": alternative
    })

# Simple Alternative Coordination Logic
def suggest_alternative(service_type, wait_time):
    alternatives = {
        'Bank': "Consider online banking or virtual teller.",
        'Restaurant': "Consider ordering takeout or delivery.",
        'Healthcare': "Consider telehealth services or a nearby clinic.",
    }

    thresholds = {
        'Bank': 20,
        'Restaurant': 15,
        'Healthcare': 30,
    }

    if wait_time > thresholds.get(service_type, 15):
        return alternatives.get(service_type, "No alternatives available.")
    return "Wait time is acceptable."

