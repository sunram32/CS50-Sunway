const readingListForm = document.querySelectorAll('.readingListForm');
readingListForm.forEach( (form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        //disable the button immediately to avoid multiple requests being sent to the API when the button is clicked multiple times. This is to
        //prevent the article from being added back to the reading list again
        form.querySelector('[type=submit]').disabled = true;
        fetch("/api/modify_reading_list", {
            method: 'post',
            body: new FormData(e.target)
        })
        .then( () => removeArticleFromReadingList(form.parentElement) )
    })
})

function removeArticleFromReadingList(articleContainer) {
    articleContainer.style.animationPlayState = 'running'
    articleContainer.addEventListener('animationend', () => {
        articleContainer.remove();
    })
}