import supabase from '../utils/supabaseClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

class AuthController {
    async register(req: Request, res: Response) {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password: hashedPassword, email }]);
        if (error) {
            return res.status(400).json({ error: 'User registration failed', details: error.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        // Fetch user from Supabase
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .limit(1);
        if (error || !users || users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }

    async logout(req: Request, res: Response) {
        res.status(200).json({ message: 'Logged out successfully' });
    }

    async authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'No token provided' });
        }
        jwt.verify(token, config.JWT_SECRET, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.userId = decoded.id;
            next();
        });
    }
}

export default AuthController;