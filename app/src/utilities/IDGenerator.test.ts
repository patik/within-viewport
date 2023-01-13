import IDGenerator from './IDGenerator'

describe('IDGenerator', () => {
    test('First ID is 1', () => {
        const gen = new IDGenerator()

        expect(gen.getNext()).toBe('1')
    })

    test('First three IDs are 1, 2, 3', () => {
        const gen = new IDGenerator()
        const results = [gen.getNext(), gen.getNext(), gen.getNext()]

        expect(results).toStrictEqual(['1', '2', '3'])
    })

    test('IDs are in order', () => {
        const gen = new IDGenerator()
        const results = [gen.getNext(), gen.getNext(), gen.getNext()]
        const sorted = [...results].sort()

        expect(results).toStrictEqual(sorted)
    })
})
