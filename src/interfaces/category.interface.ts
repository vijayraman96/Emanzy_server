


export type CatgoryDocument = Document & {
    category: string,
    parentCategory: string | null,
    categoryLevel: string,
    categoryImage: string,
    subCategoryExist: boolean;
}

