from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("user_email","user_name","user_type","created_at","updated_at")
    list_filter = ("user_type", "is_active")
    search_fields = ("user_email", "user_name")
   
