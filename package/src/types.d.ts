// This is what the user provides, and nothing is required
type Options = {
    focalLength?: number
    aperture?: string | number
    cropFactor?: number
    id?: string
}

// These are used internally by the Lens instance and all properties are defined
type Settings = {
    focalLength: number
    aperture: number
    cropFactor: number
    id?: string
}

type ApertureString = `f/${string}`

type DefaultOptions = {
    focalLength: Settings['focalLength']
    aperture: ApertureString
    cropFactor: Settings['cropFactor']
    id: Options['id']
}

type DoFResult = {
    dof: number // The length of the depth of field
    focalLengthEquiv: number // The focal length in 35mm-equivalency
    eighthDof: number // One-eighth of the depth of field
    hf: number // Hyperfocal distance
    near: number // DoF near limit
    far: number // DoF far limit
    coc: number // Circle of confusion
    toString: () => string
}
