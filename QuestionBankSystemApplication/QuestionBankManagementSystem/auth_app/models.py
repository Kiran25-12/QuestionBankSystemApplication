from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager,AbstractBaseUser,PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(
        self, user_email, user_name, user_type, password=None, password2=None
    ):
        if not user_email:
            raise ValueError("User must have an email address")
 
        user = self.model(
            user_email=self.normalize_email(user_email),
            user_name=user_name,
            user_type=user_type,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, user_email, user_name, user_type, password=None):
        user = self.create_user(
            user_email, user_name=user_name, user_type=user_type, password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
   
class User(AbstractBaseUser, PermissionsMixin):
    user_email = models.EmailField(
        verbose_name="Email",
        max_length=200,
        unique=True,
    )
   
    user_name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_choice = (
        ('admin','admin'),
        ('user','user'),  
    )
    user_type = models.CharField(max_length=20, choices=user_choice)
    # user_access_level = (
    #     ('owner','owner'),
    #     ('viewer','viewer'),
    #     ('editor','editor')   
    # )
    # access_level = models.CharField(max_length=20, choices=user_access_level,default= ' ')
    # is_viewer = models.BooleanField(default=True)
    # is_editor = models.BooleanField(default=False)
    # is_owner = models.BooleanField(default=False)
 
    objects = UserManager()
 
    USERNAME_FIELD = "user_email"
    REQUIRED_FIELDS = ["user_name", "user_type"]
 
    def __str__(self):
        return f"'username:'{self.user_name}, 'user Email:'{self.user_email},'user type:' {self.user_type},'active status:'{self.is_active},'created at:'{self.created_at},'updated at:'{self.updated_at}\n"
