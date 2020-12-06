import React from "react";
import Article from "./article";

export default function Articles({articles}) {
  return (
    <div className="Articles">
    {articles &&
      articles.map((article, i) => {
        const { title, content, author, views, language, date, labels } = article;
        return (
          <Article
            title={title}
            content={content}
            author={author}
            views={views}
            language={language}
            date={date.replace('T', ' / ')}
            labels={labels.split(' ')}
            key={i}
          />
          );
        })}  
    </div>
  );
}
