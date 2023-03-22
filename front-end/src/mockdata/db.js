// mock data for map

export const store_data = (
	lat,
	lng,
	locationName,
	title,
	date,
	image,
	description
) => {
	const min = 1000000 // minimum 7-digit number
	const max = 9999999 // maximum 7-digit number
	const id = Math.floor(Math.random() * (max - min + 1)) + min
	// add to db
	Stoops.push({
		id: id,
		location: { lat: lat, lng: lng },
		locationName: locationName,
		title: title,
		date: date,
		image: image,
		description: description
	})
}

export const Stoops = [
	{
		id: '1234567',
		location: { lat: 40.7209, lng: -73.9961 },
		locationName: '123 Main St, New York, NY 10001',
		title: 'Red Sofa',
		date: 'Mar 1, 2023',
		image: 'https://stoopit-data.s3.us-east-2.amazonaws.com/mockdata/redsofa.jpg',
		description: 'Red sofa, in pristine condition.'
	},
	{
		id: '1345912',
		location: { lat: 40.7259, lng: -73.9921 },
		locationName: '456 Main St, New York, NY 10001',
		title: 'Blue Sofa',
		date: 'Feb 1, 2023',
		image: 'https://stoopit-data.s3.us-east-2.amazonaws.com/mockdata/bluesofa.webp',
		description: 'Blue sofa, in moderate condition, needs cleaning.'
	}
]
