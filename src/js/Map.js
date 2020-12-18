import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class Map {
  constructor(countries = []) {
    this.container = document.querySelector('.container__infected-map');
    this.countries = [...countries];
    console.log('why? ', this.countries, countries);
    this.initMap();

    // this.getCountriesPoints();
  }

  async initMap() {
    this.mapOptions = {
      center: [53.9, 27.5667],
      zoom: 4,
    };
    // eslint-disable-next-line new-cap
    this.map = new L.map(this.container, this.mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map.addLayer(layer);

    if (this.countries) {
      console.log('this.countries!!! ', this.countries, this.countries instanceof Array);

      this.countries.forEach((el) => {
        console.log('element ', el, el.totalConfirmed);
        const conf = el.totalConfirmed;
        // const size = ((el.totalConfirmed * 100) / 170000000) * 50;
        const size = ((el.totalConfirmed) / el.population) * 400;
        // тут я пробовал установить размер по населению, то мне кажется такое

        this.addMarker(
          ...el.сountryCoordinates,
          el.totalConfirmed,
          [size, size],
        );
      });
    }
  }

  addMarker(Latitude, Longitude, confirmed = '165 897', iconSize = [50, 50]) {
    // Icon options
    const iconOptions = {
      iconUrl: '../assets/images/red-circle.png',
      iconSize,
    };
    // Creating a custom icon
    const customIcon = L.icon(iconOptions);
    // Options for the marker
    const markerOptions = {
      title: 'MyLocation',
      clickable: true,
      draggable: false,
      icon: customIcon,
    };
    // Creating a marker
    const marker = L.marker([parseFloat(Latitude), parseFloat(Longitude)], markerOptions);
    marker.addTo(this.map);

    // Adding pop-up to the marker
    marker.bindPopup(`${confirmed} confirmed`);
  }
}

export default Map;
