import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './module/auth.route';
import { UserRoutes } from './module/user/user.route';
import { TutorRoutes } from './module/tutor/tutor.route';
import { BookingRoutes } from './module/booking/booking.route';
import { ReviewRoutes } from './module/review/review.route';

const app = express();


app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});



app.use("/api/auth", AuthRoutes);

app.use("/api/users", UserRoutes);

app.use("/api/tutor", TutorRoutes);

app.use("/api/bookings", BookingRoutes);

app.use("/api/reviews", ReviewRoutes);













export default app;