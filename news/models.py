from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=64)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    picture = models.ImageField(upload_to="news/file/authors")

    def __str__(self):
        return f"{self.id}: {self.name}"

class Article(models.Model):
    category_choices = [
        ("Politics", "Politics"),
        ("World", "World"),
        ("Tech", "Tech"),
        ("Culture", "Culture"),
        ("Others", "Others")
    ]
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="author")
    title = models.CharField(max_length=256)
    category = models.CharField(max_length=20, choices=category_choices)
    picture = models.ImageField(upload_to="news/file/articles")
    date_written = models.DateField()
    view_count = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return f"{self.id}: {self.title} by {self.author}"

class User(AbstractUser):
    picture = models.ImageField(upload_to="news/file/users")
    reading_list = models.ManyToManyField(Article, blank=True, related_name="to_read")

    def __str__(self):
        return f"{self.id}: {self.username}"

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="commenter")
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="commented_article")
    comment = models.TextField()
    time_commented = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}: {self.user}'s comment on '{self.article}': {self.comment}"