import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const SearchFilter = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (value) => {
    setSearchQuery(value);
    onSearch(value); // Trigger search on each input change
  };

  return (
    <div>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => handleInputChange(e.target.value)}
        style={{width:750}}
      />
    </div>
  );
};

export default SearchFilter;
