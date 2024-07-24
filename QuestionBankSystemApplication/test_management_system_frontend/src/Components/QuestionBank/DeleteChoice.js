import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const DeleteChoiceDialog = ({ open, onClose, choiceId, token, fetchChoices, questionId }) => {
    const handleDelete = async () => {
        console.log("choice id for delete choice--", choiceId)
        console.log("delete choice token=", token)
        try {
            await axios.delete(`http://127.0.0.1:8000/questionchoice/${choiceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("delete choice response--", choiceId)
            fetchChoices(questionId);
            onClose();
            toast.success("Choice Deleted Successfully!")
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            toast.error("Error Deleting choice..")
            console.error('Error deleting choice:', error);
        }
    };

    return (
        <>
        <ToastContainer/>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Choice</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this choice?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDelete} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default DeleteChoiceDialog;
