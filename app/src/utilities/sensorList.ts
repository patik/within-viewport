// https://en.wikipedia.org/wiki/Image_sensor_format
// 35mm diagonal / the sensor’s diagonal = crop factor
// cropFactor = 35 / (sqrt (w^2 + h^2))
const fullList = {
    iPhone5: {
        name: 'iPhone 5',
        value: 7.61,
    },
    '8mm': {
        name: 'Standard 8mm film',
        value: 7.28,
    },
    iPhone5S: {
        name: 'iPhone 5S, 6, 7, 8; and 1/3" CCD',
        value: 7.21,
    },
    TwoThirds: {
        name: '2/3″ (Nokia Lumia 1020, Fujifilm X-S1, X20, XF1)',
        value: 3.9,
    },
    iPhone13: {
        name: 'iPhone 13 (2021)',
        value: 3.71, // 42.75mm2, or 5.7x7.5mm
    },
    '16mm': {
        name: 'Standard 16mm film',
        value: 3.41,
    },
    '1in': {
        name: '1" CCD, Nikon CX, Sony RX100',
        value: 2.72,
    },
    iPhone14: {
        name: 'iPhone 14 (2022)',
        value: 2.86, // 9.8x7.3mm, or 71.54mm^2
        isCommon: true,
    },
    BlackmagicCC: {
        name: 'Blackmagic Cine Cam',
        value: 3.02,
    },
    mft: {
        name: 'Micro Four-Thirds',
        value: 2,
        isCommon: true,
    },
    '15in': {
        name: '1.5" (Canon G1 X II)',
        value: 1.92,
    },
    APSCCanon: {
        name: 'APS-C (Canon EF-S)',
        value: 1.62,
        isCommon: true,
    },
    '35mm': {
        name: 'Standard 35mm film (movie)',
        value: 1.59,
        isCommon: true,
    },
    NikonD3k: {
        name: 'Nikon D3100/D3200',
        value: 1.57,
    },
    APSC: {
        name: 'APS-C (Sony, Nikon, Pentax, Samsung)',
        value: 1.53,
        isCommon: true,
    },
    Super35: {
        name: 'Super 35mm film',
        value: 1.39,
    },
    APSH: {
        name: 'APS-H (Canon 1D)',
        value: 1.29,
        isCommon: true,
    },
    full: {
        name: 'Full Frame',
        value: 1, // 36x24 mm = 864m^2
        isCommon: true,
    },
    LeicaS: {
        name: 'Leica S',
        value: 0.8,
    },
    Medium: {
        name: 'Medium-format (Hasselblad H5D-60c, Hasselblad H6D-100c)',
        value: 0.65,
    },
    IMAX: {
        name: 'IMAX Film Frame',
        value: 0.49,
    },
}

export default fullList

// This is imported by types.d.ts so it can be used globally without importing
// ts-prune-ignore-next
export type SensorKey = keyof typeof fullList
