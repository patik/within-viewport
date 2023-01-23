// Basically, all the JSON-able parts of an IntersectionObserverEntry
type PartialIntersectionObserverEntry = Pick<IntersectionObserverEntry, 'intersectionRatio' | 'isIntersecting'> & {
    boundingClientRect: Omit<IntersectionObserverEntry['boundingClientRect'], 'toJSON'>
} & {
    intersectionRect: Omit<IntersectionObserverEntry['intersectionRect'], 'toJSON'>
} & {
    rootBounds: Omit<IntersectionObserverEntry['rootBounds'], 'toJSON'>
}

// At left, within top, within bottom, within right
const leftEdge: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: 0,
        y: 47.1875,
        width: 195.140625,
        height: 195.140625,
        top: 47.1875,
        right: 195.140625,
        bottom: 242.328125,
        left: 0,
    },
    intersectionRect: {
        x: 0,
        y: 47.1875,
        width: 195.140625,
        height: 195.140625,
        top: 47.1875,
        right: 195.140625,
        bottom: 242.328125,
        left: 0,
    },
    intersectionRatio: 1,
    isIntersecting: true,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// At left, partially out of the top, within bottom, within right
const leftEdgePartialTop: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: 0,
        y: -43.8125,
        width: 195.140625,
        height: 195.140625,
        top: -43.8125,
        right: 195.140625,
        bottom: 151.328125,
        left: 0,
    },
    intersectionRect: {
        x: 0,
        y: 0,
        width: 195.140625,
        height: 151.328125,
        top: 0,
        right: 195.140625,
        bottom: 151.328125,
        left: 0,
    },
    intersectionRatio: 0.7755134105682373,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// At left, totally out of the top, within bottom, within right
const leftEdgeOffTop: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: 0,
        y: -236.8125,
        width: 195.140625,
        height: 195.140625,
        top: -236.8125,
        right: 195.140625,
        bottom: -41.671875,
        left: 0,
    },
    intersectionRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 },
    intersectionRatio: 0,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// At left, within top, partially off bottom, within right
const leftEdgePartiallyOffBottom: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: 0,
        y: 831.1875,
        width: 195.140625,
        height: 195.140625,
        top: 831.1875,
        right: 195.140625,
        bottom: 1026.328125,
        left: 0,
    },
    intersectionRect: {
        x: 0,
        y: 831.1875,
        width: 195.140625,
        height: 136.8125,
        top: 831.1875,
        right: 195.140625,
        bottom: 968,
        left: 0,
    },
    intersectionRatio: 0.7010849714279175,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// Should only pass with bottom:ignore + left:0, or bottom:ignore + left:ignore
// At left, within top, totally off bottom, within right
const leftEdgeTotallyOffBottom: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: 0,
        y: 990.1875,
        width: 195.140625,
        height: 195.140625,
        top: 990.1875,
        right: 195.140625,
        bottom: 1185.328125,
        left: 0,
    },
    intersectionRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 },
    intersectionRatio: 0,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// Should only pass with both left = ignore and bottom = ignore
// Partially off left, within top, totally off bottom, within right
const partialLeftTotallyOffBottom: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: -44,
        y: 990.1875,
        width: 195.140625,
        height: 195.140625,
        top: 990.1875,
        right: 151.140625,
        bottom: 1185.328125,
        left: -44,
    },
    intersectionRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 },
    intersectionRatio: 0,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// Should only pass with left:ignore
// Partially off left, within top, within bottom, within right
const partialLeft: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: -55,
        y: 685.1875,
        width: 195.140625,
        height: 195.140625,
        top: 685.1875,
        right: 140.140625,
        bottom: 880.328125,
        left: -55,
    },
    intersectionRect: {
        x: 0,
        y: 685.1875,
        width: 140.140625,
        height: 195.140625,
        top: 685.1875,
        right: 140.140625,
        bottom: 880.328125,
        left: 0,
    },
    intersectionRatio: 0.7181406617164612,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// Should pass: left:ignore + top:ignore
// Partially off left, partially off top, within bottom, within right
const partialLeftPartialTop: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: -87,
        y: -92.8125,
        width: 195.140625,
        height: 195.140625,
        top: -92.8125,
        right: 108.140625,
        bottom: 102.328125,
        left: -87,
    },
    intersectionRect: {
        x: 0,
        y: 0,
        width: 108.140625,
        height: 102.328125,
        top: 0,
        right: 108.140625,
        bottom: 102.328125,
        left: 0,
    },
    intersectionRatio: 0.290597528219223,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

// Should pass: left:ignore + top:ignore
// Partially off left, totally off top, within bottom, within right
const partialLeftTotallyOffTop: PartialIntersectionObserverEntry = {
    boundingClientRect: {
        x: -87,
        y: -253.8125,
        width: 195.140625,
        height: 195.140625,
        top: -253.8125,
        right: 108.140625,
        bottom: -58.671875,
        left: -87,
    },
    intersectionRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 },
    intersectionRatio: 0,
    isIntersecting: false,
    rootBounds: { x: 0, y: 0, width: 1073, height: 968, top: 0, right: 1073, bottom: 968, left: 0 },
}

describe.each([
    leftEdge,
    leftEdgePartialTop,
    leftEdgeOffTop,
    leftEdgePartiallyOffBottom,
    leftEdgeTotallyOffBottom,
    partialLeftTotallyOffBottom,
    partialLeft,
    partialLeftPartialTop,
    partialLeftTotallyOffTop,
])('strict mode', (variation) => {
    test('test', () => {
        // TODO
        expect(variation).toHaveProperty('rootBounds')
    })
})
