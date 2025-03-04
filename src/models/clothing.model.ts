import mongoose, { Schema } from "mongoose";
import ProductModel from "./g";
import { otherSpecsSchema } from "./common.model";

const clothingSchema = new Schema(
    {
        otherSpecs: [otherSpecsSchema]
    });

const ClothingModel = ProductModel.discriminator("Clothing", clothingSchema);

export default ClothingModel;