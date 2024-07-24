import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AddChoiceDialog = ({ open, onClose, questionId }) => {
    const [choiceText, setChoiceText] = useState('');
    const [description, setDescription] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            await axios.post(
                `http://127.0.0.1:8000/addquestionchoice/${questionId}`,
                {
                    choice_text: choiceText,
                    description: description,
                    is_correct: isCorrect,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // alert("Question choice added successfully!");
            toast.success("choice added successfully!")

            setChoiceText('');
            setDescription('');
            setIsCorrect(false);
            onClose();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error("Error adding question choice:", error);
        }
    };

    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Choice</DialogTitle>
            <DialogContent>
                <form id='form' className="flex flex-col" onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Choice Text"
                        type="text"
                        fullWidth
                        value={choiceText}
                        onChange={(e) => setChoiceText(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} />}
                        label="Is Correct"
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="primary">Cancel</Button>
                        <Button type="submit" color="primary">Add Choice</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
        <ToastContainer/>
        </>
    );
};

export default AddChoiceDialog;
