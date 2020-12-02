import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, FormControl } from "react-bootstrap";

export default function Search({searchInput, setSearchInput, setArticles, formfields}) {

  useEffect(() => {
    if(searchInput) {
      (async () => {
        const { data } = await axios.get(
          `http://localhost:8080/api/es/search/${searchInput}?label=${formfields.labels}`
          );
          setArticles(data);
        })();
    } else {
      (async () => {
        const { data } = await axios.get(
          `http://localhost:8080/api/es/all`
          );
          setArticles(data);
        })();
    }
  }, [searchInput]);

  return (
    <>
      <FormControl 
        type="text"
        placeholder="Search..." 
        className="mr-sm-2"
        onChange={(event) => {
        setSearchInput(event.target.value);
        }}>
      </FormControl>
    </>
  );
}
