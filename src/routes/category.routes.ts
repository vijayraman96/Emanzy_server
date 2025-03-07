import express from "express";
import { authenticated } from "../middleware/middleware.authenticated";
import {
    createCategory,
    deleteCategoryWithChildren,
    deleteCategoryWithNestedChildUpdate,
    deleteOnlyCategory,
    getCategoriesByCategoryLevel,
    getCategoriesByParentCategory,
    getDeleteCategoryList,
    updateCategoryAndNestedChild,
} from "../controllers/category.controllers";

const router = express.Router();

router.post("/create", authenticated, createCategory);
router.post("/update", authenticated, updateCategoryAndNestedChild);
router.get("/categoriesList", authenticated, getCategoriesByCategoryLevel);
router.get(
    "/categoriesParentList",
    authenticated,
    getCategoriesByParentCategory
);
router.delete("/deleteOnlyCategory", authenticated, deleteOnlyCategory);
router.get(
    "/getDeleteCategoryNestedList",
    authenticated,
    getDeleteCategoryList
);
router.delete(
    "/deleteCategoryWithNestedChildUpdate",
    authenticated,
    deleteCategoryWithNestedChildUpdate
);
router.delete(
    "/deleteCategoryWithNestedChild",
    authenticated,
    deleteCategoryWithChildren
);

export default router;
