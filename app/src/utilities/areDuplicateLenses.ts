type PartialLens = Pick<LensDefinition, 'name' | 'depthOfField'>

function areDuplicateLenses(lens1: PartialLens, lens2: PartialLens) {
    return lens1.name === lens2.name && lens1.depthOfField.dof === lens2.depthOfField.dof
}

export default areDuplicateLenses
