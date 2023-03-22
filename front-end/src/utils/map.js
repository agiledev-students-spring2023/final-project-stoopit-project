import EXIF from 'exif-js'

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

export function renderMarker({ stoop, map }) {
	const infoWindow = new window.google.maps.InfoWindow({
		content: formatInfoWindow(stoop)
	})
	const marker = new window.google.maps.Marker({
		position: stoop.location,
		map,
		title: stoop.title
	})
	marker.addListener('click', () => {
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

export function calculateDistance(lat1, lon1, lat2, lon2) {
	const R = 3958.8 // Earth's radius in miles
	const dLat = (lat2 - lat1) * (Math.PI / 180)
	const dLon = (lon2 - lon1) * (Math.PI / 180)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = R * c
	return distance
}

export const getExifLocation = (file) => {
	return new Promise((resolve, reject) => {
		EXIF.getData(file, function () {
			const lat = EXIF.getTag(this, 'GPSLatitude')
			const lon = EXIF.getTag(this, 'GPSLongitude')
			const latRef = EXIF.getTag(this, 'GPSLatitudeRef')
			const lonRef = EXIF.getTag(this, 'GPSLongitudeRef')

			if (lat && lon && latRef && lonRef) {
				const latitude = convertDMSToDD(lat[0], lat[1], lat[2], latRef)
				const longitude = convertDMSToDD(lon[0], lon[1], lon[2], lonRef)
				resolve({ lat: latitude, lng: longitude })
			} else {
				reject(new Error('No location data found in the image'))
			}
		})
	})
}

const convertDMSToDD = (degrees, minutes, seconds, direction) => {
	let dd = degrees + minutes / 60 + seconds / (60 * 60)

	if (direction === 'S' || direction === 'W') {
		dd = dd * -1
	}
	return dd
}
