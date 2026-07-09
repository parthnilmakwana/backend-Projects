const asyncHandler = (asyncFunction) => {
  return async (req, res, next) => {
    await Promise.resolve(asyncFunction(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export default asyncHandler;
