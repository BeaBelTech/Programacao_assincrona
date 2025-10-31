require('dotenv').config();
const { app, connectDB } = require('./app');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT} 🚀`);
  });
}

start();
