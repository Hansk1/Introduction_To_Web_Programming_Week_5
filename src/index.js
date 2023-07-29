import "./styles.css";

//Fetch geoJSON data:

var i = 0;

const fetchData = async () => {
  //Basic data:
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const dataPromise = await fetch(url);
  const dataJSON = await dataPromise.json();
  console.log(dataJSON);

  //Positive migration data:
  const url2 =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const pMigrationDataPromise = await fetch(url2);
  const pMigrationDataJSON = await pMigrationDataPromise.json();
  const pMigrationDataReadyJSON = pMigrationDataJSON.dataset.value;
  console.log(pMigrationDataReadyJSON);

  //Negative migration data:
  const url3 =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const nMigrationDataPromise = await fetch(url3);
  const nMigrationDataJSON = await nMigrationDataPromise.json();
  const nMigrationDataReadyJSON = nMigrationDataJSON.dataset.value;
  console.log(nMigrationDataJSON);

  initMap(dataJSON, pMigrationDataReadyJSON, nMigrationDataReadyJSON);
};

const initMap = (data, pMigrationData, nMigrationData) => {
  let map = L.map("map", {
    minZoom: -3
  });

  //Create geoJSON layer:
  let geoJsonLayer = L.geoJSON(data, {
    onEachFeature: (feature, layer) =>
      getFeature(feature, layer, pMigrationData, nMigrationData),
    style: {
      weight: 2
    }
  });

  //Add openstreetmap:
  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  //Add geoJSON to the map:
  geoJsonLayer.addTo(map);

  //Fit the map:
  map.fitBounds(geoJsonLayer.getBounds());
};

//Adding functioonality to the map ( show the name of the municipality when hovering over):
const getFeature = (feature, layer, pMigrationData, nMigrationData) => {
  if (!feature.properties.name) return;
  //get name:

  const name = feature.properties.name;

  layer.bindPopup(
    `<ul>
            <li>Positive migration: ${pMigrationData[i]}</li>
            <li>Negative migration: ${nMigrationData[i]}</li>
        </ul>`
  );
  layer.bindTooltip(name);

  i++;
};

fetchData();
