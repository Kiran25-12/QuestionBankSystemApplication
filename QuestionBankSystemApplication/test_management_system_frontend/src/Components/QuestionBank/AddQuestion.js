import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


function AddQuestion() {
    const [question, setQuestion] = useState('')
    const [types, setTypes] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [estimated_time_to_solve, setEstimated_time_to_solve] = useState('')
    const [topic, setTopic] = useState({ 'name': 'a' })

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };
    const handleTypesChange = (event) => {
        setTypes(event.target.value);
    };
    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };
    const handleestimated_time_to_solveChange = (event) => {
        setEstimated_time_to_solve(event.target.value);
    };
    const id = useParams()
    console.log('topic id to add que---', id.id)
    const topic_id = id.id
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        //add question api call here...
        try {
            const response = await axios.post(`http://127.0.0.1:8000/addquestion/${topic_id}`,
                {
                    id: 5,
                    topic_id: topic_id,
                    question,
                    types,
                    difficulty,
                    estimated_time_to_solve,
                    topic,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("response of add ques----", response.data)
            toast.success("Question added successfully.");
            navigate('/topic');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                toast.error(`Error: ${err.response.data.msg}`);
            } else {
                toast.error("Error Adding Question.");
            }
        }
    };
    return (
        <>
            <section>
                <div className="register">
                    <div className="col-1">
                        <h2 style={{ color: "#565651" }}>Add Question</h2>
                        <br></br>

                        <ToastContainer />
                        <form id="form" className="flex flex-col" onSubmit={handleSubmit}
                            style={{ maxWidth: "350px", margin: "0 auto" }}>
                            <input
                                type="text"
                                name="question"
                                value={question}
                                onChange={handleQuestionChange}
                                placeholder="Question"
                                required

                            />
                            <label>
                                Choice Type
                                <select
                                    name="types"
                                    value={types}
                                    onChange={handleTypesChange}
                                    required
                                    style={{ width: "27.4vw", marginBottom: "10px", border: '1px solid #bba70d', padding: "8px" }}
                                >
                                    <option value="">Select...</option>
                                    <option value="single">Single Choice</option>
                                    <option value="multiple">Multiple Choice</option>
                                    <option value="text">text Choice</option>
                                </select>
                            </label>
                            <label>
                                Difficulty Level
                                <select
                                    name="difficulty"
                                    value={difficulty}
                                    onChange={handleDifficultyChange}
                                    required
                                    style={{ width: "27.4vw", marginBottom: "10px", border: '1px solid #bba70d', padding: "8px" }}
                                >
                                    <option value="">Select...</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advance">Advance</option>
                                </select>
                            </label>

                            <input
                                type="text"
                                name="estimated_time_to_solve"
                                value={estimated_time_to_solve}
                                onChange={handleestimated_time_to_solveChange}
                                placeholder="Estimated Time To Solve"
                                required

                            />
                            <button className="btn" >Submit</button>
                            <button className="btn"><Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link></button>

                        </form>
                    </div>
                </div>


            </section>
        </>
    )
}
export default AddQuestion;