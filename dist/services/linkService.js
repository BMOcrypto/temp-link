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
const supabaseClient_1 = __importDefault(require("../utils/supabaseClient"));
class LinkService {
    createLink(originalUrl, userId, expirationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let shortenedUrl;
            let exists = true;
            // Ensure unique shortenedUrl
            do {
                shortenedUrl = this.generateShortenedUrl();
                const { data: links } = yield supabaseClient_1.default
                    .from('links')
                    .select('id')
                    .eq('shortenedUrl', shortenedUrl);
                exists = !!(links && links.length > 0);
            } while (exists);
            const { data, error } = yield supabaseClient_1.default
                .from('links')
                .insert([{ originalUrl, shortenedUrl, userId, expirationTime, createdAt: new Date() }]);
            if (error)
                throw new Error(error.message);
            return data && data[0];
        });
    }
    getLink(shortenedUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('links')
                .select('*')
                .eq('shortenedUrl', shortenedUrl)
                .limit(1);
            if (error)
                throw new Error(error.message);
            return data && data[0];
        });
    }
    deleteExpiredLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            yield supabaseClient_1.default
                .from('links')
                .delete()
                .lt('expirationTime', now.toISOString());
        });
    }
    generateShortenedUrl() {
        return Math.random().toString(36).substring(2, 8);
    }
    getUserLinks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('links')
                .select('*')
                .eq('userId', userId);
            if (error)
                throw new Error(error.message);
            return data || [];
        });
    }
    getLinkAnalytics(shortenedUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.getLink(shortenedUrl);
            if (!link) {
                throw new Error('Link not found');
            }
            return {
                originalUrl: link.originalUrl,
                shortenedUrl: link.shortenedUrl,
                clicks: ((_a = link.analytics) === null || _a === void 0 ? void 0 : _a.clicks) || 0,
                createdAt: link.createdAt,
                expirationTime: link.expirationTime,
            };
        });
    }
}
exports.default = LinkService;
