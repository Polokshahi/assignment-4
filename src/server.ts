
import app from './app';
import { errorHandler } from './middlewares/errorHandler';
const server = ()=>{

    const PORT = process.env.PORT || 7000;

   
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



app.use(errorHandler);
    

}

server();