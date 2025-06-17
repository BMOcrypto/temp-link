"use strict";
// import { Schema, model } from 'mongoose';
// const linkSchema = new Schema({
//     originalUrl: {
//         type: String,
//         required: true,
//     },
//     shortenedUrl: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     expirationTime: {
//         type: Date,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     analytics: {
//         clicks: {
//             type: Number,
//             default: 0,
//         },
//         lastAccessed: {
//             type: Date,
//         },
//     },
// });
// const Link = model('Link', linkSchema);
// export default Link;
// Supabase does not require a model file. Link operations will be handled in the service/controller using the Supabase client.
