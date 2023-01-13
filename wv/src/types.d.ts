export {}

declare global {
    interface Window {
        scrollTop: HTMLElement['scrollTop']
        scrollLeft: HTMLElement['scrollLeft']
        getBoundingClientRect: HTMLElement['getBoundingClientRect']
        // innerHeight: HTMLElement['innerHeight']
    }
}
