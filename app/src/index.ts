import { createBoxHtml } from './scripts/boxes'
import { addEventHandlers } from './scripts/events'

// Demo code
function demo() {
    function init() {
        createBoxHtml()
        addEventHandlers()
    }

    window.addEventListener('load', init)
}

demo()
