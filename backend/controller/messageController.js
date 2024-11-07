import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

//This code defines a function called sendMessage that handles sending a message in a web application. It uses catchAsyncErrors, an asynchronous error-handling utility, to handle any errors that might occur during execution.
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  //This line extracts firstName, lastName, email, phone, and message from the request body (req.body). These values are expected to be submitted in the form data when the user sends a message.
  const { firstName, lastName, email, phone, message } = req.body;
  //The function checks if any of these fields are missing. If so, it calls the next function with an error, using ErrorHandler, a custom error class.
  //ErrorHandler is called with the message "Please Fill Full Form!" and an HTTP status code 400, indicating a bad request.
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  //If validation passes, the code attempts to create a new Message document (presumably in a database) with the provided data. This is done asynchronously using await.
  await Message.create({ firstName, lastName, email, phone, message });
  //After successfully creating the message, the function sends a JSON response with a success status and a message "Message Sent!". This response is returned with an HTTP status code 200, meaning the operation was successful.
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

//This code defines an asynchronous function called getAllMessages that retrieves all messages stored in the database and sends them back as a JSON response. It's wrapped in catchAsyncErrors to handle any potential errors.
//This function is typically used to display all stored messages, often in an admin dashboard or management panel where authorized users can view submitted messages.
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  //This line fetches all the messages from the database using Message.find(), which returns an array of all message documents. The await keyword is used to handle this asynchronously, allowing the code to wait for the database query to complete.
  const messages = await Message.find();
  //Once all messages are retrieved, the function sends an HTTP response with a status code 200 (OK).
  //It sends a JSON object containing a success key (set to true) and a messages key, which holds the array of message documents.
  res.status(200).json({
    success: true,
    messages,
  });
});
