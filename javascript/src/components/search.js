import React, { useState, useEffect } from "react";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  console.log(searchInput);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:8080/api/search");
      setArticles(data);
      console.log(data);
    })();
  }, [searchInput]);
  return (
    <div style={{ margin: "10px" }}>
      <input
        id="searchBar"
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        placeholder="Search..."
      ></input>
    </div>
  );
}
