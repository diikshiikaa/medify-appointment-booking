import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate and authorise dashboard users
//This middleware function, isAdminAuthenticated, is designed to authenticate and authorize users who are accessing an admin dashboard. It checks for a valid token and ensures the user has an admin role before allowing access to protected resources.
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  //The middleware starts by extracting the adminToken from the user’s cookies. This token is expected to be present if the user is logged in as an admin.
  const token = req.cookies.adminToken;
  //If adminToken is not found in the cookies, the middleware calls the error handler, passing an authentication error message and a 400 status code. The request processing stops here for unauthenticated users.
  if (!token) {
    return next(new ErrorHandler("Dashboard User is not authenticated!", 400));
  }
  //If the token is present, it’s verified using jwt.verify, which decodes the token to retrieve the user ID (decoded.id). The secret key stored in the environment variable JWT_SECRET_KEY ensures the token's validity and integrity.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //Using the decoded token, it retrieves the user from the database by decoded.id and assigns it to req.user, which makes the user’s information available in subsequent middlewares or route handlers.
  req.user = await User.findById(decoded.id);
  //if the user's role is not admin, he is not authorised
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} not authorized for this resource!`,
        403
      )
    );
  }
  //goes to next middleware
  next();
});

// Middleware to authenticate and authorise frontend users
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`,
          403
        )
      );
    }
    next();
  }
);

//middleware to authorise users(users are already authenticated)
//takes all roles as parameters
//The isAuthorized middleware function is designed to restrict access to certain resources based on the user's role(s). It checks if the user's role matches any of the roles specified in the arguments and only allows access if a match is found.
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    //if role is not one of the role in roles array, not accessible
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    next();
  };
};
