from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from .models import *
from .utils import *
from .forms import *
import markdown2
from time import sleep

# Create your views here.
def index(request):
    latest_article = Article.objects.latest("id")
    trending_articles = Article.objects.all().order_by("-view_count")[:4]
    all_articles_id_desc = Article.objects.all().order_by("-id")[:12]
    logged_out = request.GET.get("logout", "")
    return render(request, "news/index.html", {
        "latest": latest_article,
        "trending": trending_articles,
        "all_articles": all_articles_id_desc,
        "logged_out": logged_out
    })

def category(request, category_name):
    articles = Article.objects.filter(category=category_name.capitalize()).order_by("-id")[:16]
    return render(request, "news/category.html", {
        "category_name": category_name,
        "articles": articles
    })

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            next_page = request.GET.get("next", "")
            if next_page:
                return HttpResponseRedirect(next_page)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "news/login.html", {
                "failed_auth": True
            })
    from_registration = request.GET.get("from", "") == "registration"
    return render(request, "news/login.html", {
        "from_registration": from_registration
    })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index") + "?logout=true")

def sign_up(request):
    if request.method == "POST":
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("login") + "?from=registration")
        else: 
            return render(request, "news/signup.html", {
                "form": form,
                "invalid_input": True
            })
    form = UserForm()
    return render(request, "news/signup.html", {
        "form": form
    })

def search(request):
    keyword = request.GET.get('q', '')
    articles = Article.objects.filter(author__name__contains=keyword) | Article.objects.filter(title__contains=keyword)
    articles_reverse_chronological = articles.order_by("-id")
    articles_reverse_chronological_first_page = articles_reverse_chronological[:10]
    number_of_results = articles_reverse_chronological.count
    return render(request, "news/filtered.html", {
        "keyword": keyword,
        "articles": articles_reverse_chronological_first_page,
        "numberOfResults": number_of_results
    })

def article(request, article_id):
    article_details = Article.objects.get(id=article_id)
    article_details.view_count += 1
    article_details.save(update_fields=["view_count"])
    article_comments = Comment.objects.filter(article=article_details).order_by("-time_commented")
    if request.user.is_authenticated:
        in_reading_list = True if article_details in request.user.reading_list.all() else False
    else:
        in_reading_list = "N/A"
    commented = request.GET.get("commented", "")
    return render(request, "news/article.html", {
        "article_details": article_details,
        "content_html": markdown2.markdown(article_details.content),
        "article_comments": article_comments,
        "in_reading_list": in_reading_list,
        "commented": commented
    })

def author(request, author_id):
    author_details = Author.objects.get(id=author_id)
    articles = Article.objects.filter(author__id=author_details.id).order_by("-id")[:8]
    return render(request, "news/author.html", {
        "author": author_details,
        "articles": articles
    })

def profile(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login") + "?next=" + reverse("profile"))
    return render(request, "news/profile.html", {
        "reading_list": request.user.reading_list.all()
    })

def articles_api(request):
    # get parameters
    start = request.GET.get("start")
    end = request.GET.get("end")
    title = request.GET.get("title") or ""
    category = request.GET.get("category") or ""
    author = request.GET.get("author") or ""
    order_by = request.GET.get("orderBy") or ""
    keyword = request.GET.get("keyword") or "" #the keyword parameter is used to search for articles where the title or author name contains the keyword prvoided
    # converting parameters to suitable data types and values
    start = int(start) if start else 0
    end = int(end) if end else 10
    match order_by:
        case "date written":
            order_by = "-date_written"
        case "alphabetical":
            order_by = "title"
        case "popularity":
            order_by = "-view_count"
        case _:
            order_by = "-id"

    if keyword:
        # get articles for keyword search
        all_relevant_articles = Article.objects.filter(author__name__contains=keyword) | Article.objects.filter(title__contains=keyword)
        number_of_results = all_relevant_articles.count()
        all_relevant_articles_reverse_chronological = all_relevant_articles.order_by("-id")[start:end]
        articles_list = list(map(article_to_dict, all_relevant_articles_reverse_chronological))
    else:
        # get articles if advanced search is used
        all_relevant_articles = Article.objects.filter(title__contains=title, category__contains=category, author__name__contains=author).order_by(order_by)
        number_of_results = all_relevant_articles.count()
        all_relevant_articles_for_page = all_relevant_articles[start:end]
        articles_list = list(map(article_to_dict, all_relevant_articles_for_page))
    #simulate latency in network. Return the response
    sleep(2)
    return JsonResponse({
        "numberOfResults": number_of_results,
        "articles": articles_list
    })

def submit_comment(request):
    if request.user.is_authenticated and request.method == "POST":
        comment_content = request.POST["comment"]
        article_id = request.POST["article_id"]
        article = Article.objects.get(id=article_id)
        comment = Comment(user=request.user, article=article, comment=comment_content)
        comment.save()
        return HttpResponseRedirect(reverse("article", kwargs={"article_id": article_id}) + "?commented=true")
    else:
        return HttpResponse("Invalid Request", status=400)

def modify_reading_list(request):
    if request.user.is_authenticated and request.method == "POST":
        article_id = request.POST["article_id"]
        article = Article.objects.get(id=article_id)
        in_reading_list = article in request.user.reading_list.all()
        if in_reading_list:
            request.user.reading_list.remove(article)
            response = "Removed From Reading List"
        else:
            request.user.reading_list.add(article)
            response = "Added To Reading List"
        request.user.save()
        return HttpResponse(response)
    else:
        return HttpResponse("Invalid Request", status=400)