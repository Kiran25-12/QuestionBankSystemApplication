import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function EditQuestion() {
    const id = useParams();
    const uid = id.id
    const [questionData, setQuestionData] = useState({
        question: "",
        types: "",
        difficulty: "",
        estimated_time_to_solve: "",
        topic_id: ""
    });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/question/${uid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuestionData(response.data);
               
            } catch (error) {
                console.error("Error fetching question:", error);
            }
        };
        fetchQuestion();
    }, [uid, token]);

    const handleChange = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/updatequestion/${uid}`, questionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Update Question Successfully!')
            navigate("/topic");
        } catch (error) {
            toast.error('Error Updating Question...')
            console.error("Error updating question:", error);
        }
    };

    return (
        <>
        <ToastContainer/>
            <section>
                <div className="register">
                    <div className="col-1">
                        <h2 style={{ color: "#565651" }}>Update Question</h2>
                        <form id='form' className="flex flex-col" onSubmit={handleSubmit}>

                            <label>Question:</label>
                            <input
                                type="text"
                                name="question"
                                value={questionData.question}
                                onChange={handleChange}
                            />

                            <label>Choice Type:</label>
                            <select name="types" value={questionData.types} onChange={handleChange} style={{ width: "24vw", marginBottom: "10px", border: '1px solid #bba70d', padding: "8px" }}>
                                <option value="single">Single Choice</option>
                                <option value="multiple">Multiple Choice</option>
                            </select>

                            <label>Difficulty Level:</label>
                            <select name="difficulty" value={questionData.difficulty} onChange={handleChange} style={{ width: "24vw", marginBottom: "10px", border: '1px solid #bba70d', padding: "8px" }}>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advance">Advance</option>
                            </select>

                            <label>Estimated Time to Solve:</label>
                            <input
                                type="number"
                                name="estimated_time_to_solve"
                                value={questionData.estimated_time_to_solve}
                                onChange={handleChange}
                            />

                            <label>Topic ID:</label>
                            <input
                                type="number"
                                name="topic_id"
                                value={questionData.topic_id}
                                onChange={handleChange}
                                readOnly
                            />

                            <button type="submit" className="btn">Update Question</button>
                            <button className="btn"><Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link></button>

                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default EditQuestion;
