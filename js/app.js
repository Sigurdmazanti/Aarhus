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

// Appending to DOM
function appendEvents(events) {
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
    document.querySelector("#event").innerHTML = htmlEvents;
}

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
    appendEvents(results);
<<<<<<< Updated upstream
}
=======
}

//Detail View
function showDetailView(id){
    let html = ""
    const event = _visitDenmarkData.find(event => event.Id == id);
    html += `
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
                `;
                }
            }
        }
    }
    else {
        for(let other of _visitDenmarkData){
            if(other.Category.Id == event.Category.Id){
                html +=`
                <div class="relatedproducts" onclick="showDetailView(${other.Id})">
                    <p>${other.Name}</p>
                    <img src="${event.Files[0].Uri}">
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
    }
    document.querySelector("#favorites").innerHTML = html;
}

favoriteList.push("Hey", "hey")

console.log(favoriteList);
>>>>>>> Stashed changes
