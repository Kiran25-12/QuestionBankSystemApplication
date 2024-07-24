import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuestionList = () => {
    const { topic_id } = useParams();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/questionchoicelist/${topic_id}/`);
                setQuestions(response.data);
            } catch (error) {
                console.error("There was an error fetching the questions!", error);
            }
        };

        fetchQuestions();
    }, [topic_id]);

    return (
        <div>
            <h1>Questions for Topic {topic_id}</h1>
            <ul>
                {questions.map(question => (
                    <li key={question.id}>
                        <p>{question.question}</p>
                        <ul>
                            {question.choices.map(choice => (
                                <li key={choice.id}>{choice.choice_text}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionList;
