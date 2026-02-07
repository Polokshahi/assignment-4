import app from './app';

const server = () => {
  const PORT = process.env.PORT || 7000;
  
  
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
};

server();


export default app;