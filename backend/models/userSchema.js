import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    //use the isEmail function from the validator library
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
  },
  nic: {
    type: String,
    required: [true, "NIC Is Required!"],
    minLength: [13, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    //This option ensures that the password field is not selected by default when querying the database. This helps prevent the password from being exposed in query results unless explicitly requested.
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
  },
  /*public_id: String:

Stores the public_id of the uploaded image, usually provided by a service like Cloudinary.
The public_id is used to uniquely identify the image in the cloud storage and perform operations like deletion or updates.
url: String:

Stores the URL of the uploaded image, which will be used to display the avatar.
This URL is typically generated by the cloud storage service (e.g., Cloudinary) when the image is uploaded. */
  docAvatar: {
    public_id: String,
    url: String,
  },
});

/*This code snippet is a pre-save middleware function in a Mongoose schema for hashing the user's password before saving it to the database. Here's how it works:

Line-by-line explanation:
userSchema.pre("save", async function (next) {:

This defines a pre-save hook on the userSchema.
The "save" event means this function will run before a document is saved to the database.
It's asynchronous (async) because the password hashing operation is asynchronous.
if (!this.isModified("password")) { next(); }:

this refers to the document being saved (i.e., the user).
The isModified("password") method checks if the password field has been modified.
If the password has not been modified (e.g., during an update where the password isn’t changed), the middleware calls next() to proceed without rehashing the password.
This prevents hashing the password again if it's already hashed.
this.password = await bcrypt.hash(this.password, 10);:

If the password has been modified (e.g., during user creation or password update), the function hashes the password using the bcrypt.hash() method.
this.password is the plain-text password that the user has provided.
bcrypt.hash(this.password, 10) hashes the password with a salt rounds value of 10, meaning the hashing algorithm will run 10 rounds of salting.
The result of this hashing operation replaces the original this.password, ensuring that the password stored in the database is hashed and secure. */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

/*In Mongoose, methods defined on a schema (like your comparePassword and generateJsonWebToken methods) are automatically available on the instances of that model (documents) when you create or retrieve them. */

/*This code snippet defines a method called comparePassword on the userSchema, which is used to compare a plain-text password entered by a user during login with the hashed password stored in the database. Here's how it works:

Line-by-line explanation:
userSchema.methods.comparePassword = async function (enteredPassword) {:

This line defines a new method called comparePassword on the userSchema.
It uses the async keyword, indicating that the function will perform asynchronous operations.
return await bcrypt.compare(enteredPassword, this.password);:

bcrypt.compare(enteredPassword, this.password) is called to compare the entered password (the one the user has input during login) with the stored hashed password (this.password).
The compare method checks if the entered password, when hashed, matches the stored hash.
If they match, it returns true; otherwise, it returns false.
The use of await ensures that the method waits for the comparison to complete before returning the result. */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/*This code snippet defines a method called generateJsonWebToken on the userSchema, which is used to create a JSON Web Token (JWT) for a user. Here's how it works:

Line-by-line explanation:
userSchema.methods.generateJsonWebToken = function () {:

This line defines a new method named generateJsonWebToken on the userSchema.
The method is created using the function keyword, allowing access to the current instance of the user document via this.
return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {:

The jwt.sign method from the jsonwebtoken library is called to create a new JWT.
The first argument is an object containing the payload; in this case, it includes the user's unique identifier (id: this._id), which is typically the user’s MongoDB ObjectID.
The second argument is the secret key used to sign the token, taken from the environment variable process.env.JWT_SECRET_KEY. This key should be kept secure and not exposed.
expiresIn: process.env.JWT_EXPIRES,:

This option specifies the expiration time for the token, taken from the environment variable process.env.JWT_EXPIRES. It can be set to a specific duration (e.g., "1h" for one hour) to control how long the token is valid.
 */
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

/*This function call creates a new Mongoose model named User.
The first argument, "User", is the name of the model. Mongoose will automatically create a collection named users in the MongoDB database (lowercased and pluralized).
The second argument, userSchema, is the schema definition that outlines the structure of the documents in the users collection, including field types, validation, and any methods or hooks associated with the schema.
 */
export const User = mongoose.model("User", userSchema);
