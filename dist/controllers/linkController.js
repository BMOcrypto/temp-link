"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linkService_1 = __importDefault(require("../services/linkService"));
class LinkController {
    constructor() {
        this.createLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { originalUrl, expirationTime } = req.body;
                const userId = req.userId; // Set by auth middleware
                if (!originalUrl || !expirationTime) {
                    res.status(400).json({ message: 'originalUrl and expirationTime are required' });
                    return;
                }
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized: userId missing' });
                    return;
                }
                const link = yield this.linkService.createLink(originalUrl, userId, new Date(expirationTime));
                res.status(201).json(link);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating link', error });
            }
        });
        this.getLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { shortenedUrl } = req.params;
                const link = yield this.linkService.getLink(shortenedUrl);
                if (link) {
                    res.redirect(link.originalUrl);
                }
                else {
                    res.status(404).json({ message: 'Link not found or expired' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving link', error });
            }
        });
        this.getUserLinks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized: userId missing' });
                    return;
                }
                const links = yield this.linkService.getUserLinks(userId);
                res.status(200).json(links);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving user links', error });
            }
        });
        this.getExpiredLinks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Implement if needed, or return 501 Not Implemented
            res.status(501).json({ message: 'Not implemented' });
        });
        this.linkService = new linkService_1.default();
    }
}
exports.default = LinkController;
