import pytest
from rest_framework.test import APIClient
import json

client = APIClient()

@pytest.mark.django_db
def test_UserRegistration(client):
    # ***************  Register new admin user **************
    new_admin_data = {
        "user_name": "admin4",
        "user_email": "admin4@gmail.com",
        "password": "admin4",
        "password2": "admin4",
        "user_type": "admin",
    }
    admin_register_response = client.post(
        "http://127.0.0.1:8000/register/", new_admin_data
    )
    assert admin_register_response.status_code == 201

    # ***************  Register new  user **************
    new_admin_data2 = {
        "user_name": "user123",
        "user_email": "user123@gmail.com",
        "password": "user123",
        "password2": "user123",
        "user_type": "viewer",
    }
    admin_register_response2 = client.post(
        "http://127.0.0.1:8000/register/", new_admin_data2
    )
    assert admin_register_response2.status_code == 201



    # *****************  login admin user **************
    admin_login = {"user_email": "admin4@gmail.com", "password": "admin4"}
    login_response = client.post("http://127.0.0.1:8000/login/", data=admin_login)
    # print("login data==", login_response.dtat3)
    # print("login contenet===", login_response.content)
    assert login_response.status_code == 200

# ********** getting access token ***************
    headers2 = {"Authorization": f"Bearer {login_response.data['token']['access']}"}

# ************ testing admin api to get all users list *******************************
#  success test case
    admin_get_userlist_response = client.get(
        "http://127.0.0.1:8000/userslistforadmin/", headers=headers2
    )
    print("all users list=======",admin_get_userlist_response.content)
    assert admin_get_userlist_response.status_code == 200

# ***************** testing admin api to get user by id *****************************
#  success test case
    admin_get_user_by_id = client.get('http://127.0.0.1:8000/editusers/2/', headers = headers2)
    assert admin_get_user_by_id.status_code == 200
  

#  ******************* testing admin api to put user by id *****************************
#  success test case
    put_data= {
         "user_name": "user345",
    "user_type": "viewer",
    "is_active": "true"
    }
    admin_put_user = client.put('http://127.0.0.1:8000/editusers/2/', headers=headers2, data=json.dumps(put_data), content_type='application/json')
    # print("admin put response==", admin_put_user.data)
    assert admin_put_user.status_code == 200


# ******************** login user(viewer) *****************
    viewer_login = {"user_email": "user123@gmail.com", "password": "user123"}
    login_response2 = client.post("http://127.0.0.1:8000/login/", data=viewer_login)
    print("login data==", login_response2.data)
    assert login_response2.status_code == 200
    headers3={"Authorization": f"Bearer {login_response2.data['token']['access']}"}

    # fail test cases for get all users list by admin 
    admin_get_userlist_response2 = client.get(
        "http://127.0.0.1:8000/userslistforadmin/", headers=headers3
    )
    print("fail all users list=======",admin_get_userlist_response2.content)
    assert admin_get_userlist_response2.status_code == 400

    # fail test cases for get user by id list by admin 
    admin_get_user_by_id2 = client.get('http://127.0.0.1:8000/editusers/2/', headers = headers3)
    assert admin_get_user_by_id2.status_code == 404

    # fail test cases for put user by id list by admin 
    put_data2= {
         "user_name": "user345",
    "user_type": "viewer",
    "is_active": "true"
    }
    admin_put_user2 = client.put('http://127.0.0.1:8000/editusers/2/', headers=headers3, data=json.dumps(put_data2), content_type='application/json')
    assert admin_put_user2.status_code == 400

    # fail test cases for delete user by id list by admin 
    admin_delete_user_response2 = client.delete('http://127.0.0.1:8000/editusers/2/', headers=headers3)
    print("delte respose===", admin_delete_user_response2.data)
    assert admin_delete_user_response2.status_code == 400


#  ************************** testing admin api to delete user by id *****************************
#  success test case
    admin_delete_user_response = client.delete('http://127.0.0.1:8000/editusers/2/', headers=headers2)
    print("delte respose===", admin_delete_user_response.data)
    assert admin_delete_user_response.status_code == 200
    