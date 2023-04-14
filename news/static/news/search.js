let advancedSearch = false;
const spinnerContainer = document.querySelector("#spinnerContainer");
const articlesPerPage = 10;

//fields for advanced search
let title
let author
let category
let orderBy

//generate page numbers upon loading the DOM
document.addEventListener("DOMContentLoaded", () => {
    let numberOfArticles = +(document.querySelector("#resultCount").innerText);
    addPageNumber(numberOfArticles);
    let firstPageNumber = document.querySelector(".pagination").firstChild;
    firstPageNumber.classList.add("active")
})

//toggle to open or close advanced search menu
advancedSearchToggler.onclick = (e) => {
    let currentTogglerStatus = e.target.innerText[0] == '∨' ? "toggled" : "notToggled";
    if (currentTogglerStatus == "toggled") {
        e.target.innerText = "> Advanced Search";
        advancedSearchForm.classList.add("d-none");
    }
    else if (currentTogglerStatus == "notToggled") {
        e.target.innerText = "∨ Advanced Search";
        advancedSearchForm.classList.remove("d-none");
    }
}

//behaviour for submitting advanced search form
advancedSearchForm.onsubmit = (e) => {
    e.preventDefault();
    advancedSearch = true;
    // modify header and title
    let pageTitle = document.querySelector("title");
    let header = document.querySelector("#heading");
    pageTitle.innerText = "Advanced Search";
    header.innerText = "Advanced Search";
    //hide page numbers
    let pageNumbers = document.querySelector(".pagination");
    pageNumbers.classList.add("d-none");
    // clear content
    let articleContainer = document.querySelector("#articleContainer");
    articleContainer.innerHTML = "";
    //add loading spinner while fetching data
    const spinnerElement = document.createElement('div');
    spinnerElement.className = "spinner-border text-muted";
    spinnerContainer.appendChild(spinnerElement);
    //get values
    title = e.currentTarget.title.value;
    author = e.currentTarget.author.value;
    category = e.currentTarget.category.value == "Select category" ? "" : e.currentTarget.category.value;
    orderBy = e.currentTarget.orderBy.value == "Select criterion" ? "" : e.currentTarget.orderBy.value;
    fetch(`/api/articles?start=0&end=20&title=${title}&author=${author}&category=${category}&orderBy=${orderBy}&start=0&end=${articlesPerPage}`)
    .then(response => response.json())
    .then(data => {
        data.articles.forEach(renderArticle); 
        addPageNumber(+(data.numberOfResults));
        header.innerText = `Advanced Search (${data.numberOfResults} results)`;
        pageNumbers.classList.remove("d-none");
        pageNumbers.firstChild.classList.add("active")
    })
    .then( () => spinnerContainer.innerHTML = "");
    
}

//render an article on the page
function renderArticle(article) {
    const newArticle = document.createElement('div');
    let articleContainer = document.querySelector("#articleContainer");
    newArticle.className = "article clickableDiv d-flex align-items-center my-2 py-2 border-top";
    newArticle.addEventListener('click', () => linkToArticlePage(article.id));
    newArticle.innerHTML = `<img src="${article.picture_url}" alt="" width="250px" height="150px" class="searchImg me-3">
    <div>
        <p class="text-danger fw-bold mb-1">${article.category}</p>
        <h4>${article.title}</h4>
        <p class="text-secondary">${article.author}, ${article.date_written}</p>
        <button class="btn border-0 text-danger p-0">+ Read Later</button>
    </div>`;
    articleContainer.appendChild(newArticle);
}

//render a series of articles based on the page number
function renderArticlesByPage(e, pageNumber) {
    //hide page numbers and set new active page number
    let pageNumbers = document.querySelector(".pagination");
    pageNumbers.classList.add("d-none");
    pageNumbers.childNodes.forEach(pageNum => pageNum.classList.remove("active"));
    e.currentTarget.classList.add("active");
    // clear content
    let articleContainer = document.querySelector("#articleContainer");
    articleContainer.innerHTML = "";
    //add loading spinner while fetching data
    const spinnerElement = document.createElement('div');
    spinnerElement.className = "spinner-border text-muted";
    spinnerContainer.appendChild(spinnerElement);
    //start and end indices
    let start = (pageNumber - 1) * articlesPerPage;
    let end = start + articlesPerPage;
    if (!advancedSearch) {
        //get search keyword
        let url = new URL(location.href);
        let keyword = url.searchParams.get('q');
        fetch(`/api/articles?start=${start}&end=${end}&keyword=${keyword}`)
        .then(response => response.json())
        .then(data => {
            data.articles.forEach(renderArticle);
            pageNumbers.classList.remove("d-none");
        })
        .then( () => spinnerContainer.innerHTML = "");
    }
    else if (advancedSearch) {
        fetch(`/api/articles?start=0&end=20&title=${title}&author=${author}&category=${category}&orderBy=${orderBy}&start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            data.articles.forEach(renderArticle);
            pageNumbers.classList.remove("d-none");
        })
        .then( () => spinnerContainer.innerHTML = "");
    }
}

//add the page numbers to the page, and attach event listeners to them
function addPageNumber(numberOfArticles) {
    let pageNumbers = document.querySelector(".pagination");
    pageNumbers.innerHTML = "";
    let numberOfPages = Math.ceil(numberOfArticles/articlesPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
        let newPageNumberElement = document.createElement("li");
        newPageNumberElement.className = "page-item";
        newPageNumberElement.onclick = (e) => renderArticlesByPage(e, i);
        newPageNumberElement.innerHTML = `<a class="page-link" href="#"> ${i}</a>`;
        pageNumbers.appendChild(newPageNumberElement);
    }
}