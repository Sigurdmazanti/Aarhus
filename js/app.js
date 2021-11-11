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
    appendForside(_visitDenmarkData);
}
fetchAllData();

// All the category data
async function fetchCategories() {
    const response = await fetch('json/categories.json');
    const data = await response.json();
    _visitDenmarkCategories = data;
}
fetchCategories();

function categoryImage(event) {
    let imageCategory = "";
    if (event.MainCategory.Name === "Places to eat") {
        imageCategory = "../img/placesToEat_ph.png";
        
    } else if (event.MainCategory.Name === "Attractions") {
        imageCategory = "../img/attractions_ph.png";
    }
    else if (event.MainCategory.Name === "Events") {
        imageCategory = "../img/events_ph.png";
    }
    else if (event.MainCategory.Name === "Activities") {
        imageCategory = "../img/activities_ph.png";
    }
    return imageCategory;
}

function singleImage(events) {
    let imageUrl = "";
    if (events.Files.length == 0) {
        imageUrl = categoryImage(events);
    } else {
        imageUrl = events.Files[0].Uri;
    }
    return imageUrl;
}

function appendEvents(events) {
    let htmlEvents = "";
    for (let event of events) {
        htmlEvents += /*html*/ `
    <article class="places_card" onclick="showDetailView('${event.Id}')">
    <img src="${singleImage(event)}">
    <p>${event.Name}</p>
    <p class="lightblue">${event.MainCategory.Name}</p>
    </article>
    `;
    }
    document.querySelector("#search-results").innerHTML = htmlEvents;
}

