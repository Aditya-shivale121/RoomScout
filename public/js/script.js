(() => {
  'use strict';

  // Fetch all forms with validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  const previewInputs = document.querySelectorAll('[data-image-preview-input]');

  previewInputs.forEach((input) => {
    const targetId = input.dataset.imagePreviewTarget;
    const preview = targetId ? document.getElementById(targetId) : null;
    const grid = preview?.querySelector('[data-image-preview-grid]');

    if (!preview || !grid) {
      return;
    }

    let previewUrls = [];

    const revokePreviewUrls = () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls = [];
    };

    input.addEventListener('change', () => {
      revokePreviewUrls();
      grid.replaceChildren();

      const imageFiles = Array.from(input.files || []).filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length === 0) {
        preview.classList.add('d-none');
        return;
      }

      preview.classList.remove('d-none');

      imageFiles.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        previewUrls.push(imageUrl);

        const card = document.createElement('div');
        card.className = 'image-preview-card';

        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = `Preview of ${file.name}`;
        image.className = 'image-preview-thumb';

        const caption = document.createElement('span');
        caption.className = 'image-preview-caption';
        caption.textContent = file.name;

        card.append(image, caption);
        grid.append(card);
      });
    });
  });

  const locationPickerInstances = new Map();
  const locationPickers = document.querySelectorAll('[data-location-picker]');

  locationPickers.forEach((picker) => {
    const latitudeInput = document.getElementById(picker.dataset.latitudeTarget);
    const longitudeInput = document.getElementById(picker.dataset.longitudeTarget);
    const status = document.getElementById(picker.dataset.statusTarget);

    if (!window.L || !latitudeInput || !longitudeInput || !status) {
      return;
    }

    const defaultLatitude = Number(picker.dataset.defaultLatitude);
    const defaultLongitude = Number(picker.dataset.defaultLongitude);
    const initialLatitude = Number(picker.dataset.initialLatitude || latitudeInput.value);
    const initialLongitude = Number(picker.dataset.initialLongitude || longitudeInput.value);
    const hasInitialLocation = Number.isFinite(initialLatitude) && Number.isFinite(initialLongitude);
    const center = hasInitialLocation
      ? [initialLatitude, initialLongitude]
      : [
          Number.isFinite(defaultLatitude) ? defaultLatitude : 18.5204,
          Number.isFinite(defaultLongitude) ? defaultLongitude : 73.8567
        ];
    const map = L.map(picker).setView(center, hasInitialLocation ? 16 : 12);
    let marker = null;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const setLocation = (latitude, longitude, message) => {
      latitudeInput.value = latitude;
      longitudeInput.value = longitude;

      if (!marker) {
        marker = L.marker([latitude, longitude], {
          draggable: true,
          title: 'Selected room location',
          alt: 'Selected room location'
        }).addTo(map);

        marker.on('dragend', () => {
          const markerLocation = marker.getLatLng();
          setLocation(markerLocation.lat, markerLocation.lng, 'Marker moved. These coordinates will be saved.');
        });
      } else {
        marker.setLatLng([latitude, longitude]);
      }

      map.setView([latitude, longitude], Math.max(map.getZoom(), 16));
      status.textContent = message;
      status.classList.remove('is-error');
      status.classList.add('is-success');
    };

    if (hasInitialLocation) {
      setLocation(initialLatitude, initialLongitude, 'Current marker loaded. Click or drag it to adjust.');
    }

    map.on('click', (event) => {
      setLocation(event.latlng.lat, event.latlng.lng, 'Location selected on the map.');
    });

    setTimeout(() => map.invalidateSize(), 0);
    locationPickerInstances.set(picker.id, { map, setLocation });
  });

  const geolocationButtons = document.querySelectorAll('[data-geolocation-button]');

  geolocationButtons.forEach((button) => {
    const latitudeInput = document.getElementById(button.dataset.latitudeTarget);
    const longitudeInput = document.getElementById(button.dataset.longitudeTarget);
    const status = document.getElementById(button.dataset.statusTarget);
    const picker = button.dataset.pickerTarget
      ? locationPickerInstances.get(button.dataset.pickerTarget)
      : null;

    if (!latitudeInput || !longitudeInput || !status) {
      return;
    }

    button.addEventListener('click', () => {
      if (!navigator.geolocation) {
        status.textContent = 'Your browser does not support location access.';
        status.classList.add('is-error');
        return;
      }

      button.disabled = true;
      status.classList.remove('is-error', 'is-success');
      status.textContent = 'Getting your location...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (picker) {
            picker.setLocation(
              position.coords.latitude,
              position.coords.longitude,
              'Location selected from your device.'
            );
          } else {
            latitudeInput.value = position.coords.latitude;
            longitudeInput.value = position.coords.longitude;
            status.textContent = 'Location added. The map marker will use these coordinates.';
            status.classList.add('is-success');
          }

          button.disabled = false;
        },
        () => {
          status.textContent = 'Could not access your location. You can still save using the address.';
          status.classList.add('is-error');
          button.disabled = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  });

  const roomMaps = document.querySelectorAll('[data-room-map]');

  roomMaps.forEach((mapElement) => {
    if (!window.L) {
      return;
    }

    const latitude = Number(mapElement.dataset.latitude);
    const longitude = Number(mapElement.dataset.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    const map = L.map(mapElement).setView([latitude, longitude], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const title = mapElement.dataset.title || 'Room location';
    const address = mapElement.dataset.address || '';
    const popupContent = document.createElement('div');
    const popupTitle = document.createElement('strong');

    popupTitle.textContent = title;
    popupContent.append(popupTitle);

    if (address) {
      popupContent.append(document.createElement('br'), document.createTextNode(address));
    }

    L.marker([latitude, longitude], {
      title,
      alt: title
    }).addTo(map).bindPopup(popupContent).openPopup();
  });
})();
