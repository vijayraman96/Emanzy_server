import { Request, Response } from "express";
import UserModel from "../models/auth.model";
import { CatgoryDocument } from "../interfaces/category.interface";
import CategoryModel from "../models/category.model";
import { HttpCode, ResponseMessage } from "../constant";
import { handleErrorResponse } from "../utils/functions";

export const createCategory = async (req: Request<{}, {}, CatgoryDocument>, res: Response) => {
    try {
        const { category, parentCategory, categoryLevel, categoryImage } = req.body!;
        const categoryExist = await CategoryModel.findOne({ category });
        if (categoryExist) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.categoryExist });
        }
        let addCategory = { ...req.body };

        const newCategory = new CategoryModel(addCategory);
        await newCategory.save();
        res.status(HttpCode.CREATED).json({ success: true, data: req.validatedData });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
}

// export const updateCategory = async (req: Request<{ id: string }, {}, Partial<CatgoryDocument>>, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { category, parentCategory, categoryLevel, categoryImage } = req.validatedData;

//         // Check if category exists
//         const existingCategory = await CategoryModel.findById(id);
//         if (!existingCategory) {
//           return res
//             .status(HttpCode.NOT_FOUND)
//             .json({ error: "Category not found" });
//         }
//         const updatedCategory = await CategoryModel.findByIdAndUpdate(
//             id,
//             { category, parentCategory, categoryLevel, categoryImage },
//             { new: true, runValidators: true }
//           );

//           res.status(HttpCode.SUCCESS).json({ success: true, data: updatedCategory });
//     } catch (error) {
//         handleErrorResponse(res,error, HttpCode.BAD_REQUEST)
//     }
// }

export const updateCategoryAndNestedChild = async (req: Request, res: Response) => {
    try {
        const { oldCategoryName, newCategoryName } = req.body;

        const categoryExist = await CategoryModel.findOne({ category: oldCategoryName });

        if (!categoryExist) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.categoryExist });
        }

        if (!oldCategoryName || !newCategoryName) {
            return res.status(400).json({ message: "Both old and new category names are required." });
        }

        const updatedCategory = await CategoryModel.findOneAndUpdate(
            { category: oldCategoryName },
            { $set: { category: newCategoryName } },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        await CategoryModel.updateMany(
            { parentCategory: oldCategoryName },
            { $set: { parentCategory: newCategoryName } }
        );

        res.status(200).json({
            success: true,
            message: "Category name updated and parentCategory updated in nested categories."
        });

    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST);
    }
};

export const getCategoriesByCategoryLevel = async (req: Request, res: Response) => {
    try {
        const { categoryLevel } = req.body;
        if (!categoryLevel) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.parentCategoryNotFound });
        }
        const categories = await CategoryModel.find({ categoryLevel });

        if (!categories.length) {
            return res.status(HttpCode.NOT_FOUND).json({ error: ResponseMessage.noCategoryFound });
        }

        res.status(HttpCode.SUCCESS).json({ success: true, data: categories });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
};

export const getCategoriesByParentCategory = async (req: Request, res: Response) => {
    try {
        const { parentCategory } = req.body;
        if (!parentCategory) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.parentCategoryNotFound });
        }

        const categories = await CategoryModel.find({ parentCategory: parentCategory });

        if (!categories.length) {
            return res.status(HttpCode.NOT_FOUND).json({ error: ResponseMessage.noCategoryFound });
        }

        res.status(HttpCode.SUCCESS).json({ success: true, data: categories });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
};

export const getDeleteCategoryList = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;
        const categoryToDelete = await CategoryModel.findOne({ category });

        if (!categoryToDelete) {
            return res.status(HttpCode.NOT_FOUND).json({ error: ResponseMessage.noCategoryFound });
        }
        const childCategories = await CategoryModel.find({ parentCategory: category });

        if (!childCategories.length) {
            return res.status(HttpCode.NOT_FOUND).json({ message: ResponseMessage.noChildCategoryFound });
        }

        res.status(HttpCode.SUCCESS).json({ success: true, message: ResponseMessage.successfullyRetrievedChildCategories, data: childCategories });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
}

export const deleteOnlyCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;
        const categoryFound = await CategoryModel.findOne(
            { category: category },
        );

        if (!categoryFound) {
            return res.status(404).json({ message: "Category not found" });
        }


        await CategoryModel.deleteOne({ category: category });
        res.status(200).json({
            success: true,
            message: "Category deleted and child categories reassigned."
        });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
}

export const deleteCategoryWithNestedChildUpdate = async (req: Request, res: Response) => {
    try {
        const { category, newCategoryName, parentCategory, categoryLevel, categoryImage, subCategoryExist } = req.body;
        let addCategory = { category: newCategoryName, parentCategory, categoryLevel, categoryImage, subCategoryExist };
        const newCategory = new CategoryModel(addCategory);
        await newCategory.save();

        await CategoryModel.updateMany(
            { parentCategory: category },
            { $set: { parentCategory: newCategoryName } }
        );
        const categoryExist = await CategoryModel.findOne({ category });
        if (!categoryExist) {
            return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.categoryExist });
        }
        await CategoryModel.deleteOne({ category: category });
        res.status(200).json({
            success: true,
            message: "Category deleted and child categories reassigned."
        });
    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
}


export const deleteCategoryWithChildren = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;

        if (!category) {
            return res.status(400).json({ message: "Category name is required." });
        }
        const categoryToDelete = await CategoryModel.findOne({ category: category });
        if (!categoryToDelete) {
            return res.status(404).json({ message: "Category not found." });
        }
        const getAllChildCategories = async (parentCategory: string) => {
            const children = await CategoryModel.find({ parentCategory });
            let allChildren = children.map(cat => cat.category);

            for (const child of children) {
                const subChildren = await getAllChildCategories(child.category);
                allChildren = allChildren.concat(subChildren);
            }

            return allChildren;
        };

        const allCategoriesToDelete = await getAllChildCategories(category);
        allCategoriesToDelete.push(category);
        await CategoryModel.deleteMany({ category: { $in: allCategoriesToDelete } });

        res.status(200).json({
            success: true,
            message: `Category '${category}' and all its nested children deleted successfully.`,
            deletedCategories: allCategoriesToDelete
        });

    } catch (error) {
        handleErrorResponse(res, error, HttpCode.BAD_REQUEST)
    }
};
