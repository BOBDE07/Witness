import mongoose from 'mongoose' ; 

const connectDB = async function () {
    try {
        await mongoose.connect(process.env.MONGODB_URI) ; 
        console.log('MongoDB is connected successfully....')
    } catch (error) {
        console.log('MongoDB disconnected...') ; 
        process.exit(1) ;
    }
}

export { connectDB }