const API_BASE_URL = 'https://rickandmortyapi.com/api'

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
