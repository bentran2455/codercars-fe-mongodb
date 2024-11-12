import React from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

function Search({ handleSearch, search, setSearch }) {
  return (
    <form onSubmit={(e) => handleSearch(e, search)}>
      <TextField
        id="search-bar"
        className="text"
        value={search}
        onInput={(e) => {
          setSearch(e.target.value);
        }}
        label="Search for car"
        variant="outlined"
        placeholder="Enter here..."
        size="small"
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  );
}

export default Search;
