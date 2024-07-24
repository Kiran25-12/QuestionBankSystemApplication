import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const DeleteTestDialog = ({ open, onClose, testid }) => {
 

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://127.0.0.1:8000/testpaper/${testid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Test Paper Deleted Successfully!")
            onClose();
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error deleting testpaper:", error);
        }
    };
    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Test Paper</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this test paper?</p>
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

export default DeleteTestDialog;
