import { Router } from "express";
import { addProduct, listAllProducts } from "../controllers/productControllers.js";

const productRouter = Router()

productRouter.get('/list', listAllProducts);
productRouter.post('/add', addProduct)

export default productRouter;