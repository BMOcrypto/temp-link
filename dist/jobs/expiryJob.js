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
const node_cron_1 = require("node-cron");
const expiryJob = () => {
    (0, node_cron_1.schedule)('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const currentTime = new Date();
        try {
            yield supabaseClient_1.default
                .from('links')
                .delete()
                .lt('expirationTime', currentTime.toISOString());
            console.log('Expired links deleted successfully');
        }
        catch (error) {
            console.error('Error deleting expired links:', error);
        }
    }));
};
exports.default = expiryJob;
