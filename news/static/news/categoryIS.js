// Infinity scroll for category page

let counter = 16;
const quantity = 16;
const spinnerContainer = document.querySelector("#spinnerContainer");
const categoryName = document.querySelector("#categoryName").innerText;

window.addEventListener("scroll", infinityScroll)

function infinityScroll() {
    //the offset height is subtracted by 5 because the sum of the inner height and scroll Y is not equal to or greater than the offset height even if the user has scrolled to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
        window.removeEventListener("scroll", infinityScroll);
        load();   
    }
}

function load() {
    //add loading spinner while fetching data
    const spinnerElement = document.createElement('div');
    spinnerElement.className = "spinner-border text-muted";
    spinnerContainer.appendChild(spinnerElement);
    console.log('there')
    //fetch data
    fetch(`/api/articles?category=${categoryName}&start=${counter}&end=${counter+quantity}`)
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
    newArticle.innerHTML = `<img src="${article.picture_url}" alt="" class="indexArticleImage d-block" height="180px" width=100%">
    <div class="lh-1 mt-2">
        <h5>${article.title}</h5>
        <p class="text-muted">By ${article.author}</p>
        <button class="btn text-danger p-0 m-0 border-0">+ Read Later</button>
    </div>`;
    articles.append(newArticle);
}