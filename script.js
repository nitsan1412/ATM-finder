import axios from "/node_modules/@bundled-es-modules/axios/axios.js";
import { DataTable } from "/node_modules/simple-datatables/dist/module/index.js";

const table = document.querySelector("#myTable");

const res = axios
  .get(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=100"
  )
  .then((res) => {
    const header = drawTitles(res.data.result.fields);
    tableBody.innerHTML = `<tr scope="row">${header}</tr>`;
    drawTable(res.data.result.records);
    const dataTable = new DataTable(table);
  })
  .catch((err) => console.log(`error: ${err}`));

let titles = document.querySelector("tr#table-titles");
let tableBody = document.querySelector("tbody#table-body");

const drawTable = (Content) => {
  let dataRows = "";
  for (let i = 0; i < Content.length; i++) {
    let curRow = drawSingleRow(Content[i]);
    dataRows += `<tr scope="row">${curRow}</tr>`;
  }
  tableBody.innerHTML = dataRows;
};

const drawSingleRow = (rowProps) => {
  let row = "";
  for (let col in rowProps) {
    row += `<td>${rowProps[col]}</td>`;
  }
  console.log(row);
  return row;
};

const drawTitles = (allTitles) => {
  let row = "";
  allTitles.forEach((curTitle) => {
    row += `<th scope="col">${curTitle.id}</th>`;
  });
  titles.innerHTML = row;
};
