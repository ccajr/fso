import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
const baseUrl = 'https://api.openweathermap.org/'

const getByCity = (cityName, countryCode) => {
    const units = 'metric'
    const request = axios.get(`${baseUrl}data/2.5/weather?q=${cityName},${countryCode}&units=${units}&appid=${api_key}`)
    return request.then(response => response.data)
}

export default { getByCity }