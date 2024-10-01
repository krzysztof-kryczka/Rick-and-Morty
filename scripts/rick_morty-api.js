const API_BASE_URL_EXT = 'https://rickandmortyapi.com/api'
const API_BASE_URL = 'http://localhost:3000'

/**
 * Fetch characters from the API
 * @param {number} page - The page number to fetch
 * @param {string} name - The name to filter characters
 * @param {string} status - The status to filter characters ['alive', 'dead', 'unknown']
 * @returns {Object} - The data from the API
 */
export const fetchCharacters = async (page, name, status) => {
   const params = new URLSearchParams({
      page: page,
      limit: 5,
      name: name,
      status: status,
   })
   try {
      const response = await fetch(`${API_BASE_URL}/character/?${params.toString()}`)
      if (!response.ok) {
         throw new Error(response.status)
      }
      const data = await response.json()
      return data
   } catch (err) {
      console.error(`Something went horribly wrong 😢 : ${err.message}`)
   }
}

/**
 * Fetch 20 characters from the API
 * @returns {Object} - The data from the API
 */
export const fetchExternalCharacters = async () => {
   try {
      const response = await fetch(`${API_BASE_URL_EXT}/character`)
      if (!response.ok) {
         throw new Error(response.status)
      }
      const data = await response.json()
      return data.results.slice(0, 20).map(character => ({
         id: character.id,
         name: character.name,
         status: character.status,
         species: character.species,
         image: character.image,
      }))
   } catch (err) {
      console.error(`Something went horribly wrong 😢 : ${err.message}`)
   }
}
