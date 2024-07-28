from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import Topic, QuestionBank,TestPaper
from rest_framework.response import Response
from rest_framework import serializers
from .serializers import (
    AddQuestionsSerializer,
    QuestionsChoiceSerializer,
  
    UpdateQuestionSerializer,
    TopicSerializer,
    AddQuestionSerializer,
    OwnerTopicListSerializer,
    TopicByIdSerializer,
    QuestionChoice,
    QuestionChoiceSerializer,
    UserAccessLevelSerializer,
    FileUploadSerializer,
    Question_choiceSerializer,
    TestPaperSerializer
)
from rest_framework.views import APIView
from rest_framework import status
from .models import User, UserTopic
from rest_framework.permissions import BasePermission, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.http import HttpResponse
from io import BytesIO
import pandas as pd
import csv
import urllib.parse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch




# ************************ getting all topics list **********************
class TopicList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        topics = Topic.objects.all().select_related("created_by", "updated_by")
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


# ************* getting topic by id **************************
class GetTopicById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            topic = Topic.objects.get(pk=pk)
        except Topic.DoesNotExist:
            return Response(
                {"msg": "Topic not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = TopicByIdSerializer(topic)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ********************* Adding topic ********************************
class AddTopic(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # topic = TopicSerializer(data=request.data)
        # user = TopicSerializer(data=request.user)
        print(request.data["name"])
        print(request.user.user_name)
        if Topic.objects.filter(**request.data).exists():
            # return Response({'msg':'already exists'})
            raise serializers.ValidationError("This Topic already exists")
        if request.data["name"] == "" or request.data["description"] == "":
            return Response(topic.errors, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(user_email=request.user.user_email)
        topic = Topic.objects.create(
            name=request.data["name"],
            description=request.data["description"],
            created_by=user,
            updated_by=user,
        )
        return Response(
            {"msg": "Topic Added Successfully!"}, status=status.HTTP_201_CREATED
        )


# ************************** Update Topic Data by id ******************888
class EditTopic(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        id = pk
        topic = Topic.objects.get(pk=id)
        user = User.objects.get(user_email=request.user.user_email)
        print("-----------", request.user.user_email)

        # serializer = TopicSerializer(topic,data=request.data)
        if Topic.objects.filter(id=id, created_by=user):
            if request.data["name"] != "" and request.data["description"] != "":
                # user = User.objects.get(user_email = request.user.user_email)
                # updated_by = request.user.user_email
                topic.name = request.data["name"]
                topic.description = request.data["description"]
                topic.save()
                # topic = Topic.objects.update(name = request.data['name'],description = request.data['description'],created_by = user  )
                return Response(
                    {"msg": "Topic Updated"}, status=status.HTTP_202_ACCEPTED
                )
            return Response(
                {"msg": "data not updated"}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            return Response(
                {"msg": "You are not owner for this Topic"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# **************** Delete topic by id ********************
class DeleteTopic(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        id = pk
        topic = Topic.objects.get(pk=id)
        user = User.objects.get(user_email=request.user.user_email)
        if Topic.objects.filter(id=id, created_by=user):
            topic.delete()
            print(Topic.objects.all())
            return Response({"msg": "Topic deleted"})
        else:
            return Response(
                {"msg": "You are not owner for this Topic"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ***********************Question Bank Model's views ******************************************************
# ******************** getting all questions list ***********************
class QuestionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        owned_topics = UserTopic.objects.filter(
            user=user, access_level="Owner"
        ).values_list("topic", flat=True)
        questions = QuestionBank.objects.filter(topic__in=owned_topics)
        serializer = AddQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ******************* get question by id **********************************
class QuestionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        try:
            question = QuestionBank.objects.get(pk=pk)
        except QuestionBank.DoesNotExist:
            return Response(
                {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the user has access to the topic of the question
        user = request.user
        owned_topics = UserTopic.objects.filter(
            user=user, access_level="Owner"
        ).values_list("topic", flat=True)
        if question.topic_id not in owned_topics:
            return Response(
                {"error": "You do not have permission to view this question"},
                status=status.HTTP_403_FORBIDDEN,)

        serializer = AddQuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ************************ Questions with choices ***********************
class QuestionsList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        id = pk
        user = request.user.id
        print(
            user,
            UserTopic.objects.filter(
                user=user, access_level__in=["Owner", "Editor", "Viewer"], topic=id
            ).exists(),
        )
        if UserTopic.objects.filter(
            user=user, access_level__in=["Owner", "Editor", "Viewer"], topic=id
        ).exists():
            question = QuestionBank.objects.filter(topic=id).values("id")
            print(question)
            choice = QuestionChoice.objects.filter(question__in=question)
            print(choice)
            serializer = AddQuestionsSerializer(choice, many=True)
            dict_of_list = {}
            for d in serializer.data:
                if d["question"]["question"] not in dict_of_list.keys():
                    l = []
                if d["choice_text"] not in l:
                    l.append(d["choice_text"])
                    dict_of_list[d["question"]["question"]] = l
            return Response(dict_of_list, status=status.HTTP_200_OK)
        else:
            return Response(
                {"msg": "You dont have the required access!!"},
                status=status.HTTP_400_BAD_REQUEST,
            )




#  ********************** add Question to topic *************************************
class AddQuestion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = AddQuestionSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            if QuestionBank.objects.filter(
                question=data["question"], topic_id=data["topic_id"]
            ).exists():
                return Response(
                    {"msg": "This Question already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = request.user
            topic = Topic.objects.get(id=pk)
            question_create = QuestionBank.objects.create(
                topic=topic,
                question=data["question"],
                types=data["types"],
                difficulty=data["difficulty"],
                estimated_time_to_solve=data["estimated_time_to_solve"],
                created_by=user,
            )
            return Response(
                {"msg": "Question Added Successfully!"}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ******************* update question ******************************************
class UpdateQuestion(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        question = QuestionBank.objects.get(pk=pk)
        serializer = UpdateQuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"msg": "Question Updated Successfully!"}, status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ********************* delete question ********************************************
class DeleteQuestion(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        question = QuestionBank.objects.get(pk=pk)
        question.delete()
        return Response(
            {"msg": "Question Deleted Successfully!"}, status=status.HTTP_204_NO_CONTENT
        )


# *************** getting choices by id , update choice and delete choice *******************************
class QuestionChoices(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        choices = QuestionChoice.objects.filter(question=pk)
        serializer = QuestionChoiceSerializer(choices, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        choice = get_object_or_404(QuestionChoice, pk=pk)
        serializer = QuestionChoiceSerializer(choice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        choice = get_object_or_404(QuestionChoice, pk=pk)
        choice.delete()
        return Response(
            {"msg": "chioce deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )


# ************* add choices in to question ***************************
class AddQuestionChoices(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if (
            request.data["choice_text"] != ""
            and request.data["is_correct"] != ""
            and request.data["description"] != ""
        ):
            user = User.objects.get(user_email=request.user.user_email)
            question = QuestionBank.objects.get(id=pk)
            question_choices = QuestionChoice.objects.create(
                question=question,
                choice_text=request.data["choice_text"],
                is_correct=request.data["is_correct"],
                description=request.data["description"],
                created_by=user,
                updated_by=user,
            )
            return Response(
                {"msg": "Question Choice Added Successfully!"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(question_choices.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionChoiceList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        id = pk
        user = request.user.id
        print(
            user,
            UserTopic.objects.filter(
                user=user, access_level__in=["Owner", "Editor", "Viewer"], topic=id
            ).exists(),
        )
        print(request.user.user_type)
        if (
            UserTopic.objects.filter(
                user=user, access_level__in=["Owner", "Editor", "Viewer"], topic=id
            ).exists()
            or request.user.user_type == "admin"
        ):
            question = QuestionBank.objects.filter(topic=id)
            serializer = AddQuestionSerializer(question, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"msg": "You dont have the required access!!"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# *****************Owner provide access(editor, owner, viewer) to the user ************
class ProvideAccess(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if UserTopic.objects.filter(
            user=request.user.id,
            access_level="Owner",
            topic=Topic.objects.get(id=request.data["topic"]),
        ):
            user = User.objects.get(id=pk)
            topic = Topic.objects.get(id=request.data["topic"])
            if UserTopic.objects.filter(
                user=pk,
                topic=request.data["topic"],
                access_level=request.data["access_level"],
            ):
                return Response({"msg": "Already given that access!!"})
            # print(request.data['topic'])
            user_topic = UserTopic.objects.create(
                user=user, topic=topic, access_level=request.data["access_level"]
            )
            msg = f"{user.user_name},Has been Provided Access For {topic} : Topic !!"
            return Response({"msg": msg}, status=status.HTTP_201_CREATED)
        else:
            return Response({"msg": "You are not the owner for this topic!"})


# **************** getting user-topic table (user email, topic name , access level )**********************************
class OwnerTopicList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        topics = UserTopic.objects.all().select_related("user", "topic")
        serializer = OwnerTopicListSerializer(topics, many=True)
        return Response(serializer.data)


# *********** getting User and Access-leveles (user email, access level) ***********************************
class UserAccessLevel(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        access_levels = UserTopic.objects.filter(user=user).select_related("user")
        serializer = UserAccessLevelSerializer(access_levels, many=True)
        return Response(serializer.data)


# ******************** upload excel file ****************************************************************
class QuestionUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            try:
                df = pd.read_excel(file)
                
                user = request.user
                for _, row in df.iterrows():
                    topic, _ = Topic.objects.get_or_create(name=row['topic'])
                    print(row,'====')
                   
                    que = QuestionBank.objects.create(
                        topic=topic,
                        question=row['ques'],
                        types=row['types'],
                        difficulty=row['difficulty'],
                        estimated_time_to_solve=row['estimated_time_to_solve'],
                        created_by=user,
                        updated_by= user
                    )
                    
                    for i in range(1, 5):
                        QuestionChoice.objects.create(
                            question=que,
                            choice_text=row[f'choice_text_{i}'],
                            is_correct=row[f'is_correct_{i}'],
                            description=row.get(f'description_{i}', ''),
                            created_by=user
                        )
                return Response({"status": "success"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
 #******************************Export Question ********************************   

class ExportQuestionsExcel(APIView):
    
     def get(self, request, pk):
        id = pk
        # Retrieve questions from the database
        questions = QuestionBank.objects.filter(topic=id)
        topic_name = Topic.objects.get(pk=id)
        # Create lists to store the data
        question_numbers = []
        question_texts = []
        choices_dict = {}
        correct_choices = []

        # Iterate through the questions queryset
        max_choices = 0  # Keep track of the maximum number of choices
        for index, question in enumerate(questions, start=1):
            # Get the choices for the current question
            choices = question.questionchoice_set.all()
        

            # Get the correct choice for the current question
            correct_choice = next((choice.choice_text for choice in choices if choice.is_correct), None)

            # Update the maximum number of choices if needed
            max_choices = max(max_choices, len(choices))

            # Append the question data to the lists
            question_numbers.append(index)
            question_texts.append(question.question)
            choices_dict[index] = [f" {choice.choice_text}" for i, choice in enumerate(choices)]
            correct_choices.append(correct_choice)

        # Create a DataFrame from the lists
        df_data = {
            'SNO.': question_numbers,
            'Question': question_texts,     
        }
        # Add choices to the DataFrame, padding with None if needed
        for i in range(1, max_choices + 1):
            df_data[f'Choice {i}'] = [choices_dict.get(q_num, [None]*max_choices)[i-1] for q_num in question_numbers]

        df_data['Correct Choice']=correct_choices
        df = pd.DataFrame(df_data)

        # Write the DataFrame to an Excel file
        file_path = f"{topic_name.name}.xlsx"
        df.to_excel(file_path, index=False)

        # Open the Excel file and serve it as a direct download
        with open(file_path, 'rb') as excel_file:
            response = HttpResponse(excel_file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename={file_path}'

        return response
    
# ************** download dumpy question file ********************

class DownloadExcelView(APIView):
    
    def get(self, request):
        # Sample data (replace this with your actual data retrieval logic)
        data = [
            {'topic': '' ,'ques': '', 'types': '', 'difficulty':'', 'estimated_time_to_solve':'','choice_text_1':'', 'choice_text_2':'', 'choice_text_3':'', 'choice_text_4':'', 'description_1':'','description_2':'', 'description_3':'','description_4':'','is_correct_1':'','is_correct_2':'', 'is_correct_3':'', 'is_correct_4':''},
        ]
        
        # Convert data to DataFrame
        df = pd.DataFrame(data)
        # Create a BytesIO object to store the Excel file
        excel_file = pd.ExcelWriter('questions.xlsx', engine='xlsxwriter')
        df.to_excel(excel_file, index=False)
        excel_file.save()
        # Create response
        with open('questions.xlsx', 'rb') as excel:
            response = HttpResponse(excel.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=questions.xlsx'
            return response




        
# *********** selected question in testpaper model *************************


class TestPaperView(APIView):
    def post(self, request):
        test_name = request.data.get('test_name')
        time_to_solve = request.data.get('time_to_solve')
        question_ids = request.data.get('questions', [])
        topic_id = request.data.get('topic_id')

        # Ensure all required fields are present
        if not test_name or not time_to_solve or not topic_id:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the topic and questions
        topic = get_object_or_404(Topic, pk=topic_id)
        questions = QuestionBank.objects.filter(id__in=question_ids)

        # Ensure there are questions selected
        if not questions.exists():
            return Response({'error': 'No valid questions selected'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the test paper
        test_paper = TestPaper.objects.create(
            test_name=test_name,
            time_to_solve=time_to_solve,
            topic=topic,  # Set the topic correctly
            created_by=request.user  # Assuming the user is authenticated
        )
        
        # Set the questions for the test paper
        test_paper.qid.set(questions)
        test_paper.save()

        return Response({'msg': 'Test paper created successfully'}, status=status.HTTP_201_CREATED)
   
   
   
   # get all one test paper by test_id
    def get(self, request, pk):  
        id = pk
        question = TestPaper.objects.filter(id=id)
        serializer = TestPaperSerializer(question, many=True)
        print(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
  # delete Test Paper by test_id    
    def delete(self,request,pk):
        id = pk
        test = TestPaper.objects.get(id=id)
        test.delete()
        return Response({'msg':'Test Paper deleted'})
        
    
    
# Show all test Paper Api
class ShowAllTestPaper(APIView):
    def get(self,request,pk):
        topic = get_object_or_404(Topic, pk=pk)
        test = TestPaper.objects.filter(topic = topic)
        serializers = TestPaperSerializer(test,many=True)
        return Response(serializers.data,status=status.HTTP_202_ACCEPTED)
    
        
class TestPaperDownloadView(APIView):
    def get(self, request, pk, *args, **kwargs):
        format = "pdf"
        try:
            test_paper = TestPaper.objects.get(id=pk)
        except TestPaper.DoesNotExist:
            return Response({"error": "TestPaper not found"}, status=status.HTTP_404_NOT_FOUND)
    
        topic_name = test_paper.topic.name
        test_name = test_paper.test_name
        filename = f"{urllib.parse.quote(topic_name)}_{urllib.parse.quote(test_name)}"
        
        if format == 'csv':
            response = self.generate_csv(test_paper)
            response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        elif format == 'pdf':
            response = self.generate_pdf(test_paper)
            response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
        else:
            return Response({"error": "Invalid format"}, status=status.HTTP_400_BAD_REQUEST)
        
        return response
    
    def generate_csv(self, test_paper):
        response = HttpResponse(content_type='text/csv')
        writer = csv.writer(response)
        
        # Write header row
        writer.writerow(['Question', 'Type', 'Difficulty', 'Estimated Time', 'Choices', 'Correct Answer'])
        
        for question in test_paper.qid.all():
            choices = question.questionchoice_set.all()  # Corrected here
            choice_texts = ', '.join([choice.choice_text for choice in choices])
            correct_answers = ', '.join([choice.choice_text for choice in choices if choice.is_correct])
            writer.writerow([
                question.question,
                question.types,
                question.difficulty,
                question.estimated_time_to_solve,
                choice_texts,
                correct_answers
            ])
        
        return response

    def generate_pdf(self, test_paper):
        response = HttpResponse(content_type='application/pdf')
        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        margin = inch
        page_width = width - 2 * margin
        y_position = height - margin

        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawString(margin, y_position, f"Subject Topic  {test_paper.topic.name}")
        y_position -= 20
        p.setFont("Helvetica", 12)
        p.drawString(margin, y_position, f"Test Paper: {test_paper.test_name}")
        y_position -= 20
        p.drawString(margin, y_position, "Time: 1 Hour")
        y_position -= 40

        # Instructions
        p.setFont("Helvetica-Bold", 12)
        p.drawString(margin, y_position, "Instructions for the Candidates:")
        y_position -= 20
        instructions = [
            "All questions are compulsory.",         
        ]
        for instruction in instructions:
            if y_position < margin + 20:  # Adjusted for space
                p.showPage()
                y_position = height - margin
            p.setFont("Helvetica", 10)
            p.drawString(margin, y_position, f"• {instruction}")
            y_position -= 20

        # Questions
        for question in test_paper.qid.all():
            if y_position < margin + 100:  # Ensure there's space for the question
                p.showPage()
                y_position = height - margin
            
            # Draw question
            p.setFont("Helvetica-Bold", 12)
            question_text = f"Q: {question.question}"
            question_text_wrapped = self.wrap_text(p, question_text, page_width)
            for line in question_text_wrapped:
                p.drawString(margin, y_position, line)
                y_position -= 20

            # Draw type, difficulty, and estimated time
            p.setFont("Helvetica", 12)
            p.drawString(margin, y_position, f"Type: {question.types}")
            y_position -= 20
            p.drawString(margin, y_position, f"Difficulty: {question.difficulty}")
            y_position -= 20
            p.drawString(margin, y_position, f"Estimated Time: {question.estimated_time_to_solve}")
            y_position -= 20

            # Draw choices with checkboxes
            choices = question.questionchoice_set.all()
            p.setFont("Helvetica", 12)
            for i, choice in enumerate(choices):
                choice_text = f"{chr(65 + i)}. {choice.choice_text}"
                choice_text_wrapped = self.wrap_text(p, choice_text, page_width)
                for line in choice_text_wrapped:
                    p.drawString(margin, y_position, line)
                    y_position -= 20
                if y_position < margin:  # Ensure there's enough space
                    p.showPage()
                    y_position = height - margin

            # Draw correct answers
            correct_answers = ', '.join([choice.choice_text for choice in choices if choice.is_correct])
            correct_answers_wrapped = self.wrap_text(p, f"Correct Answer: {correct_answers}", page_width)
            for line in correct_answers_wrapped:
                p.drawString(margin, y_position, line)
                y_position -= 20

            y_position -= 20

        p.showPage()
        p.save()

        return response

    def wrap_text(self, p, text, max_width):
        """Wrap text for PDF drawing."""
        words = text.split()
        lines = []
        current_line = words[0]

        for word in words[1:]:
            if p.stringWidth(current_line + ' ' + word) < max_width:
                current_line += ' ' + word
            else:
                lines.append(current_line)
                current_line = word

        lines.append(current_line)
        return lines