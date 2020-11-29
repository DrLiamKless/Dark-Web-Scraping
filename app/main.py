# pylint: disable=E0611
import os
from typing import List

from fastapi import FastAPI, HTTPException
from app.models import Article_Pydantic, ArticleIn_Pydantic, Articles
from pydantic import BaseModel

from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise

app = FastAPI(title="Tortoise ORM FastAPI example")


class Status(BaseModel):
    message: str


@app.get("/articles", response_model=List[Article_Pydantic])
async def get_articles():
    return await Article_Pydantic.from_queryset(Articles.all())


@app.post("/articles", response_model=Article_Pydantic)
async def create_article(article: ArticleIn_Pydantic):
    try:
        article_obj = await Articles.create(**article.dict(exclude_unset=True))
        return await Article_Pydantic.from_tortoise_orm(article_obj)
    except Exception as e:
        print(e)
        
@app.get(
    "/article/{article_id}", response_model=Article_Pydantic, responses={404: {"model": HTTPNotFoundError}}
)
async def get_article(article_id: int):
    return await Article_Pydantic.from_queryset_single(Articles.get(id=article_id))


@app.put(
    "/article/{article_id}", response_model=Article_Pydantic, responses={404: {"model": HTTPNotFoundError}}
)
async def update_article(article_id: int, article: ArticleIn_Pydantic):
    await Articles.filter(id=article_id).update(**article.dict(exclude_unset=True))
    return await Article_Pydantic.from_queryset_single(Articles.get(id=article_id))


@app.delete("/article/{article_id}", response_model=Status, responses={404: {"model": HTTPNotFoundError}})
async def delete_article(article_id: int):
    deleted_count = await Articles.filter(id=article_id).delete()
    if not deleted_count:
        raise HTTPException(status_code=404, detail=f"Article {article_id} not found")
    return Status(message=f"Deleted article {article_id}")


register_tortoise(
    app,
    db_url=f"mysql://{os.environ['MYSQL_USER']}:{os.environ['MYSQL_PASSWORD']}@mysql:3306/{os.environ['MYSQL_DATABASE']}",
    modules={"models": ["app.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)