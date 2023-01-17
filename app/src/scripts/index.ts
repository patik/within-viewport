import { createBoxHtml } from './boxes'
import { addEventHandlers } from './events'

// Demo code
function demo() {
    function init() {
        createBoxHtml()
        addEventHandlers()
    }

    window.addEventListener('load', init)
}

demo()
