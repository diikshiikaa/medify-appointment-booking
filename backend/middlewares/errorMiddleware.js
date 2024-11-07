//This code defines a custom error-handling setup for a Node.js application,
// including the ErrorHandler class and errorMiddleware. The ErrorHandler class
//extends the built-in Error class to handle custom error messages and status codes,
// while errorMiddleware acts as a centralized error handler, formatting responses
//based on error types and codes.

/*The ErrorHandler class inherits from the JavaScript built-in Error class.
It has a constructor that takes message and statusCode as parameters:
super(message) calls the parent Error constructor, setting the error message.
this.statusCode stores the HTTP status code (e.g., 400 for "Bad Request").
This class is useful for creating custom error instances with both a message and a status code. */
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
//exports different error msgs, by creating an instance of ErrorHandler class
//Default values for err.message and err.statusCode are set in case they are undefined, defaulting to "Internal Server Error" (message) and 500 (status).
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  //Duplicate key error: Code 11000 indicates a MongoDB duplicate key error. This block captures the duplicate field and creates a new error message, setting the status to 400.
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  /*JSON web token error: JsonWebTokenError: Raised when an invalid token is provided.
TokenExpiredError: Raised when the token has expired.
In both cases, a new ErrorHandler instance is created with a 400 status and an appropriate error message.*/
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  /*Cast Error: CastError occurs when an invalid MongoDB ID format is used in a query.
The message indicates which field caused the issue, and the error status is set to 400. */
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //If the error object (err) has an errors property (common with validation errors), the middleware extracts the messages from each error and joins them into a single string.
  //If err.errors is undefined, it defaults to err.message.
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  //The middleware returns a JSON response with the status code from err.statusCode.
  //success is set to false, indicating an error, and the message is set to errorMessage, the customized error description.
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
