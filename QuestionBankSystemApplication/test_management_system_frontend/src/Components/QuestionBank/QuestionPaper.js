import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './QuestionPaper.css';
import { Paper, Container} from '@mui/material';

const QuestionComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const token = localStorage.getItem('token');
  const topicid = useParams()

  useEffect(() => {
    // Fetch questions from the API when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/questionchoicelist/${topicid.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("response --- ", response.data)
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionSelect = async (questionId) => {
    console.log("ques id---", questionId)
    setSelectedQuestion(questionId);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/questionchoice/${questionId}`);
      console.log('response of choices----', response.data)
      setChoices(response.data);
    } catch (error) {
      console.error('Error fetching choices:', error);
    }
  };
  console.log("questions --------", questions)

  return (
    <>
       <h1 style={{textAlign:'center'}}>Question<span style={{ color: "rgb(162, 89, 32)" }}> List</span></h1>
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', width: '100%' }}>

          <ol>
            {questions.map((question) => (
              <li key={question.id}>
                {question.question}
              </li>
            ))}
          </ol>
        </Paper>
      </Container>
    </>


  )
}

export default QuestionComponent;
