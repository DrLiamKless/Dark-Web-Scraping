import "./App.css";
import axios from "axios";

import Article from "./components/article";
import React, { useState, useEffect } from "react";

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  console.log(searchInput);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:8080/api/all");
      setArticles(data);
      console.log(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://localhost:8080/api/${searchInput}`
      );
      setArticles(data);
      console.log(data);
    })();
  }, [searchInput]);

  const filterByMinutes = async () => {
    const { data } = await axios.get(`http://localhost:8080/api/minutes`);
    setArticles(data);
    console.log(data);
  };

  // const filterByMinutes = async () => {
  //   const { data } = await axios.get(`http://localhost:8080/api/hours`);
  //   setArticles(data);
  //   console.log(data);
  // };
  return (
    <div className="App">
      <div class="fixed">
        <h1>Found You</h1>
        <input
          id="searchBar"
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder="Search..."
        ></input>
        <button onClick={filterByMinutes}>published last 24 hours</button>
        {/* <button onClick={filterByHours}>published last 2 hours</button> */}
      </div>

      {articles &&
        articles.map((article) => {
          const { title, content, author, views, language, date } = article;
          return (
            <Article
              title={title}
              content={content}
              author={author}
              views={views}
              language={language}
              date={date}
            />
          );
        })}
    </div>
  );
}

export default App;
