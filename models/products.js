import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true 
    },
    productCode: {
        type: String,
        required: true 
    },       
    description: {
        type: String,
        required: true 
    },
    areaOfApply: {
        text: { type: String, 
        required: true },     
        files: [{ type: String }] 
    },                        
    image: { 
        type: String,
        required: true 
 
    },                               
    userManual: {
        type: String,
        required: true 

    },                        
    technicalDataSheet: {
        type: String,
        required: true 

    },
      isDeleted: {
        type: Boolean,
        default: false                
    }                 
    },
     { timestamps: true });


export default mongoose.model("Product", productSchema, "products");
