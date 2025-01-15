import { fetchProductsData } from "./services/product_services";
import { ProductList } from "./components/product_list";
import { Drawer } from "./components/drawer";
import { Filters } from "./components/filters";
import { Sorting } from "./components/sorting";
import { Cart } from "./components/cart";
import { Product } from "./interfaces/product.interface";

const SERVER_URL = "http://localhost:5000";

async function main() {
  const products: Product[] = await fetchProductsData(SERVER_URL);

  const cart = new Cart();

  const productlist = new ProductList(products, cart);

  const sorting = new Sorting(products, productlist);

  const filters = new Filters(products, sorting);

  new Drawer();

  sorting.init();

  filters.init();
}

document.addEventListener("DOMContentLoaded", main);
