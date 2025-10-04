import { Router } from "express";
import { addProduct, getOneProduct, listAllProducts } from "../controllers/productControllers.js";

const productRouter = Router()

productRouter.get('/list', listAllProducts);
productRouter.post('/add', addProduct)
productRouter.get('/view/:id',getOneProduct)

export default productRouter;