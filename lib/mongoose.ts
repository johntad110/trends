import mongoose from 'mongoose'

let isConected = false; // variable to check connection status

export const connectToDB =async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
    if (isConected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConected = true
        console.log('Connected to MongoDB')
    } catch (err) {
        console.log(err)
    }
}