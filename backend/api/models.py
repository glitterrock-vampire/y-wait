from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Queue(models.Model):
    SERVICE_CHOICES = [
        ('Bank', 'Bank'),
        ('Restaurant', 'Restaurant'),
        ('Healthcare', 'Healthcare'),
        ('School', 'School'),
    ]

    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    status = models.CharField(max_length=20, default='waiting')
    estimated_wait_time = models.IntegerField(default=0)
    alternative_suggestion = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.service_type}"
