import pytest
from rest_framework import serializers
from rest_framework.test import APIClient
from auth_app.serializers import UserRegistrationSerializers

client = APIClient()

@pytest.mark.django_db
def test_UserRegistration(client, payload):
    print("Testing auth api's here")
    print(payload)

    # Register user 
    user_register_response = client.post("http://127.0.0.1:8000/register/", payload)
    data= user_register_response.data
    print("response=", data)
    assert user_register_response.status_code == 201

    #login user
    login_data = {"user_email":payload["user_email"], "password":payload["password"]}
    login_response = client.post("http://127.0.0.1:8000/login/", data = login_data)
    # dtat2= login_response.data
    # print("login data==", dtat2)
    assert login_response.status_code == 200
    # print("user loged in successfully")

    # if login fail
    fail_data = {"user_email":"xyz@gmail.com", "password":"xyz123"}
    fail_login_response = client.post("http://127.0.0.1:8000/login/", data =fail_data)
    assert fail_login_response.status_code == 400
    # print("Login fail")

    # getting access token 
    headers = {
        'Authorization': f"Bearer {login_response.data['token']['access']}"
    }

    # change password 
    change_password_data= {"password":"user123", "password2": "user123"}
    change_password_response = client.post("http://127.0.0.1:8000/changepassword/", headers=headers, data=change_password_data)
    assert change_password_response.status_code == 200

    change_password_data2= {"password":"user123", "password2": "user12"}
    fail_change_password_response = client.post("http://127.0.0.1:8000/changepassword/", headers=headers, data=change_password_data2)
    assert fail_change_password_response.status_code == 400

    # user profile 
    user_profile_response = client.get("http://127.0.0.1:8000/userprofile/", headers=headers)
    assert user_profile_response.status_code == 200

    # all user list
    # all_users_list_response = client.get("http://127.0.0.1:8000/a/",headers=headers)
    # assert all_users_list_response.status_code == 200


   

