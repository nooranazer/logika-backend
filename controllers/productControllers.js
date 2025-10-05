import HttpError from "../middlewares/httpError.js";
import Product from "../models/products.js";

//list
export const listAllProducts = async (req, res, next) => {
  console.log("✅ GET /api/product/list endpoint hit");

  try {
    const products = await Product.find({ isDeleted: false });
    res.status(200).json({
      status: true,
      message: "Successfully listed",
      data: products
    });
  } catch (err) {
    console.error(err);
    return next(HttpError('Server error', 500));
  }
};

//add

export const addProduct = async (req, res, next) => {
  try {
    const { productName, productCode, description, areaOfApplyText } = req.body;

    if (!productName || !productCode || !description || !areaOfApplyText) {
      return next(new HttpError("All required fields must be filled", 422));
    }

    // Handle uploaded files
    const image = req.files?.image
      ? req.files.image[0].path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/")
      : null;

    const userManual = req.files?.userManual
      ? req.files.userManual[0].path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/")
      : null;

    const technicalDataSheet = req.files?.technicalDataSheet
      ? req.files.technicalDataSheet[0].path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/")
      : null;

    const areaOfApplyFiles = req.files?.areaOfApplyFiles
      ? req.files.areaOfApplyFiles.map((f) =>
          f.path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/")
        )
      : [];

  
    const newProduct = await new Product({
      productName,
      productCode,
      description,
      image,
      userManual,
      technicalDataSheet,
      areaOfApply: {
        text: areaOfApplyText,
        files: areaOfApplyFiles,
      },
    }).save();

    if (!newProduct) {
      return next(new HttpError("Failed to add product", 400));
    }

    res.status(201).json({
      status: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Server error", 500));
  }
};



// View Single Product
export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, isDeleted: false });

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to view Product", 500));
  }
};

//update

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateFields = {};

    ["productName", "productCode", "description"].forEach(field => {
      if (req.body[field]) updateFields[field] = req.body[field];
    });

    if (req.body.areaOfApply && req.body.areaOfApply.text) {
      updateFields["areaOfApply.text"] = req.body.areaOfApply.text;
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.image) updateFields.image = req.files.image[0].path.replace(/\\/g, "/");
      if (req.files.userManual) updateFields.userManual = req.files.userManual[0].path.replace(/\\/g, "/");
      if (req.files.technicalDataSheet) updateFields.technicalDataSheet = req.files.technicalDataSheet[0].path.replace(/\\/g, "/");

      if (req.files.areaOfApplyFiles) {
        // Append new files to existing ones
        const product = await Product.findById(id);
        if (!product || product.isDeleted) return next(new HttpError("Product not found", 404));

        const newFiles = req.files.areaOfApplyFiles.map(f => f.path.replace(/\\/g, "/"));
        updateFields["areaOfApply.files"] = [...(product.areaOfApply.files || []), ...newFiles];
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return next(new HttpError("Product not found", 404));

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to update product", 500));
  }
};


//delete
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return next(new HttpError('Product not found', 404));
    }

    res.status(200).json({
      status: true,
      message: 'Product deleted successfully',
      data: null 
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to delete product", 500));
  }
};

