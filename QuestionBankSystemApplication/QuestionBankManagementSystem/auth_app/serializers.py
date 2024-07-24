from rest_framework import serializers
from .models import User


class UserRegistrationSerializers(serializers.ModelSerializer):
   password2 = serializers.CharField(style={'input_type':'password'})
   class Meta:
       model = User
       fields = ['user_email','user_name','user_type','password','password2']
       
   def validate(self, attrs):
       pasword = attrs.get('password')
       pasword2 = attrs.get('password2')
       if pasword != pasword2:
           raise serializers.ValidationError('Password and ConfirmPassword does not match')
       return attrs  
   
   def create(self, validated_data):
       return User.objects.create_user(**validated_data)
   
   
class UserLoginSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(max_length = 200)
    class Meta:
        model = User
        fields = ['user_email','password']    
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_email','user_name','user_type',"is_active","created_at","updated_at"]  
        
class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=200,style={'input_type':'password'})
    password2 = serializers.CharField(max_length=200,style={'input_type':'password'})
    class Meta:
        fields = ['password','password2']
        
    def  validate(self, attrs):
        user = self.context.get('user')
        password = attrs.get('password')
        password2 = attrs.get('password2')
        
        if password != password2:
            raise serializers.ValidationError("Password & Confirm Password not match")
        user.set_password(password)
        user.save()
        return attrs  


# *********************** serializers for admin views ********************
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_email', 'user_name', 'user_type', 'is_active', 'is_staff', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_name', 'user_type', 'is_active']   
                  