import React, { useEffect, useState } from 'react';
import githubIcon from './github-mark.svg';
import './App.scss';

// Ideally, this key would not be saved here. It is not secure to expose it on
// the front end, and in the code because this is a public repository.
// It should be saved in a backend API, that the React app would make a request
// to, the API would then fetch the data from Dark Sky.
// Fortunately, no payment method is attached to the account so the key will
// stop working after 1000 calls.
const DARK_SKY_KEY = 'de58b48418b7a1930004d32486ff7c93';

const CITIES = {
	dubai: { name: 'Dubai', country: 'UAE', lat: 25.0555, long: 55.1440 },
	toronto: { name: 'Toronto', country: 'Canada', lat: 43.6594, long: -79.3851 },
	sandys: { name: 'Sandys', country: 'Bermuda', lat: 32.2797, long: -64.874 },
};

// Dark Sky's icon names mapped with the icons from
// https://github.com/erikflowers/weather-icons
const ICONS = {
	'clear-day': 'day-sunny',
	'clear-night': 'night-clear',
	rain: 'rain',
	snow: 'snow',
	sleet: 'sleet',
	wind: 'strong-wind',
	fog: 'fog',
	cloudy: 'cloudy',
	'partly-cloudy-day': 'day-cloudy',
	'partly-cloudy-night': 'night-cloudy',
	hail: 'hail',
	thunderstorm: 'thunderstorm',
	tornado: 'tornado',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function App() {
	const [currentCity, setCurrentCity] = useState('toronto');
	const [weatherData, setWeatherData] = useState(null);

	// To monitor the network request state. Used to decide what to render.
	const [status, setStatus] = useState('idle');

	useEffect(() => {
		setStatus('idle');

		// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
		const abortController = new AbortController();

		const { lat, long } = CITIES[currentCity];

		const fetchData = async () => {
			// CORS issues with Dark Sky (another symptom of making the calls directly from the client):
			// https://forum.freecodecamp.org/t/solved-having-trouble-getting-response-from-dark-sky-api/100653/5
			const proxy = 'https://cors-anywhere.herokuapp.com/';
			const url = `${proxy}https://api.darksky.net/forecast/${DARK_SKY_KEY}/${lat},${long}?units=ca&exclude=[currently,minutely,hourly,flags,alerts]`;

			try {
				const response = await fetch(url, { signal: abortController.signal });
				const newWeatherData = await response.json();
				setWeatherData(newWeatherData);
				setStatus('resolved');
			} catch (error) {
				if (error.name === 'AbortError') {
					// Don't do anything. Aborting a fetch throws an error.
				} else {
					setStatus('rejected');
				}
			}
		};

		fetchData();

		// Clean up function. If the city is changed before the weather data has
		// been fetched, abort the previous request(s) to avoid showing wrong data.
		return () => {
			abortController.abort();
		};
	}, [currentCity]);

	const weatherToday = weatherData?.daily?.data[0];
	const weatherNext4Days = weatherData?.daily?.data.slice(1, 5);

	return (
		<div className="app">
			<main className="main">
				<div className="city-options">
					{Object.keys(CITIES).map((cityId) => {
						const cityInfo = CITIES[cityId];
						const isSelected = cityId === currentCity;

						return (
							<div
								key={cityInfo.name + cityInfo.country}
								className={`city ${isSelected ? 'selected' : ''}`}
								onClick={() => setCurrentCity(cityId)}
							>
								<div>{cityInfo.name}</div>
								<div className="country-name">{cityInfo.country}</div>
							</div>
						);
					})}
				</div>

				{status === 'idle' && <div>Loading the weather data...</div>}

				{status === 'rejected' && (
					<div>
						There was an error loading the weather data. Please refresh the
						page.
					</div>
				)}

				{status === 'resolved' && weatherToday && weatherNext4Days && (
					<div className="container--weather">
						<div className="container--today">
							<div className="day">Today</div>

							<div className="container--temp-and-icon">
								<i className={`wi wi-${ICONS[weatherToday.icon]}`} />
								<span className="temp">
									{Math.round(weatherToday.temperatureMax)}°
								</span>
							</div>

							<div>{weatherToday.summary}</div>
						</div>

						<div className="container--week">
							{weatherNext4Days.map((day) => {
								const date = new Date(day.time * 1000);
								const dayOfTheWeek = DAYS[date.getDay()];

								return (
									<div key={day.time} className="day-forecast">
										<div className="day">{dayOfTheWeek}</div>
										<i className={`wi wi-${ICONS[day.icon]}`} />
										<div className="temp">
											{/* Ideally both low and high would be shown, for design
													purposes, only showing one. */}
											{Math.round(day.temperatureHigh)}°
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</main>

			<footer>
				<a className="link" href="https://darksky.net/dev">
					Powered by Dark Sky
				</a>
				<a href="https://github.com/sharpar/weather-app">
					<img
						alt="Link to the Github repository for this app."
						className="github-mark"
						height={25}
						src={githubIcon}
						width={25}
					/>
				</a>
			</footer>
		</div>
	);
}

export default App;
