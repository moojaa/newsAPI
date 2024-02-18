const API_KEY = `cc67345053704887b33654702599fe26`;
let newsList = []
const menus = ["Business", "Entertainment", "General", "health", "Science", "Sports", "Technology"]
let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
let totalResult = 1
let page = 1
let pageSize = 10
const groupSize = 5

document.addEventListener("DOMContentLoaded", () => {
    const menusHTML = menus.map(menus => `<button onclick="Category('${menus.toLowerCase()}')" >${menus}</button>`).join('')
    document.getElementById("menu-list").innerHTML = menusHTML
    document.getElementById("menu-content").innerHTML = menusHTML

    const menuToggle = document.getElementById("menu-toggle")
    const menuSlide = document.getElementById("menu-slide")
    const menuClose = document.getElementById("menu-close")

    menuToggle.addEventListener("click", () => {
        menuSlide.style.left = "0"
    })
    menuClose.addEventListener("click", () => {
        menuSlide.style.left = "-300px"
    })

    const searchOnBtn = document.getElementById("search-on-btn")
    const searchOn = document.getElementById("search-on")

    searchOnBtn.addEventListener("click", () => {
        searchOn.style.display == "flex" ? searchOn.style.display = "none" : searchOn.style.display = "flex"
    })
})

const pagesizeRe = () =>{
    pageSize = document.getElementById("page-size-input").value
    getNews()
}

const getNews = async () => {
    try {
        url.searchParams.set("page",page)
        url.searchParams.set("pageSize",pageSize)
        const response = await fetch(url)
        const data = await response.json()
        if (response.status === 200) {
            if (data.articles.length ===0) {
                throw new Error("결과없음")
            }
            newsList = data.articles
            totalResult = data.totalResults
            render()
            pageNationRender()
        } else {
            throw new Error(data.message)
        }
    } catch (error) {
        errorRender(error.message)
    }

}

const getLatestNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
    getNews()
}

const Category = async (menus) => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${menus}&apiKey=${API_KEY}`)
    getNews()
}

const getNewsSearch = async () => {
    const keyword = document.getElementById("search-input").value
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
    getNews()

}
const render = () => {
    let newsHTML = ``;

    newsHTML = newsList.map(news => {
        let description = news.description ? news.description : "내용없음"
        if (description.length > 200) {
            description = description.substring(0, 200) + '...';
        }
        return `
    <div class="row news">
        <div class="col-lg-4">
            <img style="max-width: 100%; max-height: 250px;"
                src="${news.urlToImage ? news.urlToImage : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg"}"
                alt="">
        </div>
        <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${description}</p>
            <div>${news.source.name ? news.source.name : "no source"} ${moment(news.publishedAt, "YYYY-MM-DD").fromNow()}</div>
        </div>
    </div>
    `}).join('')

    document.getElementById("news-board").innerHTML = newsHTML

}

const errorRender = (errorMessage) => {
    const errorHTML = `
    <div class="alert alert-danger mt-1" role="alert">
    ${errorMessage}
    </div>`

    document.getElementById('news-board').innerHTML = errorHTML
}

const pageNationRender = () => {
    const totalPages = Math.ceil(totalResult/pageSize)
    const pageGroup = Math.ceil(page / groupSize)
    let lastPage = pageGroup * groupSize
        if(lastPage>totalPages){
        lastPage = totalPages
    }
    const firstPage = lastPage - (groupSize -1)<=0? 1: lastPage - (groupSize -1)
    let pageHTML = ``

    if(page <= 1){

    } else {
        pageHTML += `   
         <li class="page-item" onclick="moveToPage(1)"><a class="page-link" aria-label="fist"><span aria-hidden="true">&laquo;</span></a></li>
         <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" aria-label="Previous"><span aria-hidden="true">&lsaquo;</span></a></li>
         `
    }
    for (let i = firstPage; i <= lastPage; i++) {
        pageHTML+=` <li class="page-item ${i === page ? "active" :" "}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    if(page >= totalPages){

    } else {
        pageHTML += `
        <li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" aria-label="Next"><span aria-hidden="true">&rsaquo;</span></a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" aria-label="end"><span aria-hidden="true">&raquo;</span></a></li>`
    }

    document.querySelector(".pagination").innerHTML = pageHTML
}

const moveToPage = (pageNum)=>{
    page = pageNum
    getNews()
}

getLatestNews()