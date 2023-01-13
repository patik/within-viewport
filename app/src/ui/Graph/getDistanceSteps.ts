export default function getDistanceSteps(units: Units, isMobile: boolean): Distance[] {
    if (units === 'imperial') {
        const allValues = Array.from(Array(101).keys())

        if (isMobile) {
            return allValues.filter((v) => v % 10 === 0)
        }

        return allValues.filter((v) => v % 5 === 0)
    }

    const allValues = Array.from(Array(26).keys())

    if (isMobile) {
        return allValues.filter((v) => v % 2 === 0)
    }

    return allValues
}
