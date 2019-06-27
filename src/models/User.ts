import mongoose from 'mongoose';

export type UserDocument = mongoose.Document;

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    facebook: String,
    google: String,
});

export const User = mongoose.model<UserDocument>("User", userSchema);