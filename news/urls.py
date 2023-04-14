from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),
    path("category/<str:category_name>", views.category, name="category"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("signup", views.sign_up, name="signup"),
    path("search", views.search, name="search"),
    path("article/<int:article_id>", views.article, name="article"),
    path("author/<int:author_id>", views.author, name="author"),
    path("profile", views.profile, name="profile"),
    path("api/articles", views.articles_api, name="articles_api"),
    path("api/submit_comment", views.submit_comment, name="submit_comment"),
    path("api/modify_reading_list", views.modify_reading_list, name="modify_reading_list")
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)