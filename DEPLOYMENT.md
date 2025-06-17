# Vercel Deployment Instructions

1. **Push your code to GitHub (or GitLab/Bitbucket).**
2. **Go to https://vercel.com and import your repository.**
3. **Set the following Environment Variables in Vercel dashboard:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `EXPIRY_CHECK_INTERVAL`
   - `PORT` (Vercel sets this automatically, but you can use it in your config)
   - `NODE_ENV`
4. **Vercel will auto-detect the `vercel.json` and deploy your API.**
5. **Your API will be available at your Vercel domain.**

**Note:**
- Vercel runs serverless functions, so cold starts may occur.
- If you need persistent background jobs (like expiryJob), consider using a separate cron service or a platform like Render for the backend.
- For static assets, Vercel will serve from the `public/` directory automatically.

---

For more details, see: https://vercel.com/docs
