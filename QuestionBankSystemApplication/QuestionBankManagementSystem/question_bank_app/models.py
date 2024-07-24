import uuid

from django.db import models
from auth_app.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class NonDeleted(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted = False)


class UserTopic(models.Model):
    ACCESS_LEVEL_CHOICES = [
    ('Editor', 'Editor'),
    ('Viewer', 'Viewer'),
    ('Owner', 'Owner'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE)
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVEL_CHOICES)
    
    def __str__(self):
        return self.user.user_email

# create topic model     
class Topic(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_topics')
    updated_date = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='updated_topics')
    deleted = models.BooleanField(default=False)  #soft delete field
    everything = models.Manager()
    objects = NonDeleted()
    #Override delete method to perform soft delete.
    def delete(self, *args, **kwargs):
        self.deleted = True
        self.save()
    def __str__(self):
        return self.name
    
@receiver(post_save, sender=Topic)
def create_user_topic(sender, instance, created, **kwargs):
    if created:
    # Automatically create UserTopic instance with access level set to 'Owner'
        UserTopic.objects.create(user=instance.created_by, topic=instance, access_level='Owner')       
    
# create question bank model for storing questions
class QuestionBank(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    question = models.TextField()
    TYPE_CHOICES = [
        ('single', 'Single Choice'),
        ('multiple', 'Multiple Choice'),
        ('text', 'Text Answer'),
        ]
    types = models.CharField(max_length=10, choices=TYPE_CHOICES)
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advance', 'Advance'),
        ]
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    estimated_time_to_solve = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_questions')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,related_name='updated_questions')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
        
# create question choices model for choices        
class QuestionChoice(models.Model):
    question = models.ForeignKey(QuestionBank, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    description = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_questionchoices')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True, related_name='updated_questionchoices')
    
# create testpaper model for seleted question    
class TestPaper(models.Model):
    topic = models.ForeignKey(Topic,on_delete=models.CASCADE)
    test_name = models.CharField(max_length=10,unique=True,default='xyz')
    time_to_solve = models.IntegerField(default=0)
    qid = models.ManyToManyField(QuestionBank)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True, related_name='created_questiontest')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True, related_name='updated_questiontest')
    