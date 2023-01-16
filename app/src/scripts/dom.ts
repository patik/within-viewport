// Query function that returns a proper array
export function query(selector: string, node?: HTMLElement): Array<HTMLElement> {
    if (typeof node === 'undefined') {
        node = document.body
    }

    return Array.from(node.querySelectorAll(selector))
}

export function showAll(selector: string) {
    query(selector).forEach((elem) => {
        elem.style.display = elem.nodeName === 'SPAN' ? 'inline' : 'block'
    })
}

export function hideAll(selector: string) {
    query(selector).forEach((elem) => {
        elem.style.display = 'none'
    })
}

export function triggerEvent(node: HTMLElement | null, eventName: string) {
    if (!node) {
        return
    }

    // Modern browsers (as of the 2020s)
    if (typeof Event !== 'undefined') {
        node.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }))
    }
    // The first generation of standards-compliant browsers (not IE) from the 2000s
    else if (document.createEvent) {
        const evt = document.createEvent('HTMLEvents')

        if ('initEvent' in evt) {
            evt.initEvent(eventName, true, true)
        }

        if ('eventName' in evt) {
            evt.eventName = eventName
        }

        node.dispatchEvent(evt)
    }
    // IE
    else if ('createEventObject' in document && typeof document.createEventObject === 'function') {
        const evt = document.createEventObject()

        evt.eventType = eventName

        if ('fireEvent' in node && typeof node.fireEvent === 'function') {
            node.fireEvent('on' + evt.eventType, evt)
        }
    }
}
