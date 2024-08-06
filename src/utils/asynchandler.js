const asyncHandler = (requesthandler) => {
     return (req, res, next) => {
    Promise.resolve(requesthandler(req, res, next)).catch((error) => next(error));
  };
};

// async is a higher order fnc which can  accept function as a peramerter and can be return

// // passing the fn to another function insode the asynchandler function
// const asyncHandler= (fn)=>{ }
// const asyncHandler= (fn)=> ()=>{ }
// const asyncHandler= (fn)=>async ()=>{ }

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message || "Server Error",
//     });
//   }
// };

export { asyncHandler };
