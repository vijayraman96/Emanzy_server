import { ProductDocument } from '../interfaces/product.interface';
import { Request, Response } from "express";
import ProductModel from "../models/product.model";
import { HttpCode, ResponseMessage } from "../constant";
import { getCategory, handleErrorResponse } from "../utils/functions";
import CategoryModel from '../models/category.model';


export const createProduct = async (req: Request<{}, {}, ProductDocument>, res: Response) => {
    try {
        const { name, breadcrumb } = req.body!;

        const category = getCategory(breadcrumb, "last");
        const parentCatgeory = getCategory(breadcrumb, "first");
        const categoryExist = await ProductModel.findOne({ name });
        if (categoryExist) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.productExist });
        }

        let addProduct = { ...req.body, category, parentCatgeory };
        const newProduct = new ProductModel(addProduct);
        await newProduct.save();
        res.status(HttpCode.CREATED).json({ success: true, data: req.validatedData });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
}

export const createNestedCategory = async (req: Request, res: Response) => {
    try {
        const { string } = req.body;

        const categoryArray = [];
        let categoryList = string.split(" -> ");
        let romanLetters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        for (let i = 0; i < categoryList.length - 1; i++) {
            let obj = {
                category: categoryList[i],
                parentCategory: i === 0 ? null : categoryList[i - 1],
                categoryLevel: romanLetters[i],
                categoryImage: "https://rukminim2.flixcart.com/image/200/200/cms-rpd-images/e585e57ccf384bb7a084912a09bb7b3d_1776f155b20_image.jpeg?q=90",
                subCategoryExist: i === (categoryList.length - 2) ? false : true
            }
            categoryArray.push(obj)
        }
        console.log("categoryArray", categoryArray);
        for (const item of categoryArray) {
            const categoryExist = await CategoryModel.findOne({ category: item.category });
            if (categoryExist) continue;
    
            const addCategory = new CategoryModel(item);
            await addCategory.save();
        }
    
        const lastCategoryFetch = await CategoryModel.findOne({ category: categoryArray[categoryArray.length - 1].category });
        res.status(HttpCode.CREATED).json({ success: true, data: lastCategoryFetch });
    
        
    
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
   
}
export const getAllProducts = async(req: Request, res: Response) => {
    try {
        const { category, brand, minPrice, maxPrice } = req.body;

    let filter: any = {availability: true}
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    const getProducts = await ProductModel.find(filter);
    console.log("getProducts", getProducts)
    res.status(HttpCode.SUCCESS).json({ success: true, data: getProducts, message: ResponseMessage.allProductsFetched});
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
    
};


export const getFilterByPriceRange = async (req: Request, res: Response) => {
    try {
        const { category, max, min } = req.body;

        // let filter:any = {category};

        // if(min || max) {
        //     filter.DiscountedPrice = {};
        //     if(min) filter.DiscountedPrice.$gte = min;
        //     if(max) filter.DiscountedPrice.$lte = max
        // }
        console.log("category", category);

        let filterProducts = [
            { $match: { parentCategory: category } },
            {
                $match: {
                    "variants": {
                        $elemMatch: {
                            "SellingPrice": { $gte: min, $lte: max }
                        }
                    }
                }

            }
        ];

        const products = await ProductModel.aggregate(filterProducts);
        res.status(HttpCode.CREATED).json({ success: true, data: products });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST, "The filtration is failed")
    }
}

export const editProduct = async(req: Request, res: Response) => {
    try {
        const {_id, ...data} = req.body;
        console.log("data", data);
        const updateProduct = await ProductModel.findOneAndUpdate({_id: _id},  {$set: data},   { new: true, runValidators: true }  );
        if (!updateProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
    
        res.status(200).json({ message: "Product updated successfully", product: updateProduct });
        
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST, "The product edit is failed")
    }
}

export const deleteProduct = async(req: Request, res: Response) => {
    try {
        const {_id, availability} = req.body;
        const deleteProduct = await ProductModel.findByIdAndUpdate({_id}, { availability: false});
        res.status(200).json({ message: "Product Removed successfully", });

    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST, "The delete product is failed")
    }
}