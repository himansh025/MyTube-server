// // this is for api error handle

// // create a  class apierror  and extends error make our consutuctor

// class ApiError extends Error {
//   consturtor(
//     statuscode,
//     message = "something went worng",
//     errors = [],
//     stack = ""
//   ) {
//     // override the consturctor when ever override use super()
//     // super(message)
//     this.statuscode = statuscode;
//     (this.data = null),
//       (this.message = message),
//       (this.success = false),
//       (this.errors = errors);

//     //  choice
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.consturtor);
//     }
//   }
// }
// export { ApiError };



class ApiError extends Error {
  constructor(
      statusCode,
      message= "Something went wrong",
      errors = [],
      stack = ""
  ){
      super(message)
      this.statusCode = statusCode
      this.data = null
      this.message = message
      this.success = false;
      this.errors = errors

      if (stack) {
          this.stack = stack
      } else{
          Error.captureStackTrace(this, this.constructor)
      }

  }
}

export {ApiError}