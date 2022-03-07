export default interface Service {
    handleAll<T>(): T
    handleCreate<T>(payload: T): T
    handleUpdate<T>(payload: T, id: number): T
    handleDelete<T>(id: number): T
}