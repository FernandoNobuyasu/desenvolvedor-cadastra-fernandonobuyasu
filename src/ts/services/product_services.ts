import { Product } from "../interfaces/product.interface";

export const fetchProductsData = async (
  baseUrl: string
): Promise<Product[]> => {
  const PRODUCTS_ENDPOINT = "products";
  try {
    const response = await fetch(`${baseUrl}/${PRODUCTS_ENDPOINT}`);
    if (!response.ok) {
      throw new Error("Network response error");
    }
    const productsData = await response.json();
    return productsData;
  } catch (error) {
    console.error("Error fetching products data:", error);
    throw error;
  }
};
