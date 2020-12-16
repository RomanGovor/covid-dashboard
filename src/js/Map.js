import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class Map {
  constructor() {
    this.container = document.querySelector('.container__infected-map');
    this.initMap();
  }

  initMap() {
    this.mapOptions = {
      center: [53.9, 27.5667],
      zoom: 4,
    };
    // eslint-disable-next-line new-cap
    this.map = new L.map(this.container, this.mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map.addLayer(layer);
    this.addMarker(this.mapOptions.center);
  }

  addMarker(coordinateX, coordinateY) {
    // Options for the marker
    const markerOptions = {
      title: 'MyLocation',
      clickable: true,
      draggable: true,
      iconUrl: '../assets/images/red-circle.png',
      iconSize: [50, 50],
    };
    // Creating a marker
    const marker = L.marker([coordinateX, coordinateY], markerOptions);

    marker.addTo(this.map);
  }
}
export default Map;
