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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, email } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Insert user into Supabase
            const { data, error } = yield supabaseClient_1.default
                .from('users')
                .insert([{ username, password: hashedPassword, email }]);
            if (error) {
                return res.status(400).json({ error: 'User registration failed', details: error.message });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            // Fetch user from Supabase
            const { data: users, error } = yield supabaseClient_1.default
                .from('users')
                .select('*')
                .eq('username', username)
                .limit(1);
            if (error || !users || users.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const user = users[0];
            const valid = yield bcrypt_1.default.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ message: 'Logged out successfully' });
        });
    }
    authenticate(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(403).json({ error: 'No token provided' });
            }
            jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                req.userId = decoded.id;
                next();
            });
        });
    }
}
exports.default = AuthController;
