const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    promise
      .resolve(requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};

export default asyncHandler;
