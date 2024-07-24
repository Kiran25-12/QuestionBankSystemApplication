from django.urls import path
from .views import (
    
    AddTopic,
    DownloadExcelView,
    EditTopic,
    DeleteTopic,
    QuestionsList,
    QuestionDetail,
    AddQuestion,
 
    UpdateQuestion,
    DeleteQuestion,
    TopicList,
    QuestionList,
    OwnerTopicList,
    GetTopicById,
    QuestionChoices,
    AddQuestionChoices,
    QuestionChoiceList,
    UserAccessLevel,
    ProvideAccess,QuestionUploadView,
    ExportQuestionsExcel,
    TestPaperView,
    ShowAllTestPaper
    
)

urlpatterns = [
    path("topiclist", TopicList.as_view(), name="topiclist"),
    path("gettopic/<int:pk>/", GetTopicById.as_view(), name="gettopic"),
    path("addtopic/", AddTopic.as_view(), name="addtopic"),
    path("edittopic/<int:pk>", EditTopic.as_view(), name="edittopic"),
    path("deletetopic/<int:pk>", DeleteTopic.as_view(), name="deletetopic"),
    # **************Question CRUD API URL*****************************
    path("addquestion/<int:pk>", AddQuestion.as_view(), name="addquestion"),
    path("questionlist/", QuestionList.as_view(), name="questionlist"),
    path("question/<int:pk>/", QuestionDetail.as_view(), name="question-detail"),
    path("updatequestion/<int:pk>", UpdateQuestion.as_view(), name="update-question"),
    path("deletequestion/<int:pk>", DeleteQuestion.as_view(), name="delete-question"),
    path("ownerlist/", OwnerTopicList.as_view(), name="ownerlist"),
    # choice crud api url
    path("questionchoice/<int:pk>", QuestionChoices.as_view(), name="questionchoice"),
    path("addquestionchoice/<int:pk>", AddQuestionChoices.as_view(),name="addQuestionchoices", ),
    path( "questionchoicelist/<int:pk>", QuestionChoiceList.as_view(), name="questionchoiceslist", ),
    path("accesslevels/", UserAccessLevel.as_view()),
    path("accesslevel/<int:pk>", ProvideAccess.as_view(), name="accesslevel"),
    # question with choices
    path("questionslist/<int:pk>", QuestionsList.as_view(), name="questionlist"),
    # upload ecxel file
    path('questionupload/', QuestionUploadView.as_view()),
    # download excel file
    path('downloadquestion/<int:pk>', ExportQuestionsExcel.as_view()),
    # dowload excel dumpy file
    path('downloadexcelfile/',DownloadExcelView.as_view()),
    # question test paper
    path('testpaper/<int:pk>',TestPaperView.as_view()),
    path('createtest/',TestPaperView.as_view()),
    path('showallpaper/<int:pk>',ShowAllTestPaper.as_view())
    
]
