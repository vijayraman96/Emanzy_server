
import { Variants, SingleProduct, ProductDocument, ProductDescription, SellerData, Size } from "interfaces/product.interface";
import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema<Size>({
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  });
const sellerData = new Schema<SellerData>({
    sellerName: { type: String, required: true },
    sellerAddress: { type: String, required: true },
    sellerDescription: {type: [String]}
  });
  const ProductDescription = new Schema<ProductDescription> ({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image:{type: [String]}
  })
  const variantSchema = new Schema<Variants>({
    color: { type: String, required: true },
    images: [{ type: String, required: true }],
    storage: { type: String, required: true },
    SellingPrice: { type: Number, required: true },
    DiscountPercentage: { type: Number, required: true },
    DiscountedPrice: { type: Number, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    sizes: [sizeSchema],
  });
  
  const singleProductSchema = new Schema<SingleProduct>({
    images: [{ type: String, required: true }],
    storage: { type: String, required: true },
    SellingPrice: { type: Number, required: true },
    DiscountPercentage: { type: Number, required: true },
    DiscountedPrice: { type: Number, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    sizes: [sizeSchema],
  });
  
  const productSchema = new Schema<ProductDocument>(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      seller: sellerData,
      brand: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      returnPolicy: { type: String, required: true },
      availability: { type: Boolean, required: true, default: true },
      shippingDetails: {
        estimatedDelivery: { type: String, required: true },
        shippingCost: { type: Number, required: true },
      },
      breadcrumb: { type: String, required: true },
      deleteProduct: { type: Boolean, required: true, default: false },
      productType: { type: String, enum: ["single", "multiple"], required: true },
      singleVariant: { type: Boolean },
      variants: {
        type: Schema.Types.Mixed, // Allows either an array of Variants or a single object
        required: true,
      },
      ProductDescription: [ProductDescription],
      parentCategory: { type: String, required: true },
      category: { type: String, required: true },
      categoryId: { type: String, required: true },
    },

    { timestamps: true }
  );

  const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;