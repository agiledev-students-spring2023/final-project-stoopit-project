export function initMap({ stoops, ref, center }) {
	const map = new window.google.maps.Map(ref.current, {
		center,
		zoom: 18,
		disableDefaultUI: true,
		styles: [
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }]
			}
		]
	})
	return map
}


//variable that saves previous infowindow
let currentInfoWindow = null

export function renderMarker({ stoop, map }) {
	const infoWindow = new window.google.maps.InfoWindow({
		content: formatInfoWindow(stoop)
	})

	const marker = new window.google.maps.Marker({
		position: stoop.location,
		map,
		title: stoop.title
	})
	marker.addListener('click', (e) => {
		if (currentInfoWindow) {
			currentInfoWindow.close()
		  }
		currentInfoWindow = infoWindow

		infoWindow.open({
			anchor: marker,
			map
		})
	})
	window.google.maps.event.addListener(map, 'click', function (event) {
		infoWindow.close()
	})
	return { marker, infoWindow }
}

export function renderInitMarkers({ stoops, map }) {
	stoops.map((stoop) => {
		return renderMarker({ stoop, map })
	})
}

export function formatInfoWindow(stoop) {
	const title = stoop.title
	const content = stoop.description
	return `
        <div class="infowindow" id="content-${stoop.id}">
            <div>
                <h3 class="infowindow-title">${title}</h3>
            </div>
            <div class="infowindow-image">
                <img src="${stoop.image}">
            </div>
            <div>
                <p class="infowindow-description">${content}<p>
            </div>
        </div>
    `
}
