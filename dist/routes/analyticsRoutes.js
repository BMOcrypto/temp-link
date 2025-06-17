"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = __importDefault(require("../controllers/analyticsController"));
const router = (0, express_1.Router)();
const analyticsController = new analyticsController_1.default();
// Route to get analytics data for a specific link
router.get('/link/:id', analyticsController.getLinkAnalytics);
// Route to get overall analytics data for the user
router.get('/user/:userId', analyticsController.getUserAnalytics);
exports.default = router;
