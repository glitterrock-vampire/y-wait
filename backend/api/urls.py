from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, QueueViewSet, predict_wait_time

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'queues', QueueViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('queues/<int:queue_id>/predict/', predict_wait_time, name='predict-wait-time'),

]
