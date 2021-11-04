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
      <article>
        <div>
        <img src="${eventimg.Uri}">
          <p>${event.Name}</p>
        </div>
      </article>  
      `;
        }
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