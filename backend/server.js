import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoute.js";
import tourRouter from "./routes/tourRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/tours", tourRouter);

app.get("/", (req, res) => {
  res.send("API is Working!");
});

// ✅ FIX HERE
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1); // important
  }
};

startServer();