import { Product } from "../interfaces/product.interface";
import { ProductList } from "./product_list";

export class Sorting {
  private products: Product[] = [];
  private productlist: ProductList;
  private sortButtons: NodeListOf<HTMLButtonElement>;

  constructor(products: Product[], productlist: ProductList) {
    this.products = products;
    this.productlist = productlist;
    this.sortButtons = document.querySelectorAll(".js-sort-button");
  }

  init() {
    this.initShowOptionsButton();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const sortOption = button.value!;
        this.sortProducts(sortOption);
      });
    });
  }

  updateProducts(products: Product[]) {
    this.products = products;
    this.sortProducts("default");
  }

  private sortProducts(option: string) {
    const sortedProducts = [...this.products];
    if (option === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (option === "date-desc") {
      sortedProducts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    this.productlist.setSortedProductList(sortedProducts);
  }

  private initShowOptionsButton(): void {
    const btn = document.querySelector(
      ".js-sort-options-button"
    ) as HTMLElement;
    const orderOptions = document.querySelector(
      ".js-sort-options"
    ) as HTMLElement;

    btn.addEventListener("click", () => {
      orderOptions.classList.toggle("visible");
    });
  }
}
