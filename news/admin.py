from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Author, Article, User, Comment

# Register your models here.
admin.site.register(Author)
admin.site.register(Article)
admin.site.register(User)
admin.site.register(Comment)