import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

/*1. **Extracts Patient Data**: The function retrieves necessary patient details (firstName, lastName, email, etc.) from the request body.

2. **Validates Input**: It checks if all required fields are provided; if not, it returns a "Please Fill Full Form!" error.

3. **Checks Existing User**: It verifies if the user is already registered using the email. If the user exists, an error is returned.

4. **Creates New User**: If the user is not found, it creates a new user in the database with the role set to "Patient."

5. **Generates Token**: Upon successful registration, a token is generated and sent along with a success message in the response.

6. **Handles Errors**: The function uses `catchAsyncErrors` to catch and handle any asynchronous errors, passing them to the custom error handler. */

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

//This code defines an asynchronous function login, which handles user authentication by validating login credentials and generating a token upon successful login. Here's a line-by-line breakdown:

/*The login function is exported and wrapped with catchAsyncErrors, which ensures that any asynchronous errors during execution are caught and handled properly.
The function extracts email, password, confirmPassword, and role from the request body, which are the data provided by the user during login.
The function checks if any of the required fields (email, password, confirmPassword, or role) are missing. If any field is missing, it throws an error with the message "Please Fill Full Form!" and stops the process with status code 400.
 */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  //It checks if the password and confirmPassword fields match. If they don't, the function throws an error saying "Password & Confirm Password Do Not Match!" with status code 400.
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  //The function tries to find a user with the given email in the database using User.findOne({ email }). It explicitly selects the password field, as it might be excluded by default in queries. If no user is found, it throws an error with the message "Invalid Email Or Password!" and stops execution with status 400.
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  //If the user is found, the function compares the provided password with the stored hashed password by calling the comparePassword method (likely defined in the User model). If the passwords don't match, the function throws an "Invalid Email Or Password!" error.
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  //It checks if the role provided in the login request matches the user's role in the database. If the roles don't match, an error with the message "User Not Found With This Role!" is thrown, indicating the user doesn't have permission for the requested role.
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  //If all checks pass, the function generates a token for the user using generateToken. This token is likely used for authentication purposes, and a success message "Login Successfully!" with status code 201 is sent in the response.
  generateToken(user, "Login Successfully!", 201, res);
});

//This code defines an asynchronous function addNewAdmin that is responsible for registering a new admin user in the system. It handles input validation, checks for existing users, creates a new admin user, and returns a response if successful. Here's a detailed explanation:
//The addNewAdmin function is wrapped in catchAsyncErrors to ensure any asynchronous errors are caught and handled properly, avoiding unhandled promise rejections.
//The required details (firstName, lastName, email, etc.) are extracted from the request body, which is the data sent by the client (usually via a form submission).
//This block checks whether any required fields are missing. If one or more fields are empty, it triggers an error using the ErrorHandler class with the message "Please Fill Full Form!" and stops further execution, returning a status code of 400 (Bad Request).
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  //The function checks the database to see if a user with the given email already exists using User.findOne({ email }). If a user with that email is found, the system throws an error saying "Admin With This Email Already Exists!" with a 400 status code.
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }
  //The function checks the database to see if a user with the given email already exists using User.findOne({ email }). If a user with that email is found, the system throws an error saying "Admin With This Email Already Exists!" with a 400 status code.
  /*Once the new admin user is created, a JSON response is sent back to the client with a status code of 200 (Success). The response contains:

success: true: Indicates the operation was successful.
message: "New Admin Registered": A message confirming the admin registration.
admin: The details of the newly created admin. */
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});
//The function checks if the files object exists in the request and ensures that the doctor avatar (docAvatar) is included. If no file is uploaded, it returns an error with the message "Doctor Avatar Required!" and status code 400.
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  //The function extracts the docAvatar file from the request and checks if its file type (MIME type) is one of the allowed formats: PNG, JPEG, or WebP. If the format is not supported, it throws an error saying "File Format Not Supported!" with status code 400.
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  //The function extracts the doctor's details (firstName, lastName, email, etc.) from the request body, which contains the data submitted via the form.
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  //It checks if a doctor with the given email is already registered in the database by querying User.findOne({ email }). If an email match is found, it throws an error saying "Doctor With This Email Already Exists!" and stops the process with a 400 status code.
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  //The avatar image file is uploaded to Cloudinary using the cloudinary.uploader.upload() function, which uploads the file from its temporary file path. If the upload fails, it logs the error and returns a "Failed To Upload Doctor Avatar To Cloudinary" error with status code 500 (Internal Server Error).
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  //If the avatar upload is successful, a new doctor is created in the database with the provided details and role set to "Doctor". The avatar's public_id and secure_url (URL for accessing the avatar) returned from Cloudinary are saved in the docAvatar field.
  /*After the doctor is successfully created, the function sends a JSON response with status code 200. The response contains:

success: true: Indicates successful operation.
message: "New Doctor Registered": A message confirming the new doctor registration.
doctor: The newly created doctor object, including all details and the avatar information. */
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      // secure: true,
      // sameSite: "None",
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
/*The function sends a response with status code 201 (Created).
It uses the cookie function to set the adminToken cookie to an empty string (""), effectively clearing the cookie.
The expires option is set to the current time (new Date(Date.now())), meaning the cookie expires immediately and is removed from the browser.
httpOnly: true ensures that the cookie is not accessible via JavaScript, providing additional security. */
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      // secure: true,
      // sameSite: "None",
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
