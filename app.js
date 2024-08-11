const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors")
const { auth, authSender, authDriver } = require("./middleware/auth")
const userRouter = require("./routes/userRouter")
const driverRouter = require("./routes/driverRouter")
const senderRouter = require("./routes/senderRouter")
const path = require('path')
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected`);
  } catch (err) {
    console.log("DB error :::::::", err);
    process.exit(1);
  }
})();

const app = express();

const sessOption = {
  secret: process.env.SESSION_SECRET,
  // proxy: true,
  cookie: {
    // sameSite: "none",
    secure: false,
    httpOnly: true,
    maxAge: 200 * 60 * 60 * 1000, //3 days
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_STORE,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native",
  }),
};

const corsOptions = {
  origin: ["http://localhost:3301"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("Content-Type", "application/json");
app.use(session(sessOption));
app.use(cors(corsOptions));
app.set("view engine", "ejs");



app.use("/views", userRouter);
app.use("/views/driver", authDriver, driverRouter)
app.use("/views/sender", authSender, senderRouter)


const port = 3301;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
