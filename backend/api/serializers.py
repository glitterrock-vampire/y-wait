from rest_framework import serializers
from .models import User, Queue

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class QueueSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Queue
        fields = ['id', 'user', 'user_id', 'service_type', 'status', 'estimated_wait_time', 'timestamp']
