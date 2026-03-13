import { useState, useEffect } from 'react'
import Countries from './components/Countries'
import Country from './components/Country'
import Filter from './components/Filter'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [allCountryNames, setAllCountryNames] = useState([])
  const [filter, setFilter] = useState('')
  const [isTooMany, setIsTooMany] = useState(false)
  const [countryOptions, setCountryOptions] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialData => {
        setAllCountryNames(initialData.map(d => d.name.common))
      })
  }, [])

  useEffect(() => {
    if (selectedCountry === null) {
      return
    }

    // Get weather data everytime a selected country changes
    weatherService
      .getByCity(selectedCountry.capital[0], selectedCountry.cca2)
      .then(weather => {
        setWeather(weather)
      })
      .catch(error => {
        setWeather(null)
        console.log(`Failed to retrieve the weather data of ${selectedCountry.capital[0]}, ${selectedCountry.name.common}`)
      })
  }, [selectedCountry])

  const handleChange = (event) => {
    setFilter(event.target.value)

    setSelectedCountry(null)
    setCountryOptions(null)
    setIsTooMany(false)

    if (event.target.value.length === 0) {
      return
    }

    if (allCountryNames.length === 0) {
      console.log('Search ignored: Country master data is still fetching...')
      return
    }

    const results = allCountryNames.filter(name => name.toLowerCase().includes(event.target.value.toLowerCase()))
    
    if (results.length === 1) {
      getCountryDetails(results[0])
    }
    else if (results.length > 10) {
      setCountryOptions([])
      setIsTooMany(true)
    }
    else {
      setCountryOptions(results)
    }
  }

  const handleShow = (event) => {
    getCountryDetails(event.target.value)
  }

  const getCountryDetails = (name) => {
    countryService.get(name).then(data => {
      setSelectedCountry(data)
    })
  }

  return (
    <div>
      <Filter filter={filter} onChange={handleChange} />
      <Countries
        countriesToShow={countryOptions}
        isTooMany={isTooMany}
        handleShow={handleShow} />
      <Country details={selectedCountry} weather={weather} />
    </div>
  )
}

export default App
