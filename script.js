
function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#crime_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.clearance_code_inc_type}</li>`;
    target.innerHTML += str

  });
}


function filterList(list, query) {
  console.log(list)
  return list.filter((item) => {

    if (typeof item.street_number != "undefined"){

      const lowerCaseName = item.street_number.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);

    }
  })
 

}

function initMap() {
  const carto = L.map('map').setView([38.98, -76.93], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto;

}

function markerPlace(array, map) {

  console.log('array for markers', array)

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log('markerPlace', item);
    const locationPoint = {
      type: "Point",
      coordinates: [item.longitude, item.latitude]
    };
    const { coordinates } = locationPoint
    L.marker([coordinates[1], coordinates[0]]).addTo(map);

  })

}

async function mainEvent() {
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('.filter_button');
  const clearDataButton = document.querySelector('#data_clear');
  const loadDataButton = document.querySelector('#data_load');
  
  const carto = initMap();

  const storedData = localStorage.getItem('storedData');
  let parsedData = JSON.parse(storedData);

  let currentList = [];


  mainForm.addEventListener('submit', async (submitEvent) => {

    submitEvent.preventDefault();
    console.log('form submission');


    const results = await fetch('https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json');

    storedList = await results.json();
    localStorage.setItem('storedData', JSON.stringify(storedList));
    console.log(storedList)
  });

  filterButton.addEventListener('click', (event) => {
    console.log('clicked FilterButton')
    currentList = parsedData
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    const newList = filterList(currentList, formProps.street);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  })

  clearDataButton.addEventListener("click", (event) => {
    console.log('clear browser data');
    localStorage.clear();
    console.log('localStorage Check', localStorage.getItem("storedData"))
  })

}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
