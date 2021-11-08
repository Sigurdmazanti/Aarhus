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
          div.innerHTML = "The Browser Does not Support Geolocation";
        }
      }

      function showPosition(position) {
        let userCoordLong = position.coords.latitude;
        let userCoordLat = position.coords.longitude;
        console.log(userCoordLat);
        console.log(userCoordLong);
        console.log((calcCrow(userCoordLong, userCoordLat, 59.3225525, 13.4619422).toFixed(1)));
      }

      function showError(error) {
        if(error.PERMISSION_DENIED){
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
function singleImage(events) {
    let imageUrl = "";
    if (events.Files.length == 0) {
        imageUrl = "http://www.mandysam.com/img/random.jpg";
    } else {
        imageUrl = events.Files[0].Uri;
    }
    return imageUrl;
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

//Detail View
function showDetailView(id){
    let html = ""
    const event = _visitDenmarkData.find(event => event.Id == id);
    html += `
    <img src="${singleImage(event)}">
    <h2>${event.Name}</h2>
    <p>${event.Descriptions[0].Text.substring(0,200)}</p>
    <p>${event.Address.GeoCoordinate.Lati}</p>
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


// let map;
//       function haversine_distance(mk1, mk2) {
//       let R = 6371.0710; // Radius of the Earth in km
//       let rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
//       let rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
//       let difflat = rlat2-rlat1; // Radian difference (latitudes)
//       let difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

//       let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
//       return d;
//     }


/* Distance */
// function initMap(/*position*/) {
//   // The map, centered on Central Park
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(initMap);
//   const center = {
//       lat: 40.774102, lng: -73.971734
//     };

//   const options = {zoom: 15, scaleControl: true, center: center};
//   map = new google.maps.Map(
//       document.querySelectorAll(".map"), options);
//   // Locations of landmarks
// //   let dakota = {lat: position.coords.latitude, lng: position.coords.longitude};
// let dakota = {lat: 56.14865019, lng: 10.2031846};
//   let frick = {lat: 56.14865019, lng: 10.2031846};
//   // The markers for The Dakota and The Frick Collection
//   let mk1 = new google.maps.Marker({position: dakota, map: map});
//   let mk2 = new google.maps.Marker({position: frick, map: map});

//   // Draw a line showing the straight distance between the markers
//   let line = new google.maps.Polyline({path: [dakota, frick], map: map});
//   // Calculate and display the distance between markers
//   let distance = haversine_distance(mk1, mk2);
//   document.querySelectorAll('.msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km."
//   }

//   else {
//       alert('Geolocation requested denied. Check your browser settings or give the browser permission to track your location.')
//   }
// }

// // HTML :             <script async
// src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVIlSg_mFP61-qnnvET5HQOEf1bDKYbYY&callback=initMap">
// </script>