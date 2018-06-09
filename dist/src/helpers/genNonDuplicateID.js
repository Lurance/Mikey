"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function genNonDuplicateID(randomLength) {
    return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
}
exports.genNonDuplicateID = genNonDuplicateID;
//# sourceMappingURL=genNonDuplicateID.js.map