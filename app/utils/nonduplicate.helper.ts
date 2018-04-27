export function genNonDuplicateID(randomLength) {
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}