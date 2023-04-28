
function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#crime_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str

  });
}


function crimeByYear(list) {
 
    return list


}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  })

}


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
    const { coordinates } = item.geocoded_column_1
    L.marker([coordinates[1], coordinates[0]]).addTo(map);

  })

}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form');
  const loadDataButton = document.querySelector('#data_load');
  const clearDataButton = document.querySelector('#data_clear');
  const generateListButton = document.querySelector('#generate');
  const textField = document.querySelector('#street_number')

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';
  generateListButton.classList.add('hidden');

  const carto = initMap();

  const storedData = localStorage.getItem('storedData');
  let parsedData = JSON.parse(storedData);
  if (parsedData?.length > 0) {
    generateListButton.classList.remove('hidden');
  }

  let currentList = []; // this is "scoped" to the main event function

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something

    console.log('loading data');
    loadAnimation.style.display = 'inline-block';


    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    const storedList = await results.json();
    localStorage.setItem('storedData', JSON.stringify(storedList));
    parsedData = storedList
    if (parsedData?.length > 0) {
      generateListButton.classList.remove('hidden');
    }
    loadAnimation.style.display = 'none';
    // console.table(storedList);


  });

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list')
    currentList = crimeByYear(parsedData);
    console.log(currentList);
    injectHTML(currentList);
    markerPlace(currentList, carto);
  })

  textField.addEventListener('input', (event) => {
    console.log('input', event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList)
    injectHTML(newList);
    markerPlace(newList, carto);
  })


  clearDataButton.addEventListener("click", (event) => {
    console.log('clear browser data');
    localStorage.clear
    console.log('localStorage Check', localStorage.getItem("storedData"))
  })
}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests


