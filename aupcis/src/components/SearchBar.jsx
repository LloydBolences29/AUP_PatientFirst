import React, { useState } from 'react';

const SearchBar = ({ 
  searchWords, 
  setFilteredSearchWord, 
  placeholder, 
  style = {}, 
  filterFunction 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = filterFunction 
      ? filterFunction(searchWords, term) 
      : searchWords.filter((searchWord) =>
          Object.values(searchWord).some(
            (value) => value && value.toString().toLowerCase().includes(term)
          )
        );

    setFilteredSearchWord(filtered);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearch}
      style={{
        padding: "10px",
        width: "100%",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginBottom: "10px",
        ...style,
      }}
    />
  );
};

export default SearchBar;

