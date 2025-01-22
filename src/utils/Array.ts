export default Array.prototype.remove = function(array) {
    const index = this.indexOf(array)
    if (index !== -1) {
        this.splice(index, 1)
    }
    return this
}