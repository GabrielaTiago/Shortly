import express, { json } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import router from './routers/router.js';

dotenv.config();

const server = express();

server.use(cors(), json());
server.use(router);

server.listen(process.env.PORT, () => {
  console.log(`The server is running on port: ${process.env.PORT}`);
});
