import path from 'path';
import fs from 'fs';
import ProductModel from "../models/productSchema.js";

const removeUploadedFile = (filename) => {
    const filePath = path.join( `${process.env.UPLOAD_DIRECTORY}/productimage`, filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            throw new Error("Internal Server Error");
        }
    });
};

const addProduct = async (req, res) => {
    try {
        const { title, price, description } = req.body;
        const image = req.file.filename;
        const authorId = req.user._id.toString();

        if (!title || !price || !description || !image) {
            if (image) removeUploadedFile(image);
            return res.status(400).json({ status: false, message: 'All fields are required.' });
        }

        if (isNaN(price) || Number(price) <= 0) {
            if (image) removeUploadedFile(image);
            return res.status(400).json({ status: false, message: 'Price must be a valid number greater than 0.' });
        }

        const newProduct = await ProductModel({
            title,
            price,
            description,
            image,
            authorId,
            createdAt: new Date()
        })

        const savedProduct = await newProduct.save();
        if (savedProduct) {
            return res.status(201).json({ status: true, message: "Product created successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Something Went Wrong" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const removeProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const authorId = req.user._id.toString();
        const product = await ProductModel.findOne({ _id: productId, authorId });
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        if (product.image) {
            removeUploadedFile(product.image);
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (deletedProduct) {
            return res.status(200).json({ status: true, message: "Product Deleted Successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Something Went Wrong" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const editProduct = async (req, res) => {

}

const getAllProduct = async (req, res) => {
    try {

        const authorId = req.user._id.toString();
        const products = await ProductModel.find({ authorId });
        return res.status(200).json({ status: true, products });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

export { addProduct, removeProduct, editProduct, getAllProduct };