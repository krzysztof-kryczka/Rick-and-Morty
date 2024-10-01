import { fetchCharacters, fetchExternalCharacters, API_BASE_URL } from './rick_morty-api.js'
import { createHTMLElement, createButton, createImage, createInput } from './utils.js'

const statusMap = {
   alive: 'żywy',
   dead: 'martwy',
   unknown: 'nieznany',
}

/**
 * Initializes the page by creating the header, main section and footer.
 */
const initializePage = () => {
   createHeader()
   createMain()
   createFooter()
   displayCharacters()
   initializeLocalDB()
   createAddCharacterForm()
}

/**
 * Creates the header section of the page.
 */
const createHeader = () => {
   const headerContainer = document.createElement('header')
   const div = createHTMLElement('div', 'header-container')
   const header1 = createHTMLElement('h1', 'title', 'The Rick and Morty')
   div.appendChild(header1)
   headerContainer.appendChild(div)
   document.body.appendChild(headerContainer)
}

/**
 * Creates the main section of the page.
 */
const createMain = () => {
   const statuses = Object.keys(statusMap)
   const mainContainer = document.createElement('main')
   const filtersContainer = createHTMLElement('div', 'filters-container')
   const searchForm = document.createElement('form')
   const searchInput = createInput('text', 'search-input', 'name', '', 'Wyszukaj po nazwie...')
   const labelFilters = createHTMLElement('label', 'label-filters', 'Filtry: ')
   const statusContainer = createHTMLElement('div', 'status')
   const characterGalleryContainer = createHTMLElement('div', 'character-gallery-container')
   const paginationContainer = createHTMLElement('div', 'pagination-container')
   const prevButton = createButton('prevButton', '<i class="fa-solid fa-chevron-left"></i>')
   const nextButton = createButton('nextButton', '<i class="fa-solid fa-chevron-right"></i>')

   labelFilters.setAttribute('for', searchInput.id)
   searchInput.addEventListener('input', () => handleFilterSearch(searchInput))
   statusContainer.addEventListener('change', () => handleFilterSearch(searchInput))

   statuses.forEach(status => {
      const label = createHTMLElement('label', 'label-status')
      const radio = createInput('radio', `status-${status}`, 'status', status)
      if (status === 'alive') radio.checked = true
      label.setAttribute('for', radio.id)
      label.appendChild(radio)
      label.appendChild(document.createTextNode(statusMap[status].charAt(0).toUpperCase() + statusMap[status].slice(1)))
      statusContainer.appendChild(label)
   })

   searchForm.append(labelFilters, searchInput, statusContainer)
   filtersContainer.appendChild(searchForm)
   paginationContainer.append(prevButton, nextButton)
   mainContainer.append(filtersContainer, characterGalleryContainer, paginationContainer)
   document.body.appendChild(mainContainer)
}

/**
 * Handles the change in filters or search input by updating the displayed characters.
 * @param {HTMLInputElement} searchInput - The input element for the search term.
 */
const handleFilterSearch = searchInput => {
   const name = searchInput.value
   const status = document.querySelector('input[name="status"]:checked').value
   displayCharacters(1, name, status)
}

/**
 * Creates the footer section of the page.
 */
const createFooter = () => {
   const footerContainer = document.createElement('footer')
   const div = createHTMLElement('div', 'footer-container')
   const authorInfo = createHTMLElement('p', 'author-info', '© Projekt i realizacja: Krzysztof Kryczka - 2024')
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
const displayCharacters = async (page = 1, name = '', status = 'alive') => {
   const data = await fetchCharacters(page, name, status)
   const characterContainer = document.querySelector('.character-gallery-container')
   characterContainer.innerHTML = ''
   if (!data) {
      const message = createHTMLElement(
         'p',
         'message-not-found',
         '“Nie znaleziono postaci spełniających kryteria wyszukiwania”',
      )
      characterContainer.appendChild(message)
   } else {
      data.forEach(character => {
         const card = createCharacterCard(character)
         characterContainer.appendChild(card)
      })
   }
   const prevButton = document.querySelector('.prevButton')
   const nextButton = document.querySelector('.nextButton')
   if (prevButton) {
      prevButton.onclick = data.info.prev ? () => displayCharacters(page - 1, name, status) : null
      prevButton.disabled = !data.info.prev
   }
   if (nextButton) {
      nextButton.onclick = data.info.next ? () => displayCharacters(page + 1, name, status) : null
      nextButton.disabled = !data.info.next
   }
}

/**
 * Create a character card
 * @param {Object} character - The character data
 * @returns {HTMLElement} - The character card element
 */
const createCharacterCard = character => {
   const card = createHTMLElement('div', 'character-card')
   const image = createImage('character-img', character.image, character.name)
   const cardInfo = createHTMLElement('div', 'character-card-info')
   const name = createHTMLElement('h2', 'character-name', character.name)
   const status = createHTMLElement('p', 'character-status', `Status: ${character.status}`)
   const species = createHTMLElement('p', 'character-species', `Species: ${character.species}`)
   const deleteButton = createButton('delete-button', 'Usuń Postać')
   deleteButton.onclick = async () => {
      await fetch(`${API_BASE_URL}/character/${character.id}`, {
         method: 'DELETE',
      })
      displayCharacters()
   }
   cardInfo.append(name, status, species)
   card.append(image, cardInfo, deleteButton)
   return card
}

/**
 * Initializes the local database by fetching characters from an external API
 * and saving them to the local JSON Server.
 */
const initializeLocalDB = async () => {
   // const characters = await fetchExternalCharacters()
   // await saveCharactersToLocalDB(characters)
}

/**
 * Saves an array of characters to the local JSON Server.
 *
 * @param {Array} characters - The array of character objects to be saved.
 */
const saveCharactersToLocalDB = async characters => {
   for (const character of characters) {
      await fetch(`${API_BASE_URL}/character`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(character),
      })
   }
}

/**
 * Creates a form for adding a new character.
 * The form includes fields for name, status, and species,
 * and a submit button. When the form is submitted, it sends
 * a POST request to add the new character to the json db.
 */
const createAddCharacterForm = () => {
   const form = document.createElement('form')
   form.className = 'add-character-form'
   const div = createHTMLElement('div', 'create-add-character')
   const nameInput = createInput('text', 'name', 'name', '', 'Nazwa')
   const statusSelect = document.createElement('select')
   statusSelect.name = 'status'
   statusSelect.id = 'status'
   Object.entries(statusMap).forEach(([key, value]) => {
      const option = document.createElement('option')
      option.value = key
      option.textContent = value.charAt(0).toUpperCase() + value.slice(1)
      statusSelect.appendChild(option)
   })

   const speciesInput = createInput('text', 'species', 'species', '', 'Gatunek')
   const submitButton = createButton('submit', 'Dodaj postać')

   form.append(nameInput, statusSelect, speciesInput, submitButton)
   form.onsubmit = async event => {
      event.preventDefault()
      if (!nameInput.value || !speciesInput.value) {
         alert('Proszę uzupełnić wszystkie pola formularza.')
         return
      }
      const newCharacter = {
         name: nameInput.value,
         status: statusSelect.value,
         species: speciesInput.value,
         image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      }
      await fetch(`${API_BASE_URL}/character`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newCharacter),
      })
      displayCharacters()
   }
   div.appendChild(form)
   const main = document.querySelector('main')
   main.appendChild(div)
}

/**
 * Initializes the page when the window loads.
 */
window.addEventListener('load', initializePage)
