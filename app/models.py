from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class Articles(models.Model):
    """
    The Article model
    """

    id = fields.IntField(pk=True)
    title = fields.TextField(null=True, default="no title")
    content = fields.TextField(null=True, default="no content")
    author = fields.TextField(null=True, default="Anonymous")
    views = fields.TextField(null=True, default="unknown")
    language = fields.TextField(null=True, default="unknown")
    date = fields.TextField(null=True, default="unknown")
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    def title_overview(self) -> str:
        """
        Returns the best name
        """
        if self.title or self.author:
            return f"{self.title or ''} {self.author or ''}".strip()
        return self.title

    class PydanticMeta:
        computed = ["title_overview"]

Article_Pydantic = pydantic_model_creator(Articles, name="Article")
ArticleIn_Pydantic = pydantic_model_creator(Articles, name="ArticleIn", exclude_readonly=True)
