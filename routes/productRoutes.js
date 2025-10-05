import { Router } from "express";
import { addProduct, deleteProduct, getOneProduct, listAllProducts, updateProduct } from "../controllers/productControllers.js";
import { uploadFields } from "../middlewares/upload.js";

const productRouter = Router()

productRouter.get('/list', listAllProducts);
productRouter.post('/add', uploadFields, addProduct)
productRouter.get('/view/:id',getOneProduct)
productRouter.patch('/edit/:id', uploadFields, updateProduct)
productRouter.delete('/delete/:id', deleteProduct)

export default productRouter;