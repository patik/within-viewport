import { Side } from '../../../package/src/common/common.types'
import { query } from './dom'

function drawTopBoundary(distStr: string) {
    query('.boundary-top').forEach((elem) => {
        elem.style.top = distStr
        elem.style.height = distStr
        elem.style.marginTop = `-${distStr}`
    })
}

function drawRightBoundary(distStr: string) {
    query('.boundary-right').forEach((elem) => {
        elem.style.right = distStr
        elem.style.width = distStr
        elem.style.marginRight = `-${distStr}`
    })
}

function drawBottomBoundary(distStr: string) {
    query('.boundary-bottom').forEach((elem) => {
        elem.style.bottom = distStr
        elem.style.height = distStr
        elem.style.marginBottom = `-${distStr}`
    })
}

function drawLeftBoundary(distStr: string) {
    query('.boundary-left').forEach((elem) => {
        elem.style.left = distStr
        elem.style.width = distStr
        elem.style.marginLeft = `-${distStr}`
    })
}

// Overlay a boundary line on the viewport when one is set by the user
export function drawBound(side: Side, dist: number) {
    const distStr = `${dist}px`

    switch (side) {
        case 'top': {
            drawTopBoundary(distStr)
            break
        }

        case 'right': {
            drawRightBoundary(distStr)
            break
        }

        case 'bottom': {
            drawBottomBoundary(distStr)
            break
        }

        case 'left': {
            drawLeftBoundary(distStr)
            break
        }

        default: {
            drawTopBoundary(distStr)
            drawRightBoundary(distStr)
            drawBottomBoundary(distStr)
            drawLeftBoundary(distStr)
            break
        }
    }
}
