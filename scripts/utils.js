/**
 * Update the state of a button
 * @param {HTMLElement} button - The button element to update
 * @param {boolean} condition - The condition to enable or disable the button
 * @param {Function} handler - The event handler function to attach or detach
 */
export const updateButtonState = (button, condition, handler) => {
   button.disabled = !condition
   button.removeEventListener('click', handler)
   if (condition) {
      button.addEventListener('click', handler)
   }
}

/**
 * Creates a text element with specified tag name, class names, and text content.
 *
 * @param {string} tagName - The tag name for the text element (e.g., 'p', 'span', 'label', 'i', etc).
 * @param {string} className - The class name to add to the container.
 * @param {string} [text=''] - The text content for the text element.
 * @returns {TextElement} - The created text element.
 */
export const createHTMLElement = (tagName, className, text = '') => {
   const element = document.createElement(tagName)
   element.innerText = `${text}`
   element.classList.add(className)
   return element
}

/**
 * Creates a button element with specified text and class name.
 *
 * @param {string} className - The class name to add to the button.
 * @param {string} text - The text to display inside the button.
 * @returns {HTMLButtonElement} - The created button element.
 */
export const createButton = (className, text) => {
   const button = document.createElement('button')
   button.innerHTML = `${text}`
   button.classList.add(className)
   return button
}

/**
 * Creates an image element with specified class name, source URL, and alt text.
 *
 * @param {string} className - The class name to add to the image element.
 * @param {string} src - The source URL for the image.
 * @param {string} alt - The alt text for the image.
 * @returns {HTMLImageElement} - The created image element.
 */
export const createImage = (className, src, alt) => {
   const img = document.createElement('img')
   img.classList.add(className)
   img.src = `${src}`
   img.alt = `${alt}`
   return img
}

/**
 * Creates an input element with specified attributes.
 *
 * @param {string} type - The type of the input element.
 * @param {string} id - The id of the input element.
 * @param {string} [placeholder] - The placeholder text for the input element.
 * @returns {HTMLInputElement} - The created input element.
 */
export const createInput = (type, id, name, value='', placeholder = '') => {
   const input = document.createElement('input')
   input.type = `${type}`
   input.id = `${id}`
   input.name = `${name}`
   if (value !== '') {
      input.value = `${value}`
   }
   if (placeholder !== '') {
      input.placeholder = `${placeholder}`
   }
   return input
}
