import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import SearchFilter from '../SearchFilter';
import DeleteConfirmation from '../DeleteConfirmation';
import './Accordion.css';

export default function AccordionUsage() {
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, celebId: null });
  const [searchedData, setSearchedData] = useState([]);

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
      setSearchedData(jsonData); // Initialize searchedData with all data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleDeleteClick = (celebId) => {
    setDeleteConfirmation({ open: true, celebId });
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      // Create a new array with the filtered data, excluding the one to be deleted
      const newData = data.filter((celebrity) => celebrity.id !== deleteConfirmation.celebId);
      setData(newData);
      setSearchedData(newData); // Update searchedData after deletion
    }
    setDeleteConfirmation({ open: false, celebId: null });
  };


  // Filter data based on search query for name, age, and gender
const handleSearch = (query) => {
  const filteredData = data.filter(
    (celebrity) =>
      celebrity.first.toLowerCase().includes(query.toLowerCase()) ||
      celebrity.last.toLowerCase().includes(query.toLowerCase()) ||
      String(calculateAge(celebrity.dob)).includes(query) ||
      celebrity.gender.toLowerCase().includes(query.toLowerCase())
  );
  setSearchedData(filteredData);
};




  return (
    <div className='wrapped-item'>

      <SearchFilter onSearch={handleSearch} />
      <div className='wrapper-accordion'>
        {searchedData.map((celebrity) => (
          <Accordion key={celebrity.id} defaultExpanded={false} className='accordion-margin'>
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

        <DeleteConfirmation
          open={deleteConfirmation.open}
          onClose={(confirmed) => handleDeleteConfirmation(confirmed)}
        />
      </div>
    </div>
  );
}
