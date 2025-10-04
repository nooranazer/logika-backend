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
    const {
      productName,
      productCode,
      description,
      areaOfApply,
      image,
      userManual,
      technicalDataSheet
    } = req.body;

    const newProduct = await new Product({
      productName,
      productCode,
      description,
      areaOfApply,
      image,
      userManual,
      technicalDataSheet
    }).save();

    if (!newProduct) {
      return next(new HttpError('no data found', 400));
    }

    return res.status(200).json({
      status: true,
      message: 'Product added successfully',
      data: newProduct
    });

  } catch (error) {
    console.error(error);
    return next(new HttpError('server error', 500));
  }
};
