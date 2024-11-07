import mongoose from "mongoose";

/*This code snippet is for establishing a connection to a MongoDB database using the Mongoose library in a Node.js environment. Let's break it down:

1. import mongoose from "mongoose";
This imports the mongoose library, which is an ODM (Object Data Modeling) tool for MongoDB, used to interact with the database using JavaScript objects.
2. export const dbConnection = () => {
This defines and exports a function named dbConnection that will be responsible for connecting to the MongoDB database when invoked.
3. mongoose.connect(process.env.MONGO_URI, { dbName: "HOSPITAL_MANAGEMENT_SYSTEM" })
mongoose.connect is a method that initiates the connection to a MongoDB instance.
First parameter (process.env.MONGO_URI): This is the MongoDB URI, fetched from the environment variables (process.env.MONGO_URI). It typically contains the protocol, host, port, and authentication details of the database.
Second parameter (optional): An options object is passed, where dbName specifies the name of the database to use, in this case, "HOSPITAL_MANAGEMENT_SYSTEM".
4. .then(() => { console.log("Connected to database!"); })
.then() is a promise method that is executed when the connection is successful. When the connection to the database is established, it logs the message "Connected to database!" to the console.
5. .catch((err) => { console.log("Some error occured while connecting to database:", err); })
.catch() is a promise method that is executed if there is an error during the connection attempt. If the connection fails, it logs the error message and the error details (err) to the console.
 */

export const dbConnection = () => {
  //.connect takes two parameters- 1. URI, 2. optional, here only includes db name
  //after .connect, promise
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
