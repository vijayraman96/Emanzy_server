import mongoose, { Schema } from "mongoose";
import { CatgoryDocument } from './../interfaces/category.interface';

const categorySchema = new Schema<CatgoryDocument>(
    {
        category: { type: String, required: true },
        parentCategory: { type: String, default: null },
        categoryLevel: { type: String, required: true },
        categoryImage: { type: String, required: true },
        subCategoryExist: {type: Boolean, required: true }
    }
);

const CategoryModel = mongoose.model<CatgoryDocument>('Category', categorySchema);

export default CategoryModel;