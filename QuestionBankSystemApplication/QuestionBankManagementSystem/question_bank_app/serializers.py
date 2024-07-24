from rest_framework import serializers
from .models import Topic, QuestionBank,UserTopic,QuestionChoice,TestPaper
from rest_framework import permissions
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_email']

class TopicSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    updated_by = UserSerializer()
    class Meta:
        model = Topic
        fields = '__all__'  

class TopicByIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'
        
class TopicNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields =['name','id']  

class QuestionBankIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = ['id']
 
# serializer for add question
class AddQuestionSerializer(serializers.Serializer):
    topic = TopicNameSerializer()
    # topic = QuestionChoiceSerializer()
    id = serializers.IntegerField()
    topic_id = serializers.IntegerField()
    question = serializers.CharField()
    types = serializers.ChoiceField(choices=[('single', 'Single Choice'), ('multiple', 'Multiple Choice')])
    difficulty = serializers.ChoiceField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advance', 'Advance')])
    estimated_time_to_solve = serializers.IntegerField()  
    class Meta:
        model = QuestionBank
        fields = ['id', 'topic', 'question', 'types', 'difficulty', 'estimated_time_to_solve']
        
# serializer for update question
class UpdateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = ['question', 'types', 'difficulty', 'estimated_time_to_solve']

# # serializer for delete question
class DeleteQuestionSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class QuestionBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = ['question','id','difficulty','estimated_time_to_solve','topic','types']

class AddQuestionsSerializer(serializers.ModelSerializer):
    question = QuestionBankSerializer()
    class Meta:
        model = QuestionChoice
        fields = ['question','choice_text']

class QuestionsChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model =   QuestionChoice
        fields = ['choice_text']

class OwnerTopicListSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    topic = TopicNameSerializer()
    class Meta:
        model =  UserTopic
        fields = '__all__'

class UserAccessLevelSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserTopic
        fields = ['access_level','user']

        
class QuestionChoiceSerializer(serializers.ModelSerializer):
    updated_by_email = serializers.SerializerMethodField()
    class Meta:
        model = QuestionChoice
        fields = ['id', 'choice_text', 'is_correct', 'description','created_by','updated_by_email']
    def get_updated_by_email(self, obj):
        return obj.updated_by.user_email if obj.updated_by else None

class Question_choiceSerializer(serializers.ModelSerializer):
    choices = QuestionChoiceSerializer(many=True, read_only=True, source='questionchoice_set')

    class Meta:
        model = QuestionBank
        fields = ['id', 'topic', 'question', 'types', 'difficulty', 'estimated_time_to_solve', 'choices']


# ********************* upload excel file ********************
class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

#************************download excel file ******************************    
class QuestionChoicesSerializerFile(serializers.ModelSerializer):
    class meta:
        model = QuestionBank
        fields = '__all__'  


class QuestionBankSerailzerFile(serializers.ModelSerializer):
    choices = QuestionChoicesSerializerFile(many=True)
    topic = TopicSerializer(many=True)
    class meta:
        model =QuestionChoice
        fields = ['question','choice_text','is_correct']
        
# create serializer for testpaper

class TestPaperSerializer(serializers.ModelSerializer):
    topic = TopicNameSerializer()
    qid = QuestionBankSerializer(many=True)
    class Meta:
        model = TestPaper
        fields = '__all__'
        
        
              