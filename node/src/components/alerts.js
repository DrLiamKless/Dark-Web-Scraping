import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Articles from "./articles";
require('dotenv').config()

export default function Alerts({articles, setArticles}) {

  const [keywords, setKeywords] = useState()

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`http://localhost:8080/api/mongo/keywords`);
      setKeywords(data);
    })();
  }, []);

  return (
      <h1>Alerts Manager</h1>
  );
}
