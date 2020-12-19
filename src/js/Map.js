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

    this.addMarkersByKey(Constants.TABLES_KEYS[2]);
  }

  addMarker(
    slug,
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

    marker.bindPopup(`<h4 class="marker__title">${country}</h4>${count} ${popupText}`);
    // marker.mouseover = () => {
    //   console.log('!!!!');
    //   marker.openPopup();
    // };

    const container = document.querySelector('.leaflet-marker-pane');
    const elem = container.children[container.childElementCount - 1];
    elem.setAttribute('country', slug);
  }

  addMarkersByKey(key, color, title) {
    this.removeMarkers();
    if (this.countries) {
      this.countries.forEach((el) => {
        let size = ((el[key] * 100) / this.globalInfo[key]) * 8;
        size = this.checkMarkerSize(size);

        if (el.сountryCoordinates) {
          const marker = this.addMarker(
            el.slug,
            el.country,
            ...el.сountryCoordinates,
            el[key],
            [size, size],
            color,
            title,
          );
          if (marker !== undefined) this.markers.push(marker);
        }
      });
      console.log(this.markers);
    }
  }

  removeMarkers() {
    this.clearMarkerList();
    this.markers = [];
  }

  clearMarkerList() {
    const markerList = document.querySelector('.leaflet-marker-pane');
    while (markerList.childElementCount !== 0) {
      markerList.removeChild(markerList.firstChild);
    }
  }

  bindButtonsEvens() {
    const root = document.querySelector('.container__map-buttons');
    root.addEventListener('click', (e) => {
      if (e.target.classList.contains('js-confirmed-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[2]);
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-recovered-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[1], 'green', 'total recovered');
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-deaths-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[0], 'grey', 'total deaths');
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-daily-confirmed-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[4], 'red', 'daily confirmed');
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-daily-recovered-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[5], 'green', 'daily recovered');
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      } else if (e.target.classList.contains('js-daily-deaths-button')) {
        this.addMarkersByKey(Constants.TABLES_KEYS[3], 'grey', 'daily deaths');
        this.removeMapButtonActive();
        e.target.classList.add('container__map-button_active');
      }
    });
  }

  removeMapButtonActive() {
    const buttons = document.querySelectorAll('.container__map-button');
    buttons.forEach((element) => {
      element.classList.remove('container__map-button_active');
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
