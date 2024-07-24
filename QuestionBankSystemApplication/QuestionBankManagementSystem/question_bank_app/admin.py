from django.contrib import admin
from .models import Topic,QuestionChoice,QuestionBank,UserTopic,TestPaper

# Register your models here.
class TopicAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'description', 'created_date', 'created_by', 'updated_date', 'updated_by')
 
class QuestionBankAdmin(admin.ModelAdmin):
    list_display = ('id','topic', 'question', 'types', 'difficulty', 'estimated_time_to_solve', 'created_date', 'created_by', 'updated_date', 'updated_by')
 
class QuestionChoiceAdmin(admin.ModelAdmin):
    list_display = ('id','question', 'choice_text', 'is_correct', 'description')
    
class UserTopicAdmin(admin.ModelAdmin):
    list_display = ('id','user','topic','access_level')    
    
class TestPaperAdmin(admin.ModelAdmin):
    list_display =('id','test_name','time_to_solve')
       
admin.site.register(Topic, TopicAdmin)
admin.site.register(QuestionBank, QuestionBankAdmin)
admin.site.register(QuestionChoice,QuestionChoiceAdmin)
admin.site.register(UserTopic,UserTopicAdmin)
admin.site.register(TestPaper,TestPaperAdmin)
