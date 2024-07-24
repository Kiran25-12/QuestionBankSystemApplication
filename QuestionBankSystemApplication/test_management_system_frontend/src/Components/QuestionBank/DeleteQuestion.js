import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const DeleteQuestionDialog = ({ open, onClose, questionId }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://127.0.0.1:8000/deletequestion/${questionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Question Deleted Successfully!")
            onClose();
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };
    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this question?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleDelete} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
        <ToastContainer/>
        </>
    );
};

export default DeleteQuestionDialog;
