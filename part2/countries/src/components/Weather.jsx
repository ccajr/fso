const Weather = ({ details }) => {
    if (details === null)
        return null

    return (
        <div>
            <h2>Weather in {details.name}</h2>
            <p>Temperature {details.main.temp} Celsius</p>
            <p>Feels like {details.main.feels_like} Celsius</p>
            <img
                src={`https://openweathermap.org/payload/api/media/file/${details.weather[0].icon}.png`}
                alt={details.weather[0].description} />
            <p>Wind {details.wind.speed} m/s</p>
            <p>Humidity {details.main.humidity} %</p>
        </div>
    )
}

export default Weather