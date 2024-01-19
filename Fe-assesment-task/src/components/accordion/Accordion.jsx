import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './Accordion.css';
import UpdateForm from '../update';

export default function AccordionUsage() {
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedCelebId, setSelectedCelebId] = useState(null);


  //Fetching Json Data

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('../../../Data/celebrities.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // calculate age function
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleDeleteClick = (celebId) => {
    setSelectedCelebId(celebId);
    setDeleteConfirmation(true);
  };

  
  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      // Create a new array with the filtered data, excluding the one to be deleted
      const newData = data.filter((celebrity) => celebrity.id !== selectedCelebId);
      setData(newData);
    }
    setDeleteConfirmation(false);
  };

  return (
    <div className='wrapper-accordion'>
      {data.map((celebrity) => (
        <Accordion key={celebrity.id} defaultExpanded className='accordion-margin'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <div className="accordion-top">
              <img src={celebrity.picture} alt={`Avatar of ${celebrity.first}`} />
              <p>{`${celebrity.first} ${celebrity.last}`}</p>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            <div>
              <p>Age: {calculateAge(celebrity.dob)}</p>
              <p>Gender: {celebrity.gender}</p>
              <p>Country: {celebrity.country}</p>
              <p>Description: {celebrity.description}</p>
            </div>
          </AccordionDetails>

          <AccordionActions>
            <Button onClick={() => handleDeleteClick(celebrity.id)}>Delete</Button>
            <Button>Edit</Button>
          </AccordionActions>
        </Accordion>
      ))}

      <Dialog
        open={deleteConfirmation}
        onClose={() => handleDeleteConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this celebrity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteConfirmation(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleDeleteConfirmation(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
