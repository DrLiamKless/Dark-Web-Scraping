import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, FormControl } from "react-bootstrap";
import useDebounce from '../hooks/debounce'

export default function Search({searchInput, setSearchInput, setArticles, formfields}) {
  const debouncedSearchInput = useDebounce(searchInput, 500);

  useEffect(() => {
    if(debouncedSearchInput) {
      (async () => {
        const { data } = await axios.get(
          `http://localhost:8080/api/es/search/${searchInput} `
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
  }, [debouncedSearchInput]);

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
