// Get a reference to hexInput and inputColor DOM elements
const hexInput = document.getElementById('hexInput')
const errorMessage = document.getElementById('errorMessage')
const inputColor = document.getElementById('inputColor')
const alteredColor = document.getElementById('alteredColor')
const alteredColorText = document.getElementById('alteredColorText')

// Get a reference to the slider and sliderText DOM elements
const slider = document.getElementById('slider')
const sliderText = document.getElementById('sliderText')

// Get a reference to lightenText, darkenText, and toggleBtn
const lightenText = document.getElementById('lightenText')
const darkenText = document.getElementById('darkenText');
const toggleBtn = document.getElementById('toggleBtn');

// Create a keyup event handler for hexInput
hexInput.addEventListener('keyup', () => {
    // Hide error message if needed
    if (errorMessage.classList.contains('show-error-message')) {
        errorMessage.classList.remove('show-error-message')
        errorMessage.classList.add('hide-error-message')
    }

    const hex = hexInput.value.trim();

    // Check if hex color is valid
    if (!isValidHex(hex)) return

    // If hex color is valid, update the background color of inputColor
    inputColor.style.backgroundColor = hex;

    // Call reset in hexInput keyup handler 
    reset()
})

// Create an event listener for the toggle btn
toggleBtn.addEventListener('click', () => {
    // Display error if the input is invalid
    if (!isValidHex(hexInput.value.trim())) {
        if (errorMessage.classList.contains('hide-error-message')) {
            errorMessage.classList.remove('hide-error-message')
            errorMessage.classList.add('show-error-message')
        }
        return
    }

    // Toggle between lighten and darken text
    if (toggleBtn.classList.contains('toggled')) {
        toggleBtn.classList.remove('toggled')
        lightenText.classList.remove('unselected')
        darkenText.classList.add('unselected')
    } else {
        toggleBtn.classList.add('toggled')
        lightenText.classList.add('unselected')
        darkenText.classList.remove('unselected')
    }

    // Call reset in toggleBtn click handler 
    reset()
})

// Create an input event listener for slider element
slider.addEventListener('input', () => {
    // Display error and disable the slider if the input is invalid
    const hexInputValue = hexInput.value.trim();

    if (!isValidHex(hexInputValue)) {
        // alert('Please entern a valid Hex string')
        if (errorMessage.classList.contains('hide-error-message')) {
            errorMessage.classList.remove('hide-error-message')
            errorMessage.classList.add('show-error-message')
        }
        slider.disabled = true
        reset(false)
    } else {
        if (errorMessage.classList.contains('show-error-message')) {
            errorMessage.classList.remove('show-error-message')
            errorMessage.classList.add('hide-error-message')
        }

        // Display the value of the slider 
        sliderText.textContent = `${slider.value}%`

        // Calculate the appropriate for the color lteration between positive and negative
        const valueAddition = toggleBtn.classList.contains('toggled') ? -slider.value : slider.value

        // Get the altered hex value
        const alteredHex = alterColor(hexInputValue, valueAddition)

        // Update the altered color
        alteredColor.style.backgroundColor = alteredHex;
        alteredColorText.innerText = `Altered Color ${alteredHex}`
    }
})

// Check to see if the input from the user is a valid hex color
/* 1. A valid hex color can be either #000000 or 000000 
 * 2. Check the length - should be either 3 or 6 characters
 * 3. Each character in the input must be between [0, 9] or [a, z]
 */
const isValidHex = (hex) => {
    // Input string is empty
    if (!hex || hex[0] != '#') return false

    // Strip out the starting '#'
    /* If the input does not start with '#', 
     * replace() will search for the very first '#' existing in the string 
     * and replace it with ' '
     */
    const strippedHex = hex.replace('#', '')
    // console.log(strippedHex)

    // Make sure that the remaining input string is 3 or 6 length
    if (strippedHex.length !== 3 && strippedHex.length !== 6) return false
    // console.log(strippedHex)

    // Make sure that the remaining input string contains only letter from a-f, A-F and/or digits from 0-9.
    /* https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation */
    let regex = /^([0-9A-Fa-f]{3}){1,2}$/i
    return (regex.test(strippedHex))
}

