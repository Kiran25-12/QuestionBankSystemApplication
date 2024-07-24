import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const EditChoiceDialog = ({ open, onClose, choice, token, fetchChoices }) => {
    const [choiceText, setChoiceText] = useState(choice.choice_text);
    const [isCorrect, setIsCorrect] = useState(choice.is_correct);
    const [description, setDescription] = useState(choice.description);

    const handleUpdate = async () => {
        console.log("edit choice id==", choice.id)
        try {
            await axios.put(`http://127.0.0.1:8000/questionchoice/${choice.id}`, {
                choice_text: choiceText,
                is_correct: isCorrect,
                description: description,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchChoices(choice.question);
            toast.success("Update Choice Successfully!")
            onClose();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error("Error Updating choice...")
            console.error('Error updating choice:', error);
        }
    };

    return (
        <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Choice</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Choice Text"
                    fullWidth
                    value={choiceText}
                    onChange={(e) => setChoiceText(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isCorrect}
                        onChange={(e) => setIsCorrect(e.target.checked)}
                    />
                    Is Correct
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
        <ToastContainer/>
        </>
    );
};

export default EditChoiceDialog;
