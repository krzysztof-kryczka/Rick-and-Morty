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
