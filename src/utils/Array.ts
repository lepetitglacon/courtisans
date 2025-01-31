Array.prototype.remove = function(array) {
    const index = this.indexOf(array)
    if (index !== -1) {
        this.splice(index, 1)
    }
    return this
}

declare global {
    export interface Array<T> {
        remove(array: Array): Array<T>;
    }
}