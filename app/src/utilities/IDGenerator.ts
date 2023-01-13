export default class IDGenerator {
    private id = 0

    public getNext = () => {
        const nextId = this.id + 1

        this.id = nextId

        return String(nextId)
    }
}
