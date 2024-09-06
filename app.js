import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";
import chatRoutes from "./routes/chat.js";
import homeRoutes from "./routes/home.js";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import logoutRoutes from "./routes/logout.js";
import mongoose from "mongoose";
import cors from "cors";

// Load the environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("DB Connected, starting app..."));

const app = express();

// Middleware
app.use(errorHandler);
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// Serve files from the public directory for each route
app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   express.static("public", {
//     setHeaders: (res, path) => {
//       if (path.endsWith(".css")) {
//         res.setHeader("Content-Type", "text/css");
//       }
//     },
//   })
// );

// Middleware to serve static files from the 'public' folder
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      // Set the correct MIME type
      const type = getMimeType(filePath);
      if (type) {
        res.setHeader("Content-Type", type);
      }
    },
  })
);

// Function to get MIME type
function getMimeType(filePath) {
  const mimeTypes = {
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
  };

  const extension = path.extname(filePath);
  return mimeTypes[extension];
}

// Routes

app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);
app.use("/logout", logoutRoutes);
app.use("/api/chat", chatRoutes);
app.use("*", (req, res) => {
  res.render("404_notfound");
});

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
