"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.RequestType = void 0;
var RequestType;
(function (RequestType) {
    RequestType["ADD"] = "Th\u00EAm h\u1ECDc ph\u1EA7n";
    RequestType["DELETE"] = "X\u00F3a h\u1ECDc ph\u1EA7n";
})(RequestType || (exports.RequestType = RequestType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "Ch\u1EDD x\u1EED l\u00FD";
    RequestStatus["APPROVED"] = "\u0110\u00E3 duy\u1EC7t";
    RequestStatus["REJECTED"] = "T\u1EEB ch\u1ED1i";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
