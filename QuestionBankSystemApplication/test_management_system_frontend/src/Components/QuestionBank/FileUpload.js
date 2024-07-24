import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

/* Upload api call here  */
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token"); // getting token from localstorage
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/questionupload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("upload file successfully");
      navigate("/topic");
    } catch (error) {
      setMessage("Error uploading file");
    }
  };
  const handleDownload = () => {
    axios({
      url: `http://127.0.0.1:8000/downloadexcelfile/`,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "questions.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({ fileUrl: url });
      })
      .catch((error) => {
        console.error("Error downloading Excel file: ", error);
      });
  };
  return (
    <>
      <section>
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651" }}>Upload File</h2>
            <br></br>
            <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} />
              <p style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={handleDownload}>
        Download Sample.xlsx file
      </p>

              <button className="btn" type="submit">
                Upload
              </button>
              <button className="btn">
                <Link
                  to="/topic"
                  style={{ color: "#e9ecef", textDecoration: "none" }}
                >
                  Cancel
                </Link>
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default FileUpload;
