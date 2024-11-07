import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

//This code defines an asynchronous function postAppointment for handling appointment creation in a medical application. The function checks for required fields, verifies doctor availability, and stores the appointment data if valid. It’s wrapped in catchAsyncErrors to handle errors gracefully.
//This function ensures that an appointment is created only if the data is complete, the doctor exists and is unambiguous, and both patient and doctor details are properly linked.
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  //The function extracts the appointment-related information from the request body, such as patient and doctor details, contact information, and appointment specifics.
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  //The function checks if any of the required fields are missing. If so, it triggers the error handler with a 400 status code and a "Please Fill Full Form!" message, indicating a bad request.
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  //The function searches for a doctor with matching firstName, lastName, role as "Doctor", and department.
  //isConflict holds any doctors matching these criteria.
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  //If no doctor matches the search criteria (isConflict.length === 0), an error with 404 status code ("Doctor not found") is returned.
  //If multiple doctors match, an error with 400 status code is returned, advising the user to resolve the conflict via direct contact.
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  //The function retrieves doctorId from the first doctor result and patientId from the authenticated user (req.user._id).
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  //An appointment is created with all provided details, including the doctor and patient IDs.
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  //After successful appointment creation, the function sends an HTTP 200 response, along with a success message and the created appointment data.
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  //appointment.find() returns all the appointments
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

//This code defines an asynchronous function, updateAppointmentStatus, for updating the status of an appointment. It finds an appointment by its ID and updates its details if found. The function is wrapped in catchAsyncErrors to handle errors effectively.
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    //This extracts the appointment ID from the route parameters (req.params), allowing the function to identify which appointment to update.
    const { id } = req.params;
    //The function searches for an appointment with the given ID using Appointment.findById(id).
    //If no appointment is found, it triggers an error with a 404 status code, signaling "Appointment not found."
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    /*If the appointment exists, the function updates it using findByIdAndUpdate. The following options are specified:
new: true: Returns the updated appointment document instead of the original.
runValidators: true: Ensures the updated data adheres to any validation rules defined in the schema.
useFindAndModify: false: Ensures that Mongoose uses the native findOneAndUpdate() instead of findAndModify() for better compatibility. */
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    //After a successful update, the function responds with a 200 status code, confirming the update with a success message.
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
