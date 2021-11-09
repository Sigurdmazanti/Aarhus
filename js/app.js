"use strict";

// Global data variables - empty arrays for holding data from JSON
let _visitDenmarkData = [];
let _visitDenmarkCategories = [];

// All the data
async function fetchAllData() {
    const response = await fetch('json/data.json');
    const data = await response.json();
    _visitDenmarkData = data;
    appendEvents(_visitDenmarkData);
    appendPlacestoeat(_visitDenmarkData);
    appendFavorites(_visitDenmarkData)
}
fetchAllData();

// All the category data
async function fetchCategories() {
    const response = await fetch('json/categories.json');
    const data = await response.json();
    _visitDenmarkCategories = data;
}
fetchCategories();

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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, showDetailView);
    } else {
        div.innerHTML = "Your browser does not support geolocation. ";
    }
}

function showPosition(position) {
    let userCoordLong = position.coords.latitude;
    let userCoordLat = position.coords.longitude;
    for (const coordinate of _visitDenmarkData) {
        let eventLong = coordinate.Address.GeoCoordinate.Longitude;
        let eventLat = coordinate.Address.GeoCoordinate.Latitude;
        console.log(calcCrow(userCoordLong, userCoordLat, eventLat, eventLong).toFixed(1));
    }
}

function showError(error) {
    if (error.PERMISSION_DENIED) {
        alert('Geolocation requested denied. Check your browser settings or give the browser permission to track your location.')
    }
}
getLocation();

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

function singleImage(events) {
    let imageUrl = "";
    if (events.Files.length == 0) {
        imageUrl = "http://www.mandysam.com/img/random.jpg";
    } else {
        imageUrl = events.Files[0].Uri;
    }
    return imageUrl;
}

function appendEvents(events) {
    let htmlEvents = "";
    for (let event of events) {
        htmlEvents += /*html*/ `
    <article onclick="showDetailView('${event.Id}')">
    <div>
    <p>${event.Name}</p>
    <img src="${singleImage(event)}">
    </div>
    </article>
    `;
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
function showDetailView(id) {
    let html = ""
    const event = _visitDenmarkData.find(event => event.Id == id);
    html += `
    <img src="${singleImage(event)}">
    <div class="detail-info">
    <button onclick="addtoFavoriteList(${event.Id})">Add</button>
    <h2>${event.Name}</h2>
    <p>${event.Descriptions[0].Text.substring(0,200)}...</p>
    <p>${event.Address.AddressLine1} </p>
    <p>${event.Address.PostalCode}, ${event.Address.City}</p>
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
                    html += `
                    <img src="${event.Files[0].Uri}">
                    <p>${event.Name}</p>
                    <p>${event.MainCategory.Name}</p>
                    </div>
                `;
                }
            }
        }
    } else {
        for (let other of _visitDenmarkData) {
            if (other.Category.Id == event.Category.Id) {
                html += `
                <div class="relatedproducts" onclick="showDetailView(${other.Id})">
                    <img src="${other.Files[0].Uri}">
                    <p>${other.Name}</p>
                    <p>${other.MainCategory.Name}</p>
                </div>
            `;
                console.log(other.Name)
            }
        }
    }
    html += `</div></div>`;
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

function addtoFavoriteList(id) {
    let html = "";
    const event = _visitDenmarkData.find(event => event.Id == id);
    if (favoriteList.includes(event.Id)) {
        favoriteList.splice("event.Id")
    } else {
        favoriteList.push(event.Id)
    }
    console.log(favoriteList)
    html += `
        <h1>Your Favorites</h1>
        <div class="scrollable">
    `;
    for (id of favoriteList) {
        html += `
        <p>${event.Name}</p>
    `;
    }
    document.querySelector("#favorites").innerHTML = html;
}

// Show favorite list
function appendFavorites(events){
    let html;
    for(let event of events) {
    if(favoriteList.includes(event.Id)){
        html += `
        <p>${event.Name}</p>
        `;
    }
}
    document.querySelector("#favorites").innerHTML = html;
}

// Underkategorier
function appendPlacestoeat(events){
    let html = "<h2>Popular</h2>";
    for(let event of events){
        if (event.MainCategory.Name === "Places to eat"){  
        document.querySelector("#eat_event").innerHTML += `
        <article onclick="showDetailView('${event.Id}')">
        <div>
        <p>${event.Name}</p>
        <img src="${singleImage(event)}">
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Activities"){  
        document.querySelector("#activities_event").innerHTML += `
        <article onclick="showDetailView('${event.Id}')">
        <div>
        <p>${event.Name}</p>
        <img src="${singleImage(event)}">
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Attractions"){  
        document.querySelector("#attractions_event").innerHTML += `
        <article onclick="showDetailView('${event.Id}')">
        <div>
        <p>${event.Name}</p>
        <img src="${singleImage(event)}">
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Events"){  
        document.querySelector("#event_event").innerHTML += `
        <article onclick="showDetailView('${event.Id}')">
        <div>
        <p>${event.Name}</p>
        <img src="${singleImage(event)}">
        </div>
        </article>
        `;
    }
}
}