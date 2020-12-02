import axios from "axios";
import React from "react";
import { useEffect } from "react";
import Articles from "./articles";

export default function Home({articles, setArticles}) {

    useEffect(() => {
        (async () => {
          const { data } = await axios.get(`http://localhost:8080/api/es/all`);
          setArticles(data);
        })();
      }, []);

  return (
    <div className="home">
        <Articles articles={articles}/>
    </div>
  );
}
