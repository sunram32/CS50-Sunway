// Infinity scroll for index page

let counter = 12;
const quantity = 12;
const spinnerContainer = document.querySelector("#spinnerContainer");

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
    fetch(`/api/articles?start=${counter}&end=${counter+quantity}`)
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
    newArticle.className = "col-lg-3 col-sm-4 col-6 clickableDiv";
    newArticle.addEventListener('click', () => linkToArticlePage(article.id));
    newArticle.innerHTML = `<img src="${article.picture_url}" alt="" class="indexArticleImage d-block" height="180px" width="100%">
    <div class="lh-1 mt-2">
        <p class="text-danger fw-bold mb-1">${article.category}</p>
        <h5>${article.title}</h5>
        <p class="text-muted">By ${article.author}</p>
    </div>`;
    articleContainer.append(newArticle);
}