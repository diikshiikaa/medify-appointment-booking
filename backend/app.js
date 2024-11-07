import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

//app is an instance of express framework that is used to define configuration middleware, routes etc whatever is needed in backend
const app = express();

//config is present in dotenv package
//loads variables from config.env file to process.env file
//the path is custom
/*
The line `config({ path: "./config/config.env" });` is typically used when you are working with the **`dotenv`** package in a Node.js application. Here's what it does:

- **`config()`**: This function call is part of the `dotenv` package, which loads environment variables from a `.env` file into `process.env`.

- **`{ path: "./config/config.env" }`**: This specifies the path to the environment file (`config.env`) that contains key-value pairs of environment variables. By default, `dotenv` looks for a `.env` file in the root directory, but here you are providing a custom path.

In summary, this line loads environment variables from the `config.env` file located in the `./config/` directory into `process.env`, making them accessible throughout your application.
*/
config({ path: "./config/config.env" });

/*The cors({ ... }) function is used to control who can access your server from a different domain (Cross-Origin Resource Sharing or CORS). Here's a simple breakdown of what each part does:

cors(): This is a function from the CORS library. It helps you set rules on who can connect to your server and what they can do.

origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL]: This part says which websites are allowed to access your server. In this case, it's allowing two websites: one for the frontend and one for the dashboard, which are stored in environment variables (FRONTEND_URL, DASHBOARD_URL).

method: ["GET", "POST", "DELETE", "PUT"]: This lists the types of actions (HTTP methods) that are allowed, like getting data (GET), sending data (POST), deleting data (DELETE), or updating data (PUT).

credentials: true: This allows the server to accept requests that include sensitive data, like cookies or authentication information. */
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

/*The line app.use(cookieParser()); in an Express application does the following:
cookieParser(): This function is from the cookie-parser middleware, which is used to parse cookies in incoming requests. It helps your server read and manage cookies sent from the client (like a browser).
app.use(): This is used to add middleware to your Express app. By calling app.use(cookieParser()), you're telling the app to use this middleware for all incoming requests. */
app.use(cookieParser());

//This is a built-in middleware function in Express that parses incoming request bodies containing JSON data. It converts the JSON payload into a JavaScript object and makes it accessible via req.body.
app.use(express.json());

/*The line app.use(express.urlencoded({ extended: true })); in an Express application configures the middleware to parse incoming request bodies that are URL-encoded (typically sent through forms).

Here’s a breakdown of what it does:

app.use(express.urlencoded({ extended: true }))
express.urlencoded(): This is a built-in middleware function in Express that parses incoming requests with URL-encoded payloads, typically used when submitting form data via HTTP POST requests.

{ extended: true }: This option determines how the URL-encoded data is parsed:

true: Allows for nested objects and richer data structures (using the qs library).
false: Uses the built-in querystring library to parse simple key-value pairs
this middleware parses the incoming form data from the frontend in the req.body in the form of key value pair

eg form: <form action="/submit" method="POST">
  <input type="text" name="name" value="John">
  <input type="text" name="age" value="30">
  <button type="submit">Submit</button>
</form>
When you submit a form, the data is sent to the server in a URL-encoded format (like name=John&age=30).
app.post("/submit", (req, res) => {
  console.log(req.body.name); // Outputs: John
  console.log(req.body.age);  // Outputs: 30
  res.send("Form data received");
});
*/
app.use(express.urlencoded({ extended: true }));

/*The code snippet app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })) configures middleware in an Express app to handle file uploads using the express-fileupload package.

Breakdown:
fileUpload(): This function comes from the express-fileupload package. It allows handling file uploads in Express, enabling you to accept files in the request body, typically sent via forms or file input fields.

useTempFiles: true: This option tells the middleware to store uploaded files temporarily on the server's disk instead of in memory. It is useful when handling large files because it prevents memory overload by saving the files to the disk until they are processed.

tempFileDir: "/tmp/": This specifies the directory where temporary files will be stored on the server. In this case, it's set to /tmp/, a common temporary folder used by operating systems to store temporary data. You can change this path to any directory where you want to temporarily store the files. */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//when req comes from this base url, the next parameter(middleware) will be called
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

//connects with db
dbConnection();

//checks for errors
app.use(errorMiddleware);
export default app;
