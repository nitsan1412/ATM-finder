import axios from "./node_modules/@bundled-es-modules/axios/axios.js";
import { DataTable } from "./node_modules/simple-datatables/dist/module/index.js";

const myTable = document.querySelector("#myTable");
let theadEl = document.createElement("thead");
let tBodyEl = document.createElement("tbody");

let selectorMapElement = document.querySelector("#gmap_canvas");
const myOptions = {
  zoom: 8,
  center: new google.maps.LatLng(31.4037192, 33.9606743),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};
let map = new google.maps.Map(selectorMapElement, myOptions);

const response = axios
  .get(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=500"
  )
  .then((response) => {
    createTableHead(response.data.result.fields);
    createTableBody(response.data.result.records);
    const dataTable = new DataTable(myTable);

    const dataTableInput = document.querySelector(".dataTable-input");

    dataTableInput.addEventListener("input", (e) => {
      const searchValue = e.target.value;
      const data = response.data.result.records;

      let filtered = filterTable(data, searchValue);

      // selectorMapElement.innerHTML = "";
      map = new google.maps.Map(selectorMapElement, myOptions);
      createGoogleMap(filtered, map);
    });

    google.maps.event.addDomListener(
      window,
      "load",
      createGoogleMap(response.data.result.records, map)
    );
  })
  .catch((err) => console.log(err));

const createTableHead = (data) => {
  console.log(data);
  let trEl = document.createElement("tr");
  for (let index = 0; index < data.length; index++) {
    let thEl = document.createElement("th");
    thEl.innerText = data[index].id;
    trEl.appendChild(thEl);
  }
  theadEl.appendChild(trEl);
  myTable.appendChild(theadEl);
};

const createTableBody = (data) => {
  for (const iterator of data) {
    let trEl = document.createElement("tr");
    for (const key in iterator) {
      let tdEl = document.createElement("td");
      tdEl.innerText = iterator[key];
      trEl.appendChild(tdEl);
    }
    tBodyEl.appendChild(trEl);
    myTable.appendChild(tBodyEl);
  }
};

function createGoogleMap(data, map) {
  for (let i = 0; i < data.length; i++) {
    init_map(data[i], map);
  }
}

function init_map(dataATMObject, map) {
  let googleMapTitle = `ATM ${dataATMObject.ATM_Address}`;
  let googleMapAddress = `${dataATMObject.ATM_Address}, ${dataATMObject.City}`;
  let googleMapLat = dataATMObject.Y_Coordinate;
  let googleMapLong = dataATMObject.X_Coordinate;

  let infowindow = new google.maps.InfoWindow({
    content: `
          <strong>${googleMapTitle}</strong>
          <br>${googleMapAddress}<br>
        `,
  });

  let marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(googleMapLat, googleMapLong),
  });

  google.maps.event.addListener(marker, "click", function () {
    infowindow.open(map, marker);
  });
}

// let openMapBtn = document.querySelector("#open_map");

const filterTable = (data, value) => {
  return data.filter((atm) => {
    return atm.City.includes(value);
  });
};
