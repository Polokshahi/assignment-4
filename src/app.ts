import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './module/auth.route';
import { UserRoutes } from './module/user/user.route';
import { TutorRoutes } from './module/tutor/tutor.route';
import { BookingRoutes } from './module/booking/booking.route';
import { ReviewRoutes } from './module/review/review.route';
import { AdminRoutes } from './admin/admin.routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});



app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);

app.use("/api/tutors", TutorRoutes);

app.use("/api/bookings", BookingRoutes);

app.use("/api/reviews", ReviewRoutes);

app.use("/api/admin", AdminRoutes);






app.use(notFound);


app.use(globalErrorHandler);







export default app;