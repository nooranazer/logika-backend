import { Router } from "express";
import { addProduct, deleteProduct, getOneProduct, listAllProducts, updateProduct } from "../controllers/productControllers.js";

const productRouter = Router()

productRouter.get('/list', listAllProducts);
productRouter.post('/add', addProduct)
productRouter.get('/view/:id',getOneProduct)
productRouter.patch('/edit/:id', updateProduct)
productRouter.delete('/delete/:id', deleteProduct)

export default productRouter;