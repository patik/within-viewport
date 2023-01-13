type LensName = LensDefinition['name']

// The Nivo chart needs a unique name for each lens because it uses that name as a React `key`. Also, it could be confusing for the user until they change one of the names.
export default function getUniqueLensNames(lenses: LensDefinition[]): Record<LensDefinition['id'], LensName> {
    const uniqueNameMap: Record<LensDefinition['id'], LensDefinition['name']> = {}

    const getUniqueName = (name: LensName): LensName => {
        if (Object.values(uniqueNameMap).includes(name)) {
            return getUniqueName(`${name} (2)`)
        }

        return name
    }

    lenses.forEach((lens) => {
        uniqueNameMap[lens.id] = getUniqueName(lens.name)
    })

    return uniqueNameMap
}
