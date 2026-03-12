import { useState, useEffect } from 'react'
import Countries from './components/Countries'
import Country from './components/Country'
import Filter from './components/Filter'
import countryService from './services/countries'

const App = () => {
  const [allCountryNames, setAllCountryNames] = useState([])
  const [filter, setFilter] = useState('')
  const [isTooMany, setIsTooMany] = useState(false)
  const [countryOptions, setCountryOptions] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialData => {
        setAllCountryNames(initialData.map(d => d.name.common))
      })
  }, [])

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
      countryService.get(results[0]).then(data => setSelectedCountry(data))
    }
    else if (results.length > 10) {
      setCountryOptions([])
      setIsTooMany(true)
    }
    else {
      setCountryOptions(results)
    }
  }

  return (
    <div>
      <Filter filter={filter} onChange={handleChange} />
      <Countries countriesToShow={countryOptions} isTooMany={isTooMany} />
      <Country details={selectedCountry} />
    </div>
  )
}

export default App