// Create a function to convert Hex to RGB
/* 1. This should work with 3 or 6 character hex values
 * 2. Hint - useParseInt(16) to convert a hex value to a decimal value should return an object with 3 properties - r,g, and b
 * 3. Test your function with a few different use cases 
 */
const convertHexToRGB = (hex) => {
    // Check if hex color is valid
    if (!isValidHex(hex)) return null

    // Strip off the '#' of the input string
    let strippedHex = hex.replace('#', '')

    // Convert a hex value to a decimal value
    if (strippedHex.length === 3) {
        strippedHex = strippedHex[0] + strippedHex[0]
            + strippedHex[1] + strippedHex[1]
            + strippedHex[2] + strippedHex[2]
    }

    // Get the R, G, B values
    /* strippedHex.substring(0, 2) returns the 1st 2 values of strippedHex[0] and strippedHex[1]
     * strippedHex.substring(2, 4) returns the 1st 2 values of strippedHex[2] and strippedHex[3]
     * strippedHex.substring(4, 6) returns the 1st 2 values of strippedHex[4] and strippedHex[5]
     */
    const r = parseInt(strippedHex.substring(0, 2), 16)
    const g = parseInt(strippedHex.substring(2, 4), 16)
    const b = parseInt(strippedHex.substring(4, 6), 16)

    return { r, g, b }
}

// Create a function convert RGB to hex
/* 1. Take in 3 parameters - r,g, and b
 * 2. For each (r,g,b) - create a hex pair that is two characters long
 * 3. Return hex value starting with a hashtag
 * example - r.toString(16)
 */
const convertRGBToHex = (r, g, b) => {
    // Create hex pairs, each is two characters long
    /* Regardless how many chars .toString(16) may return,
     * we'll add a leading 0 to it.
     * Then, .slice(-2) will give us the last 2 chars of '0' + str.toString(16)
     */
    const hexPairR = ('0' + r.toString(16)).slice(-2)
    const hexPairG = ('0' + g.toString(16)).slice(-2)
    const hexPairB = ('0' + b.toString(16)).slice(-2)

    // Get the hex
    const hex = '#' + hexPairR + hexPairG + hexPairB
    return hex
}

// Create the alterColor function which accepts hex value and percentage
/* 1. Convert the hex value to rgb
 * 2. Increase each r,g,b value by appropriate amount (percentage of 255)
 * 3. Use the new r,g,b values to convert to a hex value
 * return the hex value
 */
const alterColor = (hex, percentage) => {
    // Convert the hex value to rgb
    const { r, g, b } = convertHexToRGB(hex)

    // Calc how much we need to add to r, g, b
    const amount = Math.floor((percentage / 100) * 255)

    // Get the new version of {r, g, b}
    const newR = increaseWithin0To255(r, amount)
    const newG = increaseWithin0To255(g, amount)
    const newB = increaseWithin0To255(b, amount)
    // console.log({newR, newG, newB})
    return convertRGBToHex(newR, newG, newB)
}

// Ensure Hex value stays between 0 and 255
const increaseWithin0To255 = (hex, amount) => {
    // const newHex = hex + amount
    // if (newHex > 255) return 255
    // if (newHex < 0) return 0
    // return newHex

    return Math.min(255, Math.max(0, hex + amount))
}

// Reset everything each time we toggle the button
const reset = (validInput = true) => {
    // Set slider value to 0 and slider text to 0%
    slider.value = 0
    // Enable the slider again
    slider.disabled = false
    sliderText.innerText = `0%`
    // Set altered color to original input color
    alteredColor.style.backgroundColor = hexInput.value.trim()
    // Reset alteredColorText to original input
    if(validInput) alteredColorText.innerText = `Altered Color ${hexInput.value.trim()}`
}