// Forside
function appendForside(events){
    let html = "";
        html += `<h2>Museums</h2><div class="related">`
    for(let event of events){
        if(event.Category.Name == "Museums"){
        html += `
        <article class="relatedproducts" onclick="showDetailView('${event.Id}')">
            <img src="${singleImage(event)}">
            <p>${event.Name.substring(0,25)}</p>
            <p class="lightblue">${event.MainCategory.Name}</p>
        </article>
        `;
        }
    }
        html += `</div><h2>Attractions</h2><div class="related">`
    for(let event of events){
        if(event.Category.Name === "Restaurants"){
        html += `
        <article class="relatedproducts" onclick="showDetailView('${event.Id}')">
            <img src="${singleImage(event)}">
            <p>${event.Name.substring(0,25)}</p>
            <p class="lightblue">${event.MainCategory.Name}</p>
        </article>
        `;
        }
    }
        html += `</div><h2>Events</h2><div class="related">`
    for(let event of events){
        if(event.Category.Name === "Events"){
        html += `
        <article class="relatedproducts" onclick="showDetailView('${event.Id}')">
        <img src="${singleImage(event)}">
        <p>${event.Name.substring(0,25)}</p>
        <p class="lightblue">${event.MainCategory.Name}</p>
        </article>
        `;
        }
    }
        html += `</div><h2>Shopping</h2><div class="related">`
    for(let event of events){
        if(event.Category.Name === "Shopping"){
        html += `
        <article class="relatedproducts" onclick="showDetailView('${event.Id}')">
                <img src="${singleImage(event)}">
                <p>${event.Name.substring(0,25)}</p>
                <p class="lightblue">${event.MainCategory.Name}</p>
        </article>
        `;
        }
    }
        html += `</div><h2>Nightlife and Clubs</h2><div class="related">`
    for(let event of events){
        if(event.Category.Name === "Nightlife and Clubs"){
        html += `
        <article class="relatedproducts" onclick="showDetailView('${event.Id}')">
        <img src="${singleImage(event)}">
        <p>${event.Name.substring(0,25)}</p>
        <p class="lightblue">${event.MainCategory.Name}</p>
        </article>
        `;
        }
    }
    document.querySelector("#event").innerHTML = html;
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
{/*  */}
function showDetailView(id) {
    let html = ""
    const event = _visitDenmarkData.find(event => event.Id == id);
    if (event.Files.length == 0) {
        html +=`<img src="${singleImage(event)}">`
    } else {
        html += `
    <img src="${singleImage(event)}">`
    }
    html += `
    <div class="detail-info">
    <div class="flex">
    <h2>${event.Name}</h2>
    <i class="far fa-bookmark fa-2x favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i>
    </div>
    <p>${event.Descriptions[0].Text.substring(0,200)}...</p>
    <p id="viewmore">${event.Descriptions[0].Text.substring(200)}</p>
    <p id="viewmore-btn">View more</p>
    <div id="adress-detail">
    <p>${event.Address.AddressLine1} </p>
    <p>${event.Address.PostalCode}, ${event.Address.City}</p>
    </div>
    <a href="${event.CanonicalUrl}">More info</a>
    <h3>You might also like..</h3>
    <div class="related">
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
                `;
                 }
                 else {
                    html +=`<img src="${singleImage(event)}">`
                 }
                 html += `
                 <p>${event.Name}</p>
                 <p class="lightblue">${event.MainCategory.Name}</p>
                 </div>
             `;
                }
            }
        }
    } else {
        for (let other of _visitDenmarkData) {
            if (other.Category.Id == event.Category.Id) {
                html += `
                <div class="relatedproducts" onclick="showDetailView(${other.Id})">`
                if (other.Files.length == 0) {
                    html +=`<img src="${singleImage(event)}">`
                } else {
                    html += `
                    <img src="${other.Files[0].Uri}">`
                }
                html += 
                   `<p>${other.Name}</p>
                    <p class="lightblue">${other.MainCategory.Name}</p>
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
    const event = _visitDenmarkData.find(event => event.Id == id);

    if(favoriteList.indexOf(event.Id) !== -1) {
        favoriteList.splice(favoriteList.indexOf(event.Id), 1);
    }
    else {
        favoriteList.push(event.Id)
    }
    appendFavorites();
    console.log(localStorage)
}

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
        <i class="far fa-bookmark fa-2x favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i>
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

// Underkategorier
function appendPlacestoeat(events){
    for(let event of events){
        if (event.MainCategory.Name === "Places to eat"){  
        document.querySelector("#eat_event").innerHTML += /*html*/ `
        <article class="places_card" onclick="showDetailView('${event.Id}')">
        <img src="${singleImage(event)}">
        <div class="eat_box_1">
        <h3>${event.Name}</h3>
        </div>
        <div class="eat_box_2">
        <address>${event.Address.AddressLine1}, ${event.Address.PostalCode} ${event.Address.City}</address>
        </div>
        <div class="eat_box_3">
        <p class="lightblue category_spec_category">${event.Category.Name}</p>
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Activities"){  
        document.querySelector("#activities_event").innerHTML += /*html*/ `
        <article class="category_card" onclick="showDetailView('${event.Id}')">
        <span class="fa-stack close_button">
        <i class="close_circle fas fa-circle fa-stack-2x"></i>
        <i class="close_times fas fa-times fa-stack-1x"></i>
        </span>
        <img src="${singleImage(event)}">
        <div class="category_text">
        <div class="category_box_1">
        <h3>${event.Name}</h3>
        <address>${event.Address.AddressLine1}, ${event.Address.PostalCode} ${event.Address.City}</address>
        </div>
        <div class="category_box_2">
        <p>${event.Descriptions[0].Text.toString().substring(0,100)}... <span>Read more</span></p>
        </div>
        <div class="category_box_3">
        <div class="category_spec_category lightblue">${event.Category.Name} <i class="far fa-bookmark fa-2x favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i></div>
        </div>
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Attractions"){  
        document.querySelector("#attractions_event").innerHTML += /*html*/ `
        <article class="category_card" onclick="showDetailView('${event.Id}')">
        <span class="fa-stack close_button">
        <i class="close_circle fas fa-circle fa-stack-2x"></i>
        <i class="close_times fas fa-times fa-stack-1x"></i>
        </span>
        <img src="${singleImage(event)}">
        <div class="category_text">
        <div class="category_box_1">
        <h3>${event.Name}</h3>
        <address>${event.Address.AddressLine1}, ${event.Address.PostalCode} ${event.Address.City}</address>
        </div>
        <div class="category_box_2">
        <p>${event.Descriptions[0].Text.toString().substring(0,100)}... <span>Read more</span></p>
        </div>
        <div class="category_box_3">
        <div class="category_spec_category lightblue">${event.Category.Name} <i class="far fa-bookmark fa-2x favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i></div>
        </div>
        </div>
        </article>
        `;
    }
    else if (event.MainCategory.Name === "Events"){  
        document.querySelector("#event_event").innerHTML += /*html*/ `
        <article class="category_card" onclick="showDetailView('${event.Id}')">
        <span class="fa-stack close_button">
        <i class="close_circle fas fa-circle fa-stack-2x"></i>
        <i class="close_times fas fa-times fa-stack-1x"></i>
        </span>
        <img src="${singleImage(event)}">
        <div class="category_text">
        <div class="category_box_1">
        <h3>${event.Name}</h3>
        <address>${event.Address.AddressLine1}, ${event.Address.PostalCode} ${event.Address.City}</address>
        </div>
        <div class="category_box_2">
        <p>${event.Descriptions[0].Text.toString().substring(0,100)}... <span>Read more</span></p>
        </div>
        <div class="category_box_3">
        <div class="category_spec_category lightblue">${event.Category.Name} <i class="far fa-bookmark fa-2x favorite-btn" onclick="addtoFavoriteList(${event.Id})"></i></div>
        </div>
        </div>
        </article>
        `;
    }
}
}



// function appendFavDrinks() {
//     let htmlFav = "";
//     for (const drink of _favDrinks) {
//       htmlFav += /*html*/ `
//         <article class="favorite-card" onclick="showDrink('${drink.id}')">
//           <img src="${drink.img}">
//           <h2>${drink.name} (${drink.strength})</h2>
//           <p>${generateFavDrinkButton(drink.id)}</p>
//         </article>
//       `;
//     }
//     // hvis der ikke er nogle favoritiseret drink, fortæller vi brugeren det
//     // Sigurd, Rune
//     if (_favDrinks.length === 0) {
//       htmlFav = "<p>No drinks added to favorites</p>";
//     }
//     document.querySelector("#fav-drink-container").innerHTML = htmlFav;
//   }
  
//   // Vi genererer "tilføj til favorit" hjerte-knappen og displayer i DOM'en
//   // Sigurd, Rune
//   function generateFavDrinkButton(drinkId) {
//     let btnTemplate = `
//       <i class="far fa-heart" onclick="addToFavourites('${drinkId}')"></i>`;
//     if (isFavDrink(drinkId)) {
//       btnTemplate = `
//         <i class="fas fa-heart" id="redheart" onclick="removeFromFavourites('${drinkId}')" class="rm"></i>`;
//     }
//     return btnTemplate;
//   }
  
//   // Appender  drink ud fra det valgte ID
//   // Sigurd, Rune
//   function addToFavourites(drinkId) {
//     let favdrink = _drinks.find((drink) => drink.id == drinkId);
//     _favDrinks.push(favdrink);
//     showDrink(drinkId);
//     appendFavDrinks(); // "skyder" den valgte drink ind i funktionen der står for at append de favoritiserede drinks
//   }
  
//   // Fjerner drink igen, ud fra givet ID
//   // Sigurd, Rune
//   function removeFromFavourites(drinkId) {
//     _favDrinks = _favDrinks.filter((drink) => drink.id != drinkId);
//     showDrink(drinkId);
//     appendFavDrinks(); // vi opdatere igen den ansvarlige append-funktion, og fjerner drinken
//   }
  
//   // Tjekker om det globale favDrinks array har et ID der matcher
//   // Sigurd, Rune
//   function isFavDrink(drinkId) {
//     return _favDrinks.find((drink) => drink.id == drinkId); // checking if _favMovies has the movie with matching id or not
//   }

// function getLocation() {
    //    if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showError, showPosition, appendEvents);
    //     } else {
    //         div.innerHTML = "Your browser does not support geolocation. ";
    //     }
    // }
    
    // function showPosition(position) {
    //         let userCoordLong = position.coords.latitude;
    //         let userCoordLat = position.coords.longitude;
    //         console.log(userCoordLong);
    //         console.log(userCoordLat);
    // }
    
    // function showError(error) {
    //     if (error.PERMISSION_DENIED) {
    //         alert('Geolocation requested denied. Check your browser settings or give the browser permission to track your location.')
    //     }
    // }
    // getLocation();
    
    
    // console.log("hi");
    // function calcCrow(lat1, lon1, lat2, lon2) {
    //     var R = 6371; // km
    //     var dLat = toRad(lat2 - lat1);
    //     var dLon = toRad(lon2 - lon1);
    //     var lat1 = toRad(lat1);
    //     var lat2 = toRad(lat2);
    
    //     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c;
    //     return d;
    // }
    // // Converts numeric degrees to radians
    // function toRad(Value) {
    //     return Value * Math.PI / 180;
    // }