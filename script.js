
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
  //  console.log("street_number", item.street_number)
  //  console.log("typeOf", typeof item.street_number)
    if (typeof item.street_number != "undefined"){

      const lowerCaseName = item.street_number.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);

    }
  })


}

async function mainEvent() {
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('.filter_button');
  
  
  let currentList = [];


  mainForm.addEventListener('submit', async (submitEvent) => {

    submitEvent.preventDefault();
    console.log('form submission');


    const results = await fetch('https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json');

    currentList = await results.json();


    console.log(currentList)
  });

  filterButton.addEventListener('click', (event) => {
    console.log('clicked FilterButton')
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    const newList = filterList(currentList, formProps.street);
    console.log(newList);
    injectHTML(newList);
  })


}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
