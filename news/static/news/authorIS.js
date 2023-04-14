// Infinity scroll for author page

let counter = 8
const quantity = 8;
const spinnerContainer = document.querySelector("#spinnerContainer");
const authorName = document.querySelector("#authorName").innerText;

window.addEventListener("scroll", infinityScroll)

function infinityScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        window.removeEventListener("scroll", infinityScroll);
        load();   
    }
}

function load() {
    //add loading spinner while fetching data
    const spinnerElement = document.createElement('div');
    spinnerElement.className = "spinner-border text-muted";
    spinnerContainer.appendChild(spinnerElement);
    //fetch data
    fetch(`/api/articles?author=${authorName}&start=${counter}&end=${counter+quantity}`)
    .then(response => response.json())
    .then(data => {
            if (data.articles.length != 0) {
                data.articles.forEach(renderArticle);
                window.addEventListener("scroll", infinityScroll);
                }
        })
    .then( () => {
            const spinner = document.querySelector("#spinnerContainer .spinner-border");
            spinner.remove();
        });
    counter += quantity;
}

function renderArticle(article) {
    const newArticle = document.createElement('div');
    newArticle.className = "article clickableDiv d-flex align-items-center my-2 py-2 border-top";
    newArticle.addEventListener('click', () => linkToArticlePage(article.id));
    newArticle.innerHTML = `<img src="${article.picture_url}" alt="" width="250px" height="150px" class="searchImg me-3">
    <div>
        <p class="fw-bold text-danger mb-1">${article.category}</p>
        <h4>${article.title}</h4>
        <p class="text-secondary">${article.author}, ${article.date_written}</p>
    </div>`;
    articles.append(newArticle);
}