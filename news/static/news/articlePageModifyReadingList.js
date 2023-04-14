const readingListButton = document.querySelector(".modifyReadingList");
const readingListForm = document.querySelector("#readingListForm");

readingListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch("/api/modify_reading_list", {
        method: 'post',
        body: new FormData(e.target)
    })
    .then(res => res.text())
    .then(status => showToast(status))
    .then( () => modifyReadingListIcon() )
})

function showToast(status) {
    let toastStatus = document.querySelector('.successReadingList .toast-body');
    toastStatus.innerHTML = status;
    let toastSuccess = new bootstrap.Toast(document.querySelector('.successReadingList'));
    toastSuccess.show()
}

function modifyReadingListIcon() {
    let readingListIcon = readingListButton.firstElementChild;
    if (readingListIcon.classList.contains('text-danger')) {
        readingListIcon.classList.remove('text-danger');
        readingListIcon.classList.add('text-success');
        readingListIcon.setAttribute("title", "Add To Reading List")
    }
    else if (readingListIcon.classList.contains('text-success')) {
        readingListIcon.classList.remove('text-success');
        readingListIcon.classList.add('text-danger');
        readingListIcon.setAttribute("title", "Remove From Reading List")
    }
}