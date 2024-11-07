//wraps around a async func(theFunction) and catch errors, returns a function, 
//a promise is executed and error is caught, the control passes over to next middleware
export const catchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
      Promise.resolve(theFunction(req, res, next)).catch(next);
    };
  };