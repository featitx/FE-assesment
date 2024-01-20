import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SearchFilter from "../SearchFilter";
import DeleteConfirmation from "../DeleteConfirmation";
import "./Accordion.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const genders = ["Male", "Female", "Transgender", "Rather not say", "Other"];

export default function AccordionUsage() {
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    celebId: null,
  });
  const [searchedData, setSearchedData] = useState([]);
  const [editedUserId, setEditedUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("../../../Data/celebrities.json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      setData(jsonData);
      setSearchedData(jsonData); // Initialize searchedData with all data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateAge = dob => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleDeleteClick = celebId => {
    setDeleteConfirmation({ open: true, celebId });
  };

  const handleDeleteConfirmation = confirmed => {
    if (confirmed) {
      const newData = data.filter(
        celebrity => celebrity.id !== deleteConfirmation.celebId
      );
      setData(newData);
      setSearchedData(newData);
    }
    setDeleteConfirmation({ open: false, celebId: null });
  };

  const handleSearch = query => {
    const filteredData = data.filter(
      celebrity =>
        celebrity.first.toLowerCase().includes(query.toLowerCase()) ||
        celebrity.last.toLowerCase().includes(query.toLowerCase()) ||
        String(calculateAge(celebrity.dob)).includes(query) ||
        celebrity.gender.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filteredData);
  };

  const handleEditClick = celebId => {
    const userToEdit = data.find(celeb => celeb.id === celebId);
    setEditedUser(userToEdit);
    setEditedUserId(celebId);
    setIsSaveDisabled(true); // Disable Save by default
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prevUser => ({
      ...prevUser,
      [field]: value,
    }));

    setIsSaveDisabled(false); // Enable Save when details are changed
  };

  const handleSaveEdit = () => {
    const updatedData = data.map(celebrity =>
      celebrity.id === editedUserId
        ? { ...celebrity, ...editedUser }
        : celebrity
    );

    setData(updatedData);
    setSearchedData(updatedData);
    setEditedUserId(null);
    setEditedUser(null);
  };

  const handleCancelEdit = () => {
    setEditedUserId(null);
    setEditedUser(null);
  };

  const renderDetails = celebrity => {
    if (editedUserId === celebrity.id) {
      // Render the editable details
      return (
        <div>
          <div className="flex-name">
            <TextField
              value={editedUser.first}
              onChange={e => handleInputChange("first", e.target.value)}
            />
            <TextField
              value={editedUser.last}
              onChange={e => handleInputChange("last", e.target.value)}
            />
          </div>

          <TextField
            type="Date"
            value={editedUser.dob}
            onChange={e => handleInputChange("dob", e.target.value)}
            fullWidth
            disabled={!editedUser.isAdult}
          />
          <TextField
            select
            defaultValue={celebrity.gender}
            value={editedUser.gender}
            placeholder="celebrity.gender"
            onChange={e => handleInputChange("gender", e.target.value)}
            fullWidth
          >
            {genders.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            value={editedUser.country}
            onChange={e => handleInputChange("country", e.target.value)}
            fullWidth
          />
          <TextField
            value={editedUser.description}
            onChange={e => handleInputChange("description", e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </div>
      );
    }

    // Render the static details
    return (
      <div>
        <p>
          {celebrity.first} {celebrity.last}
        </p>
        <p>Age: {calculateAge(celebrity.dob)}</p>
        <p>Gender: {celebrity.gender}</p>
        <p>Country: {celebrity.country}</p>
        <p>Description: {celebrity.description}</p>
      </div>
    );
  };

  return (
    <div className="wrapped-item">
      <SearchFilter onSearch={handleSearch} />
      <div className="wrapper-accordion">
        {searchedData.map(celebrity => (
          <Accordion
            key={celebrity.id}
            defaultExpanded={false}
            className="accordion-margin"
            type="shadow-lg"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <div className="accordion-top">
                <img
                  src={celebrity.picture}
                  alt={`Avatar of ${celebrity.first}`}
                />
                <p>
                  {celebrity.first} {celebrity.last}
                </p>
              </div>
            </AccordionSummary>

            <AccordionDetails>{renderDetails(celebrity)}</AccordionDetails>

            <AccordionActions>
              {editedUserId === celebrity.id ? (
                <>
                  <Button
                    disabled={isSaveDisabled}
                    onClick={handleSaveEdit}
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                  ></Button>
                  <Button
                    onClick={handleCancelEdit}
                    color="secondary"
                    startIcon={<CancelIcon />}
                  ></Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleDeleteClick(celebrity.id)}>
                    <DeleteIcon />
                  </Button>
                  <EditIcon
                    onClick={() => handleEditClick(celebrity.id)}
                  ></EditIcon>
                </>
              )}
            </AccordionActions>
          </Accordion>
        ))}

        <DeleteConfirmation
          open={deleteConfirmation.open}
          onClose={confirmed => handleDeleteConfirmation(confirmed)}
        />
      </div>
    </div>
  );
}
