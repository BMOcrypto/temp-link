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
class AnalyticsService {
    getLinkAnalytics(linkId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('links')
                .select('*')
                .eq('id', linkId)
                .limit(1);
            if (error || !data || data.length === 0) {
                throw new Error('Link not found');
            }
            const link = data[0];
            return {
                originalUrl: link.originalUrl,
                shortenedUrl: link.shortenedUrl,
                clicks: ((_a = link.analytics) === null || _a === void 0 ? void 0 : _a.clicks) || 0,
                createdAt: link.createdAt,
                expirationTime: link.expirationTime,
            };
        });
    }
    recordClick(linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('links')
                .select('analytics')
                .eq('id', linkId)
                .limit(1);
            if (error || !data || data.length === 0) {
                throw new Error('Link not found');
            }
            const analytics = data[0].analytics || { clicks: 0, lastAccessed: null };
            analytics.clicks = (analytics.clicks || 0) + 1;
            analytics.lastAccessed = new Date().toISOString();
            yield supabaseClient_1.default
                .from('links')
                .update({ analytics })
                .eq('id', linkId);
        });
    }
}
exports.default = AnalyticsService;
