"use strict";

// Global data variables - empty arrays for holding data from JSON
let _visitDenmarkData = [];
let _visitDenmarkCategories = [];

// All the data
async function fetchAllData() {
    const response = await fetch('json/data.json');
    const data = await response.json();
    _visitDenmarkData = data;
    console.log(_visitDenmarkData);
    appendEvents(_visitDenmarkData);
<<<<<<< Updated upstream
=======
    appendPlacestoeat(_visitDenmarkData);
    appendForside(_visitDenmarkData);
>>>>>>> Stashed changes
}
fetchAllData();

// All the category data
async function fetchCategories() {
    const response = await fetch('json/categories.json');
    const data = await response.json();
    _visitDenmarkCategories = data;
    console.log(_visitDenmarkCategories);
}
fetchCategories();

<<<<<<< Updated upstream
// Appending to DOM
function appendEvents(events) {
=======
// function appendEventsImages(events) {
//     let htmlEvents = "";
//     let htmlImg = "";
//     for (let event of events) {
//         htmlEvents += /*html*/ `
//         <article>
//         <div>
//           <p>${event.Name}</p>
//           `;
//         for (const eventimg of event.Files) {
//             htmlEvents += /*html*/ `
//             <img src="${eventimg.Uri}">
//             </div>
//             </article> 
//             `;
//         }
//     }
//     document.querySelector("#event").innerHTML = htmlEvents + htmlImg;
// }

function singleImage(events) {
    let imageUrl = "";
    if (events.Files.length == 0) {
        imageUrl = "http://www.mandysam.com/img/random.jpg";
    } else {
        imageUrl = events.Files[0].Uri;
    }
    return imageUrl;
}

function appendEvents(events, position) {
>>>>>>> Stashed changes
    let htmlEvents = "";
    for (let event of events) {
        for (const eventimg of event.Files) {
        htmlEvents += /*html*/ `
<<<<<<< Updated upstream
      <article>
        <div>
        <img src="${eventimg.Uri}">
          <p>${event.Name}</p>
        </div>
      </article>  
      `;
        }
=======
        <article onclick="showDetailView('${event.Id}')">
            <div>
                <p>${event.Name}</p>
                <img src="${singleImage(event)}">
            </div>
        </article> 
            `;
>>>>>>> Stashed changes
    }
    
}

<<<<<<< Updated upstream
=======
// Forside
function appendForside(events){
    let html = "";
    for(let event of events){
        html += `
        <article onclick="showDetailView('${event.Id}')">
        <div>
        <p>${event.Name}</p>
        <img src="${singleImage(event)}">
        </div>
        </article>
        `;
    }
    document.querySelector("#event").innerHTML = html;
}


>>>>>>> Stashed changes
// Search for name or category (cafe, bar)
function search(searchValue) {
    searchValue = searchValue.toLowerCase();
    let results = [];
    for (let searchedEvent of _visitDenmarkData) {
        let name = searchedEvent.Name.toLowerCase();
        let category = searchedEvent.Category.Name.toLowerCase();
        // cafés fra JSON har en special karakter, det her 
        let categorySpecial = category.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            if (name.includes(searchValue) || categorySpecial.includes(searchValue)) {
                results.push(searchedEvent);
            }
        }
<<<<<<< Updated upstream
    appendEvents(results);
<<<<<<< Updated upstream
}
=======
}

//Detail View
function showDetailView(id){
=======
    }
    appendForside(results);
}

// function mainCategory(category) {
//     let categoryResult = [];
//     for (const categoryEvent of _visitDenmarkData) {
//         let category = categoryEvent.MainCategory.Name;
//         if ()
//     }
// }



//Detail View <p>${event.Address.GeoCoordinate.Lati}</p> 
{/* <p id="viewmore">${event.Descriptions[0].Text.substring(200)}</p>
<p id="viewmore-btn">View more</p> */}
{/* <button class="favorite-btn" onclick="addtoFavoriteList(${event.Id})"><i class="fas fa-heart"></i></button> */}
function showDetailView(id) {
>>>>>>> Stashed changes
    let html = ""
    const event = _visitDenmarkData.find(event => event.Id == id);
    if (event.Files.length == 0) {
        html +=`<img src="http://www.mandysam.com/img/random.jpg">`
    } else {
        html += `
    <img src="${singleImage(event)}">`
    }
    html += `
<<<<<<< Updated upstream
    <img src="${singleImage(event)}">
    <h2>${event.Name}</h2>
    <p>${event.Descriptions[0].Text.substring(0,200)}</p>
    <p id="viewmore">${event.Descriptions[0].Text.substring(200)}</p>
    <p id="viewmore-btn">View more</p>
    <button onclick="addtoFavoriteList(${event.Id})"></button>
    <p>${event.Address.AddressLine1} </p>
    <p>${event.Address.PostalCode}, ${event.Address.City}</p>
    <h3>You might also like..</h3>
    <div id="related">
    `;
    if(event.RelatedProducts.length > 0){
        for (let related of event.RelatedProducts){
        html += `
            <div class="relatedproducts" onclick="showDetailView(${related.Id})">
                <p>${related.Name}</p>
        `;
            for (let event of _visitDenmarkData){
                if(related.Id == event.Id){
                html +=`
                    <img src="${event.Files[0].Uri}">
                    </div>
=======
    <div class="detail-info">
    <div class="flex">
    <h2>${event.Name}</h2>
    <i class="fas fa-heart" class="favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i>
    </div>
    <p>${event.Descriptions[0].Text.substring(0,200)}...</p>
    <div id="adress-detail">
    <p>${event.Address.AddressLine1} </p>
    <p>${event.Address.PostalCode}, ${event.Address.City}</p>
    </div>
    <a href="${event.CanonicalUrl}">More info</a>
    <h3>You might also like..</h3>
    <div id="related">
    `;
    if (event.RelatedProducts.length > 1) {
        for (let related of event.RelatedProducts) {
            html += `
            <div class="relatedproducts" onclick="showDetailView(${related.Id})">  
        `;
            for (let event of _visitDenmarkData) {
                if (related.Id == event.Id) {
                    if(event.Files.length > 0){
                    html += `
                    <img src="${event.Files[0].Uri}">
>>>>>>> Stashed changes
                `;
                 }
                 else {
                    html +=`<img src="http://www.mandysam.com/img/random.jpg">`
                 }
                 html += `
                 <p>${event.Name}</p>
                 <p class="lightblue">${event.MainCategory.Name}</p>
                 </div>
             `;
                }
            }
        }
<<<<<<< Updated upstream
    }
    else {
        for(let other of _visitDenmarkData){
            if(other.Category.Id == event.Category.Id){
                html +=`
                <div class="relatedproducts" onclick="showDetailView(${other.Id})">
                    <p>${other.Name}</p>
                    <img src="${event.Files[0].Uri}">
=======
    } else {
        for (let other of _visitDenmarkData) {
            if (other.Category.Id == event.Category.Id) {
                html += `
                <div class="relatedproducts" onclick="showDetailView(${other.Id})">`
                if (other.Files.length == 0) {
                    html +=`<img src="http://www.mandysam.com/img/random.jpg">`
                } else {
                    html += `
                    <img src="${other.Files[0].Uri}">`
                }
                html += 
                   `<p>${other.Name}</p>
                    <p class="lightblue">${other.MainCategory.Name}</p>
>>>>>>> Stashed changes
                </div>
            `;
            console.log(other.Name)
            }
        }
    }
    html += `</div>`;
    document.querySelector("#detailViewContainer").innerHTML = html;
    navigateTo("detailView");
}

// View more button
// const viewmore = document.getElementById('viewmore-btn');
// console.log(viewmore);

// viewmore.addEventListener("click", function(){
//     let view = document.querySelector("#viewmore");
//     if(view.style.display = "none"){
//         view.style.display = "block";
//         document.querySelector("#viewmore-btn").innerHTML = "View less";
//     }
//     else {
//         view.style.display = "none";
//         document.querySelector("#viewmore-btn").innerHTML = "View more";
//     }
// });

// Add to favourites
let favoriteList = [];

<<<<<<< Updated upstream
function addtoFavoriteList(id){
    let html = "";
    const event = _visitDenmarkData.find(event => event.Id == id);
    if(favoriteList.includes(event.Id)){
        favoriteList.splice("event.Id")
    }
    else {
    favoriteList.push(event.Id)
    }
    console.log(favoriteList)
    html += `
        <h1>Your Favorites</h1>
        <div class="scrollable">
    `;
    for(id of favoriteList){
        html += `
        <p>${event.Name}</p>
    `;
=======
function addtoFavoriteList(id) {
    const event = _visitDenmarkData.find(event => event.Id == id);
    // if (favoriteList.includes(event.Id)) {
    //     favoriteList = favoriteList.filter((event) => event.Id != id);
    // } 
    if(favoriteList.indexOf(event.Id) !== -1) {
        favoriteList.splice(favoriteList.indexOf(event.Id), 1);
    }
    else {
        favoriteList.push(event.Id)
>>>>>>> Stashed changes
    }
    // console.log(favoriteList)
    appendFavorites();
    console.log(localStorage)
}

<<<<<<< Updated upstream
favoriteList.push("Hey", "hey")
=======
// Show favorite list
function appendFavorites(){
    let html;
    html += `
    <h1>Your Favorites</h1>
    <div class="scrollable">`;
    for(let event of _visitDenmarkData) {
    if(favoriteList.includes(event.Id)){
        html += `
        <div class="relatedproducts" onclick="showDetailView('${event.Id}')">`
        if (event.Files.length == 0) {
            html +=`<img src="http://www.mandysam.com/img/random.jpg">`
        } else {
            html += `
        <img src="${singleImage(event)}">`
        }
        html +=
        `<div class="flex"><p>${event.Name}</p>
        <i class="fas fa-heart" class="favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i>
        </div>
        </div>
        `;
        console.log(event.Name)
    }
    html += `</div>`
}
if(favoriteList.length === 0){
    html +=`<p>Add events to favorite list..</p>`
}
    document.querySelector("#favorites").innerHTML = html;
}
appendFavorites();
>>>>>>> Stashed changes

console.log(favoriteList);
>>>>>>> Stashed changes
