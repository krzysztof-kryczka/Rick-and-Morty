import { fetchCharacters } from './rick_morty-api.js'

/**
 * Initializes the page by creating the header, main section and footer.
 */
const initializePage = () => {
   createHeader()
   createMain()
   createFooter()
   displayCharacters()
}

/**
 * Creates the header section of the page.
 */
const createHeader = () => {
   const headerContainer = document.createElement('header')
   const div = document.createElement('div')
   const header1 = document.createElement('h1')
   header1.textContent = 'The Rick and Morty'
   div.appendChild(header1)
   headerContainer.appendChild(div)
   document.body.appendChild(headerContainer)
}

/**
 * Creates the main section of the page.
 */
const createMain = () => {
   const mainContainer = document.createElement('main')
   const filtersContainer = document.createElement('div')
   filtersContainer.classList.add('filters-container')
   const searchForm = document.createElement('form')
   const searchInput = document.createElement('input')
   searchInput.id = 'search-input'
   searchInput.type = 'text'
   searchInput.placeholder = 'Search by name...'
   const labelFilters = document.createElement('label')
   labelFilters.textContent = 'Filters: '
   labelFilters.setAttribute('for', searchInput.id)
   const statusContainer = document.createElement('div')
   statusContainer.classList.add('status')
   const statuses = ['alive', 'dead', 'unknown']
   statuses.forEach(status => {
      const label = document.createElement('label')
      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = 'status'
      radio.id = `status-${status}`
      radio.value = status
      if (status === 'alive') radio.checked = true
      label.setAttribute('for', radio.id)
      label.appendChild(radio)
      label.appendChild(document.createTextNode(status.charAt(0).toUpperCase() + status.slice(1)))
      statusContainer.appendChild(label)
   })
   searchForm.append(labelFilters, searchInput, statusContainer)
   filtersContainer.appendChild(searchForm)

   const characterGalleryContainer = document.createElement('div')
   characterGalleryContainer.classList.add('character-gallery-container')

   const paginationContainer = document.createElement('div')
   paginationContainer.classList.add('pagination-container')
   const prevButton = document.createElement('button')
   prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
   prevButton.classList.add('prevButton')
   const nextButton = document.createElement('button')
   nextButton.classList.add('nextButton')
   nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
   paginationContainer.append(prevButton, nextButton)

   mainContainer.append(filtersContainer, characterGalleryContainer, paginationContainer)
   document.body.appendChild(mainContainer)
}

/**
 * Creates the footer section of the page.
 */
const createFooter = () => {
   const footerContainer = document.createElement('footer')
   const div = document.createElement('div')
   const authorInfo = document.createElement('p')
   authorInfo.textContent = '© Projekt i realizacja: Krzysztof Kryczka - 2024'
   div.appendChild(authorInfo)
   footerContainer.appendChild(div)
   document.body.appendChild(footerContainer)
}

/**
 * Display characters
 * @param {number} page - The page number to display
 * @param {string} name - The name to filter characters by
 * @param {string} status - The status to filter characters by
 */
const displayCharacters = async (page = 1, name = 'Rick', status = 'alive') => {
   const data = await fetchCharacters(page, name, status)
   const characterContainer = document.querySelector('.character-gallery-container')
   characterContainer.innerHTML = ''
   if (!data || data.results.length === 0) {
      const message = document.createElement('p')
      message.textContent = '“No results match your search criteria”'
      characterContainer.appendChild(message)
   } else {
      data.results.forEach(character => {
         console.log(character)
         const card = createCharacterCard(character)
         characterContainer.appendChild(card)
      })
   }

   const prevButton = document.querySelector('.prevButton')
   const nextButton = document.querySelector('.nextButton')

   if (prevButton) {
      prevButton.disabled = !data.info.prev
      prevButton.removeEventListener('click', () => {
         displayCharacters(page - 1, name, status)
      })
      if (data.info.prev) {
         prevButton.addEventListener('click', () => {
            displayCharacters(page - 1, name, status)
         })
      }
   }

   if (nextButton) {
      nextButton.disabled = !data.info.next
      nextButton.removeEventListener('click', () => {
         displayCharacters(page + 1, name, status)
      })
      if (data.info.next) {
         nextButton.addEventListener('click', () => {
            displayCharacters(page + 1, name, status)
         })
      }
   }
}

/**
 * Create a character card
 * @param {Object} character - The character data
 * @returns {HTMLElement} - The character card element
 */
function createCharacterCard(character) {
   const card = document.createElement('div')
   const image = document.createElement('img')
   image.src = character.image
   image.alt = character.name
   const cardInfo = document.createElement('div')
   const name = document.createElement('h2')
   name.textContent = character.name
   const status = document.createElement('p')
   status.textContent = `Status: ${character.status}`
   const species = document.createElement('p')
   species.textContent = `Species: ${character.species}`
   cardInfo.append(name, status, species)

   card.append(image, cardInfo)
   return card
}

/**
 * Initializes the page when the window loads.
 */
window.addEventListener('load', initializePage)
