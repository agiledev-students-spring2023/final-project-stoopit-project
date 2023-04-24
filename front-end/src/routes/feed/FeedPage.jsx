import './FeedPage.css'
import { useEffect } from 'react'
import Card from '../../components/Card/Card'
import TopNav from '../../components/TopNav/TopNav'
import { useContext } from 'react'
import mapContext from '../../context/map'
import { calculateDistance } from '../../utils/location'
import { useState } from 'react'
import Spinner from '../../components/SpinnerLoader/SpinnerLoader'
import stoopContext from '../../context/stoop'

const FeedPage = ({ selectedRange, setSelectedRange }) => {
	const { currentPosition } = useContext(mapContext)
	const { stoops, setStoops } = useContext(stoopContext)
	const [loading, setLoading] = useState(true)

	/**
	 *  @typedef Stoop
	 *  @property {number} id
	 *	@property {{ lat: number, lng: number }} location
	 *	@property {string} title,
	 *	@property {number} timestamp UNIX Timestamp
	 *	@property {string} image
	 *	@property {string} description
	 */

	useEffect(() => {
		if (currentPosition.lat && currentPosition.lng) {
			fetch(
				`http://localhost:8080/api/stoops?lat=${currentPosition.lat}&lng=${currentPosition.lng}&range=${selectedRange}`
			)
				.then((res) => res.json())
				.then((res) => {
					function sortbytime(a, b) {
						if (a.timestamp > b.timestamp) {
							return -1
						} else if (a.timestamp < b.timestamp) {
							return 1
						} else {
							return 0
						}
					}
					res.data.sort(sortbytime)
					setStoops(res.data)
					setLoading(false)
				})
		}
	}, [selectedRange, currentPosition.lat, currentPosition.lng, setStoops])

	return (
		<>
			<TopNav
				currentPosition={currentPosition}
				stoops={stoops}
				selectedRange={selectedRange}
				setSelectedRange={setSelectedRange}
			/>
			<div className="feed">
				{loading && <Spinner />}
				{stoops.length === 0 && (
					<div key="notFound">
						No stoops found, please expand your range
					</div>
				)}
				{stoops &&
					stoops.map((stoop, index) => {
						const distanceToStoop = calculateDistance(
							currentPosition.lat,
							currentPosition.lng,
							stoop.location.lat,
							stoop.location.lng
						)
						// Show card only if it is within selectedRange
						return distanceToStoop <= selectedRange ? (
							<Card
								distanceToStoop={distanceToStoop}
								key={stoop._id}
								id={stoop._id}
								image={stoop.image}
								title={stoop.title}
								timestamp={stoop.timestamp}
								lat={stoop.location.lat}
								lng={stoop.location.lng}
								description={stoop.description}
							/>
						) : (
							<div key={stoop._id}></div>
						)
					})}
			</div>
		</>
	)
}

export default FeedPage
