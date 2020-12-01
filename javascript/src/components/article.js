import React from "react";
import "./article.css";

export default function Article({
  title,
  content,
  author,
  views,
  language,
  date,
}) {
  return (
    <div class="article">
      <h3>{title}</h3>
      <span>{author}</span>
      <section>{content}</section>
      <br></br>
      <span>views - {views}</span>
      <span>language - {language}</span>
      <br></br>
      <br></br>
      <span>{date}</span>
    </div>
  );
}
