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
