"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const path_1 = __importDefault(require("path"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const linkRoutes_1 = __importDefault(require("./routes/linkRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const index_1 = __importDefault(require("./config/index"));
const expiryJob_1 = __importDefault(require("./jobs/expiryJob"));
const app = (0, express_1.default)();
const PORT = index_1.default.PORT;
// Middleware
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/links', linkRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.default);
// Start expiry job
(0, expiryJob_1.default)();
// Start server directly (Supabase is serverless, no connection needed)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
