"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = exports.generateUniqueId = void 0;
const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateUniqueId = generateUniqueId;
const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};
exports.isValidUrl = isValidUrl;
