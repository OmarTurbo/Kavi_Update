import { protect } from "./authMiddleware";
import globalErrorHandler  from "./errorMiddleware";
import { restrictTo } from "./restrictToMiddleware";

export {
  protect,
  globalErrorHandler,
  restrictTo
};