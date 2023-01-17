import { createBoxHtml } from './boxes'
import { addEventHandlers } from './events'
import store from './store'

// Demo code
function demo() {
    function init() {
        const $codeOutput = document.querySelector('.code-output code')

        if ($codeOutput) {
            store.setState({
                $codeOutput,
            })
        }

        createBoxHtml()
        addEventHandlers()
    }

    window.addEventListener('load', init)
}

demo()
