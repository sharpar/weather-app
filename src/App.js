import React, { useState } from 'react';
import githubIcon from './github-mark.svg';
import './App.scss';

const CITIES = {
	dubai: { name: 'Dubai', country: 'UAE', lat: 25.055576, long: 55.144069 },
	toronto: { name: 'Toronto', country: 'Canada', lat: 43.6594, long: -79.3851 },
	sandys: { name: 'Sandys', country: 'Bermuda', lat: 32.2797, long: -64.874 },
};

function App() {
	const [currentCity, setCurrentCity] = useState('toronto');
	const cityIds = Object.keys(CITIES);

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
