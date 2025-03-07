

export interface Size {
    size: string;
    quantity: number;
    [key: string]: string | number | boolean;
  }

export interface SellerData {
    sellerName: string,
    sellerAddress: string,
    sellerDescription: string[]
}
export interface Variants {
    color: string
    images: string[]
    storage: string,
    SellingPrice: number,
    DiscountPercentage: number,
    DiscountedPrice: number,
    sku: string,
    quantity: number,
    sizes?: Size[];
}

export interface SingleProduct {
    images: string[]
    storage: string,
    SellingPrice: number,
    DiscountPercentage: number,
    DiscountedPrice: number,
    sku: string,
    quantity: number,
    sizes?: Size[];
}
export interface ProductDescription {
    title: string;
    description: string;
    image: string[];
}

// export interface Ratings {

// }
  
export type ProductDocument = Document & {
    name: string,
    description: string,
    variant: Variants[],
    seller: SellerData[],
    brand: string,
    slug: string,
    returnPolicy: string,
    availability: true,
    shippingDetails: {
        estimatedDelivery: string,
        shippingCost: number,
    },
    breadcrumb: string,
    deleteProduct: boolean,
    productType: "single" | "multiple",
    singleVariant?: boolean,
    variants: SingleProduct | Variants[],
    ProductDescription?: [ProductDescription],
    parentCategory: string,
    category: string,
    categoryId: string
}