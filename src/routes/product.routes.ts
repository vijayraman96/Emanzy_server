import express, {Request, Response} from "express";

import { createNestedCategory, createProduct, deleteProduct, editProduct, getAllProducts, getFilterByPriceRange} from "../controllers/product.controller";
import { authenticated } from "../middleware/middleware.authenticated";
import { validate } from "../validators/validation";

// import passport from '../config/googlePassport';
const router = express.Router();
// import passport from '../config/googlePassport'

router.post("/create", authenticated, createProduct);

router.post("/productCategory", authenticated, createNestedCategory);
router.get("/filterByPriceRange", authenticated, getFilterByPriceRange);
router.get("/getAllProducts", authenticated, getAllProducts);
router.put("/editProduct", authenticated, editProduct);
router.delete("/deleteProduct", authenticated, deleteProduct);

export default router