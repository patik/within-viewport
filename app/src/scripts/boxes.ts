import { withinViewportAsync } from '../../../package/src/async/index'
import { withinViewport } from '../../../package/src/sync/index'
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
        console.error('[areViewportUnitsSupported] ', e)
        return false
    }
})()

function determineBoxWidth() {
    if (areViewportUnitsSupported) {
        return '23vw'
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

export function setSideStrategy(value: 'all' | 'independent') {
    store.setState({
        sideStrategy: value,
    })
}

export function setMethod(value: 'async' | 'sync') {
    store.setState({
        method: value,
    })
}

export function createBoxHtml() {
    const boxCount = 200
    let boxHTML = ''
    const boxWidth = determineBoxWidth()

    // Add a container and put the boxes inside
    const boxContainer = document.createElement('div')
    boxContainer.id = 'boxContainer'

    if (isFlexboxSupported()) {
        let i = 0
        // Generate boxes which will each be tested for their viewport within-ness
        while (i < boxCount) {
            boxHTML += '<div aria-hidden="false">&nbsp;</div>'

            i++
        }

        boxContainer.classList.add('flex')
    } else {
        let i = 0
        while (i < boxCount) {
            // Set the styles so everything is nice and proportional to this device's screen
            boxHTML +=
                '<div aria-hidden="false" style="width:' +
                boxWidth +
                ';height:' +
                boxWidth +
                ';line-height:' +
                boxWidth +
                ';">&nbsp;</div>'
            i++
        }

        boxContainer.classList.add('no-flex')
        boxContainer.style.cssText = 'width:' + (parseInt(boxWidth, 10) * 10 + 20) + 'px;'
    }

    boxContainer.innerHTML = boxHTML
    store.getState().containerForDOM.appendChild(boxContainer)

    // Update the <div>s for the first time

    store.setState({
        $boxes: query('div', boxContainer),
    })

    updateBoxes()
}

function setBoxIsIn(box: HTMLElement) {
    box.innerHTML = 'in'
    box.setAttribute('aria-hidden', 'false')
    box.classList.add('inview')
}

function setBoxIsOut(box: HTMLElement) {
    box.innerHTML = 'out'
    box.setAttribute('aria-hidden', 'true')
    box.classList.remove('inview')
}

// Update each box's class to reflect whether it was determined to be within the viewport or not
export function updateBoxes() {
    const { sideStrategy, wvOptions, method, $boxes } = store.getState()
    const options =
        sideStrategy === 'all'
            ? {
                  top: wvOptions.all,
                  right: wvOptions.all,
                  bottom: wvOptions.all,
                  left: wvOptions.all,
              }
            : wvOptions

    if (method === 'async') {
        $boxes.forEach(function (box) {
            withinViewportAsync(box, options).then((result) => {
                if (result) {
                    setBoxIsIn(box)
                } else {
                    setBoxIsOut(box)
                }
            })
        })
    } else {
        $boxes.forEach(function (box) {
            if (withinViewport(box, options)) {
                setBoxIsIn(box)
            } else {
                setBoxIsOut(box)
            }
        })
    }
}
