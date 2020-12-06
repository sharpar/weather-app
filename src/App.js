import React, { useState, useEffect } from 'react';
import githubIcon from './github-mark.svg';
import sampleData from './sampleData.json';
import './App.scss';

// Ideally, this key would not be saved here. It is not secure to expose it on
// the front end and in the code because this will be a public repository.
// It should be saved in a backend API, that the React app would make a request
// to, the API would then fetch the data from Dark Sky.
// Fortunately, no payment method is attached to the account so the key will
// stop working after a 1000 calls.
const DARK_SKY_KEY = 'de58b48418b7a1930004d32486ff7c93';

const CITIES = {
	dubai: { name: 'Dubai', country: 'UAE', lat: 25.055576, long: 55.144069 },
	toronto: { name: 'Toronto', country: 'Canada', lat: 43.6594, long: -79.3851 },
	sandys: { name: 'Sandys', country: 'Bermuda', lat: 32.2797, long: -64.874 },
};

function App() {
	const [currentCity, setCurrentCity] = useState('toronto');
	const [weatherData, setWeatherData] = useState(null);

	useEffect(() => {
		console.log(`Lets fetch data for ${currentCity}!`);
		const { lat, long } = CITIES[currentCity];

		async function fetchData() {
			// CORS issues with dark sky (another symptom of making the calls
			// directly from the client):
			// https://forum.freecodecamp.org/t/solved-having-trouble-getting-response-from-dark-sky-api/100653/5
			const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${DARK_SKY_KEY}/${lat},${long}?units=ca`;

			const result = await fetch(url);

			const data = await result.json();
			console.log({ result, data });
			return data;
		}

		fetchData()
			.then((data) => setWeatherData(data))
			.catch((err) => {
				console.log(err);
				// alert(
				// 	'Fetching weather failed, using dummy data. ' +
				// 		'Please refresh page to try again.',
				// );
				setWeatherData(sampleData);
			});
	}, [currentCity]);

	return (
		<div className="App">
			<main className="main">
				<div className={'city-options'}>
					{cityIds.map((cityId) => {
						const cityInfo = CITIES[cityId];
						const isSelected = cityId === currentCity;

						return (
							<div
								key={cityInfo.name + cityInfo.country}
								className={`city ${isSelected ? 'selected' : ''}`}
								onClick={() => setCurrentCity(cityId)}
							>
								<div className="city-name">{cityInfo.name}</div>
								<div className="country-name">{cityInfo.country}</div>
							</div>
						);
					})}
				</div>

				<div className="container--weather">
					<div className="current-weather">Today</div>
					<div className="container--week-forecast">
						<div className="day-forecast">Wed 17</div>
						<div className="day-forecast">Thu 12</div>
						<div className="day-forecast">Fri -1</div>
						<div className="day-forecast">Sat 23</div>
					</div>
				</div>
			</main>

			<footer>
				<a className="link" href="https://darksky.net/dev">
					Powered by Dark Sky
				</a>
				<a href="https://github.com/sharpar/weather-app">
					<img
						className="github-mark"
						src={githubIcon}
						alt="Link to the Github repository for this app."
					/>
				</a>
			</footer>
		</div>
	);
}

export default App;
