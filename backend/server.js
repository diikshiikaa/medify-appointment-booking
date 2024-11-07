import app from "./app.js";
import cloudinary from "cloudinary";

/*cloudinary.v2.config is a method that sets up the configuration for using Cloudinary's API in your application.
The configuration object passed to this method contains three properties:
cloud_name: Your Cloudinary account's cloud name, which is stored in an environment variable (process.env.CLOUDINARY_CLOUD_NAME).
api_key: Your Cloudinary API key, also stored in an environment variable (process.env.CLOUDINARY_API_KEY).
api_secret: Your Cloudinary API secret, stored in an environment variable (process.env.CLOUDINARY_API_SECRET).
These credentials are required to authenticate requests to Cloudinary's API and are fetched from environment variables for security purposes. */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
