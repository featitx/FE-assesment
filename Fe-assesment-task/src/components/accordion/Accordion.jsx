import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import './Accordion.css';
// import data from '../../../public/Data/celebrities.json'

export default function AccordionUsage() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // Fetch data when the component mounts
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
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
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
            <Button>Delete</Button>
            <Button>Edit</Button>
          </AccordionActions>
        </Accordion>
      ))}
    </div>
  );
}
