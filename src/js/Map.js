import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Constants } from './Constants';

class Map {
  constructor(countries, globalInfo) {
    this.container = document.querySelector('.container__infected-map');
    this.countries = [...countries];
    this.globalInfo = globalInfo;
    this.markers = [];
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

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = (map) => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML += `<ul style="position: relative; list-style: none; display: flex; background: rgba(255, 255, 255, 0.7); margin: 0; padding: 5px;">
      <li style="margin-right: 5px;"><img style="position: relative; top: 5px;" src="../assets/images/red-circle.png" width="20" height="20"> - Confirmed</li>
      <li style="margin-right: 5px;"><img style="position: relative; top: 5px;" src="../assets/images/green-circle.png" width="20" height="20"> - Recovered</li>
      <li><img style="position: relative; top: 5px;" src="../assets/images/grey-circle.png" width="20" height="20"> - Deaths</li>
      </ul>`;
      return div;
    };
    legend.addTo(this.map);
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
    const iconOptions = {
      iconUrl: `../assets/images/${iconColor}-circle.png`,
      iconSize,
    };
    const customIcon = L.icon(iconOptions);
    const markerOptions = {
      title: `${country} ${count} ${popupText}`,
      clickable: true,
      riseOnHover: true,
      draggable: false,
      icon: customIcon,
    };

    const marker = L.marker([parseFloat(Latitude), parseFloat(Longitude)], markerOptions);
    marker.addTo(this.map);
    marker.bindPopup(`<h4 class="marker__title">${country}</h4>${count} ${popupText}`);

    const container = document.querySelector('.leaflet-marker-pane');
    const elem = container.children[container.childElementCount - 1];
    elem.setAttribute('country', slug);
    this.markers.push(marker);
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
      const categoryIndex = +(e.target.getAttribute('category-id'));
      this.addMarkersByKey(
        Constants.TABLES_KEYS[categoryIndex],
        Constants.CATEGORY_COLORS[categoryIndex],
        Constants.TABLES_CATEGORY[categoryIndex],
      );
      this.removeMapButtonActive();
      e.target.classList.add('container__map-button_active');
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

  move(coords) {
    this.map.flyTo(coords);

    const popup = this.markers.find(
      (el) => (
        // eslint-disable-next-line no-underscore-dangle
        (el._latlng.lat === coords[0]) && (el._latlng.lng === coords[1])),
    );
    popup.openPopup();
  }
}

export default Map;
