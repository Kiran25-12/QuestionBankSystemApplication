import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
 
function AddTopic() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("add topic token==", token);
 
    if (!token) {
      console.error("No token found");
      return;
    }
 
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/addtopic/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("add topic-", response.data);
      toast.success("Topic Added Successfully!")
      navigate("/topic");
    } catch (err) {
      toast.error('Error Adding topic...')
      console.error(err);
    }
  };
 
  return (
    <> 
    <ToastContainer/>
      <section>
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651" }}>Add Topic</h2>
 
            <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
               
              />
 
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
             
              />
              <button className="btn">Add Topic</button>
              <button className="btn"><Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link></button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
 
export default AddTopic;