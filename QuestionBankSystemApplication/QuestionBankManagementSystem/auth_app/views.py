from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import status
from .models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import (
    UserRegistrationSerializers,
    UserLoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    UserSerializer,
    UserUpdateSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser


# generate token
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        # "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# Create your views here.
class UserRegistration(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"msg": "Registration Successfully!"}, status=status.HTTP_201_CREATED
        )


class UserLogin(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user_email = serializer.data.get("user_email")
            password = serializer.data.get("password")
            user = authenticate(user_email=user_email, password=password)
            if user is not None:
                token = get_tokens(user)
                user_id = user.id
                user_email= user.user_email
                user_type = user.user_type
                return Response(
                    {
                        "token": token,
                        "id": user_id,
                        "user_type": user_type,
                        "user_email":user_email,
                        "msg": "Login Successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"errors": {"non_field_errors": ["Email or Password is invalid"]}},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"user": request.user}
        )
        if serializer.is_valid(raise_exception=True):
            return Response({"msg": "Password Changed !"}, status=status.HTTP_200_OK)
        else:
            # If the serializer is not valid, return the validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class AllUserList(APIView):
    def get(self, request):
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        print(user)
        return Response(serializer.data)


#***********************  Admin Views  ******************************************************
class AdminUserList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            # user = User.objects.get(user_type = request.user.user_type)
            # print(user.user_type)
            if request.user.user_type == 'admin'  :
                users = User.objects.all()
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'msg':'You Dont have access to See All Users List'},status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)
        except User.MultipleObjectsReturned:
            return Response({'msg':'Only Admin can See All Users List'}, status=400)


class AdminUserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        id = pk
        try:
            user = get_object_or_404(User, pk=id)
            if request.user.user_type == 'admin':
                serializer = UserSerializer(user)
                return Response(serializer.data, status=200)
            else:
                return Response({'msg': 'Only Admin can access user details'}, status=404)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    def put(self, request, pk):
        # users = User.objects.get(user_type = request.user.user_type)
        try:
            if request.user.user_type == 'admin':
                user = get_object_or_404(User, pk=pk)
                serializer = UserUpdateSerializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({"msg": "User updated", "data": serializer.data},status=200)
                return Response(serializer.errors, status=400)
            else:
                return Response({'msg': 'Only Admin can have access'}, status=400)
        except User.MultipleObjectsReturned:
            return Response({'msg':'Only Admin can have access'}, status=400)


    def delete(self, request, pk):
        # users = User.objects.get(user_type = request.user.user_type)
        try:
            if request.user.user_type == 'admin':
                user = get_object_or_404(User, pk=pk)
                user.delete()
                return Response({'msg':'User deleted'}, status=200)
            else:
                return Response({'msg': 'Only Admin can have access'}, status=400)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)
        except User.MultipleObjectsReturned:
            return Response({'msg':'Only Admin can have access'}, status=400)
