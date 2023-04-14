def article_to_dict(article):
    article_dict = {
        "id": article.id,
        "title": article.title,
        "author": article.author.name,
        "category": article.category,
        "date_written": article.date_written,
        "picture_url": article.picture.url
    }
    return article_dict