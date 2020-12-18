import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Constants } from './Constants';

class Map {
  constructor(countries, globalInfo) {
    this.container = document.querySelector('.container__infected-map');
    this.countries = [...countries];
    this.globalInfo = globalInfo;
    this.markers = [];
    console.log('why? ', this.countries, globalInfo);
    this.initMap();
    this.bindButtonsEvens();
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

    this.addConfirmedMarkers();
  }

  addMarker(
    country = '',
    Latitude,
    Longitude,
    count = '',
    iconSize = [8, 8],
    iconColor = 'red',
    popupText = 'confirmed',
  ) {
    // Icon options
    const iconOptions = {
      iconUrl: `../assets/images/${iconColor}-circle.png`,
      iconSize,
    };
    // Creating a custom icon
    const customIcon = L.icon(iconOptions);
    // Options for the marker
    const markerOptions = {
      title: `${country} ${count} ${popupText}`,
      clickable: true,
      riseOnHover: true,
      draggable: false,
      icon: customIcon,
    };
    // Creating a marker
    const marker = L.marker([parseFloat(Latitude), parseFloat(Longitude)], markerOptions);
    marker.addTo(this.map);

    // marker.mouseover = () => {
    //   console.log('!!!!');
    //   marker.openPopup();
    // };

    console.log('marker ', marker);
    // Adding pop-up to the marker
    marker.bindPopup(`<h4 class="marker__title">${country}</h4>${count} ${popupText}`);
  }

  addConfirmedMarkers() {
    this.removeMarkers();
    if (this.countries) {
      this.countries.forEach((el) => {
        console.log('element ', el, el.totalConfirmed);
        let size = ((el.totalConfirmed * 100) / this.globalInfo.totalConfirmed) * 8;
        size = this.checkMarkerSize(size);

        if (el.сountryCoordinates) {
          const marker = this.addMarker(
            el.country,
            ...el.сountryCoordinates,
            el.totalConfirmed,
            [size, size],
          );
          this.markers.push(marker);
        }
      });
    }
  }

  addRecoveredMarkers() {
    this.removeMarkers();
    if (this.countries) {
      this.countries.forEach((el) => {
        let size = ((el.totalRecovered * 100) / this.globalInfo.totalRecovered) * 8;
        size = this.checkMarkerSize(size);

        if (el.сountryCoordinates) {
          const marker = this.addMarker(
            el.country,
            ...el.сountryCoordinates,
            el.totalRecovered,
            [size, size],
            'green',
            'recovered',
          );
          this.markers.push(marker);
        }
      });
    }
  }

  addDeathsMarkers() {
    this.removeMarkers();
    if (this.countries) {
      this.countries.forEach((el) => {
        let size = ((el.totalDeaths * 100) / this.globalInfo.totalDeaths) * 8;
        size = this.checkMarkerSize(size);

        if (el.сountryCoordinates) {
          const marker = this.addMarker(
            el.country,
            ...el.сountryCoordinates,
            el.totalDeaths,
            [size, size],
            'grey',
            'total deaths',
          );
          this.markers.push(marker);
        }
      });
    }
  }

  removeMarkers() {
    this.markers.forEach((element) => {
      if (element) element.remove();
    });
    this.markers = [];
  }

  bindButtonsEvens() {
    const root = document.querySelector('.container__map-buttons');
    root.addEventListener('click', (e) => {
      const buttons = root.querySelectorAll('.container__map-button');

      if (e.target.classList.contains('js-confirmed-button')) {
        this.addConfirmedMarkers();
        buttons.forEach((element) => {
          element.classList.remove('container__map-button_active');
        });
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-recovered-button')) {
        this.addRecoveredMarkers();
        buttons.forEach((element) => {
          element.classList.remove('container__map-button_active');
        });
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-deaths-button')) {
        this.addDeathsMarkers();
        buttons.forEach((element) => {
          element.classList.remove('container__map-button_active');
        });
        e.target.classList.add('container__map-button_active');
      }
    });
  }

  getMarkers() {
    return this.markers;
  }

  checkMarkerSize(markerSize) {
    const size = markerSize;
    if (size < Constants.MARKER_SIZE.min) return Constants.MARKER_SIZE.min;
    if (size > Constants.MARKER_SIZE.max) return Constants.MARKER_SIZE.max;
    return size;
  }
}

export default Map;
