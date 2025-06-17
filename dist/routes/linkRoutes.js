"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkController_1 = __importDefault(require("../controllers/linkController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
const linkController = new linkController_1.default();
const authController = new authController_1.default();
// Route to create a new shortened link (authenticated)
router.post('/shorten', authController.authenticate.bind(authController), linkController.createLink);
// Route to get the user's link dashboard (authenticated)
router.get('/dashboard', authController.authenticate.bind(authController), linkController.getUserLinks);
// Route to handle expired links
router.get('/expired', linkController.getExpiredLinks);
// Route to retrieve a specific link by its shortened URL (public)
router.get('/:shortenedUrl', linkController.getLink);
exports.default = router;
