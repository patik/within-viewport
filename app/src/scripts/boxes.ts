import { throttle } from 'lodash'
import { withinViewportAsync } from '../../../module/src/async/index'
import { withinViewport } from '../../../module/src/sync/index'
import { query } from './dom'
import store from './store'

const areViewportUnitsSupported = (function () {
    try {
        const div = document.createElement('div')

        div.style.width = '50vw'
        document.body.appendChild(div)

        const elemWidth = parseInt(getComputedStyle(div, null).width, 10)
        const halfWidth = parseInt(String(window.innerWidth / 2), 10)

        return elemWidth === halfWidth
    } catch (e) {
        console.error('Error when determining if the client supports viewport units: ', e)
        return false
    }
})()

function determineBoxWidth() {
    if (areViewportUnitsSupported) {
        return '18vw'
    }

    let boxWidth = 20

    // Make sure the demo will be wider than the device's screen so that vertical scroll bars appear
    //    but not so wide that you can't see at least four on screen at a time with a maximized browser window
    if (screen.width >= screen.height) {
        // Screen is wide/landscape
        boxWidth = parseInt(String((screen.width + 400) / 10), 10)
    } else {
        boxWidth = parseInt(String((screen.height + 400) / 10), 10)
    }

    return `${boxWidth}px`
}

function isFlexboxSupported() {
    return document.createElement('p').style.flex === ''
}

export function createBoxHtml() {
    const boxCount = 200
    let boxHTML = ''
    const boxWidth = determineBoxWidth()

    // Add a container and put the boxes inside
    const boxContainer = document.createElement('div')

    if (isFlexboxSupported()) {
        let i = 0
        // Generate boxes which will each be tested for their viewport within-ness
        while (i < boxCount) {
            boxHTML += '<div>&nbsp;</div>'
            i++
        }

        boxContainer.classList.add('flex')
    } else {
        let i = 0
        while (i < boxCount) {
            // Set the styles so everything is nice and proportional to this device's screen
            boxHTML += `<div style="width: ${boxWidth}; height: ${boxWidth};line-height: ${boxWidth};">&nbsp;</div>`
            i++
        }

        boxContainer.classList.add('no-flex')
        boxContainer.style.cssText = 'width:' + (parseInt(boxWidth, 10) * 10 + 20) + 'px;'
    }

    boxContainer.innerHTML = boxHTML
    boxContainer.id = 'boxContainer'

    store.getState().containerForDOM.appendChild(boxContainer)

    store.setState({
        $boxes: query('div', boxContainer),
    })

    // Update the <div>s for the first time
    updateBoxes()
}

function setBoxIsIn(box: HTMLElement) {
    box.innerHTML = 'in'
    box.setAttribute('aria-hidden', 'false')
    box.classList.add('in-view')
    box.classList.remove('out-of-view')
}

function setBoxIsOut(box: HTMLElement) {
    box.innerHTML = 'out'
    box.setAttribute('aria-hidden', 'true')
    box.classList.remove('in-view')
    box.classList.add('out-of-view')
}

// Update each box's class to reflect whether it was determined to be within the viewport or not
export function updateBoxes() {
    const { boundaries, methodType, $boxes, containerForDOM } = store.getState()
    const options = {
        ...boundaries,
        container: containerForDOM,
    }

    if (methodType === 'async') {
        $boxes.forEach((box) => {
            withinViewportAsync(box, options).then((result) => {
                if (result) {
                    setBoxIsIn(box)
                } else {
                    setBoxIsOut(box)
                }
            })
        })
    } else {
        $boxes.forEach((box) => {
            if (withinViewport(box, options)) {
                setBoxIsIn(box)
            } else {
                setBoxIsOut(box)
            }
        })
    }
}

export const throttledUpdateBoxes = throttle(updateBoxes, 100)
