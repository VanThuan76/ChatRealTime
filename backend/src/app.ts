const http = require("http");
const socketio = require("socket.io");
import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"
import PrismaRoutes from "./routes/PrismaRoutes"
dotenv.config()
//Condition for backend which be must .env
if (!process.env.API_ENDPOINT) {
    process.exit(1);
} 
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);
  app.use(cors({
    credentials: true ,
  }));
  app.use(express.json());
  app.use(PrismaRoutes)
  app.use(express.static('public'))
  //Socket
  io.on("connection", (socket:any) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });

  socket.on("send message", (message:any) => {
      io.emit("new message", message);
  });
  });
  server.listen(process.env.API_ENDPOINT, ()=>{
    console.log(`Server port ${process.env.API_ENDPOINT} up and running...`)
})