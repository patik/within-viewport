import { createBoxHtml } from './scripts/boxes'
import { eventsInit } from './scripts/events'

// Demo code
function demo() {
    function init() {
        createBoxHtml()
        eventsInit()
    }

    window.addEventListener('load', init)
}

demo()
