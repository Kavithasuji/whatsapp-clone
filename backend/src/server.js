
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";

// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import conversationRoutes
// from "./routes/conversationRoutes.js";
// import messageRoutes
// from "./routes/message.routes.js";

// const app = express();

// connectDB();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_ORIGIN,
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use(
//   "/api/users",
//   userRoutes
// );
// app.use("/api/conversations", conversationRoutes);
// app.use("/api/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("API Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server running on port ${PORT}`
//   );
// });


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { createServer }
from "http";

import connectDB
from "./config/db.js";

import authRoutes
from "./routes/authRoutes.js";

import userRoutes
from "./routes/userRoutes.js";

import conversationRoutes
from "./routes/conversationRoutes.js";

import messageRoutes
from "./routes/message.routes.js";

import {
  initSocket,
}
from "./sockets/socket.js";

const app = express();

connectDB();

app.use(
  cors({
    origin:
      process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/conversations",
  conversationRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT =
  process.env.PORT || 5000;

const httpServer =
  createServer(app);

initSocket(httpServer);

httpServer.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);