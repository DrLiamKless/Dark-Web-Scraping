import React from "react";
import "./article.css";
import { Badge } from "react-bootstrap";

export default function Article({
  title,
  content,
  author,
  views,
  language,
  date,
  labels
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
      {labels && labels.map(label => {
        label = label.split('-');
        label = {name: label[0], strong:label[1]}
        return(
          <Badge 
            pill
            variant={label.strong > 2 ? 'danger' : 'warning'}
            style={{margin:'2px'}}>
            {label.name}
          </Badge>
        )
      })}
    </div>
  );
}
