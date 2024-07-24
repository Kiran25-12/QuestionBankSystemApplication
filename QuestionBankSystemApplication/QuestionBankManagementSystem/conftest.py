import pytest


@pytest.fixture
def payload():
    print("Getting payload from fixture function")
    payload = {
        "user_email": "user1@gmail.com",
        "user_name": "user1",
        "user_type": "owner",
        "password": "user1",
        "password2": "user1",
    }
    return payload


# @pytest.fixture
# def admin_login_data():
#     admin_login_data = {"user_email": "admin3@gmail.com", "password": "admin3"}
#     return admin_login_data
