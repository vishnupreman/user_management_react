import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/auth'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'

dotenv.config();
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,              
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', authRoutes);
app.use('/api',userRoutes)
app.use('/api/admin',adminRoutes)

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});