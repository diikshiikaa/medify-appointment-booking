/*The generateToken function generates a JWT for a user, sets it as a cookie with a name based on the user's role (either "adminToken" or "patientToken"), and sends a response back to the client with the user data, the token, and a success message.

The token is created using the user.generateJsonWebToken() method.
The cookie is configured with an expiration time from environment variables and is marked as httpOnly for security.
It returns a JSON response with the user info and the generated token.
This function is typically used in Express route handlers (e.g., login or signup) and relies on environment variables for configuration.

 */
export const generateToken = (user, message, statusCode, res) => {
  //this method is created in userSchema
  const token = user.generateJsonWebToken();
  // Determine the cookie name based on the user's role
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // secure: true,
      // sameSite: "None",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
