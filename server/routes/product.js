import express from 'express';
import { addProduct, editProduct, getAllProduct, removeProduct } from '../controller/product.js';
import userAuthentication from '../middleware/userAuthentication.js';
import uploadFile from '../middleware/uploadFile.js';

const product = express.Router();

product.post("/", userAuthentication, uploadFile.single("productimage"), addProduct)
product.get("/", userAuthentication, getAllProduct);
product.delete("/:productId", userAuthentication, removeProduct);
product.patch("/:productId", userAuthentication, editProduct);

export default product;