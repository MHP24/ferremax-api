export type Product = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  keywords: string[];
};

export type TProduct = Product & {
  ProductCategory: { name: string };
  ProductBrand: { name: string };
};

export type ProductFormatted = Omit<Product, 'productId'> & {
  id: string;
  brand: string;
  category: string;
};
