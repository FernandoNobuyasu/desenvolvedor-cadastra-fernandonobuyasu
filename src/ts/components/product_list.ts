import { Product } from "../interfaces/product.interface";
import { Cart } from "./cart";

interface CartProduct extends Product {
  quantity: number;
  variant: string;
}

export class ProductList {
  private productList: HTMLElement | null;
  private loadMoreButton: HTMLElement | null;
  private pageSize: number;
  private currentIndex: number;
  private totalProducts: Product[] = [];
  private renderedProducts: Product[] = [];
  private cart: Cart;

  constructor(products: Product[], cart: Cart) {
    this.totalProducts = products;
    this.cart = cart;
    this.productList = document.querySelector(".js-products-list")!;
    this.loadMoreButton = document.querySelector(".js-load-more-button")!;
    this.pageSize = 6;
    this.currentIndex = this.pageSize;
    this.initProductList();
  }

  private initProductList(): void {
    this.renderProductsHtlm(this.totalProducts.slice(0, this.pageSize));
    this.setupLoadMoreButton();
  }

  private setupLoadMoreButton(): void {
    if (this.loadMoreButton) {
      if (this.currentIndex <= this.totalProducts.length) {
        this.loadMoreButton.classList.remove("hidden");
      }
      this.loadMoreButton.addEventListener("click", () => {
        this.handleLoadMoreClick();
      });
    }
  }

  public setSortedProductList(sortedProducts: Product[]) {
    this.currentIndex = this.pageSize;
    this.totalProducts = sortedProducts;
    this.renderProductsHtlm(this.totalProducts.slice(0, this.pageSize));
    this.setupLoadMoreButton();
  }

  private renderProductsHtlm(renderedProducts: Product[]): void {
    const productsHTML = renderedProducts
      .map(
        (product) => `
      <li class="product">
        <div class="product__image">
          <img
            src="${product.image}"
            alt="${product.name}"
            width="195"
            height="293"
          />
        </div>
        <div class="product__info">
          <h2 class="product__name">${product.name}</h2>
          <p class="product__price">R$ ${product.price.toFixed(2)}</p>
          <p class="product__installment">até ${
            product.parcelamento[0]
          } de R$ ${product.parcelamento[1].toFixed(2)}</p>
          <button data-id="${
            product.id
          }" class="product__button">Comprar</button>
        </div>
      </li>
    `
      )
      .join("");

    if (this.productList) this.productList.innerHTML = productsHTML;

    renderedProducts.forEach((product) => {
      document
        .querySelector(`button.product__button[data-id="${product.id}"]`)!
        .addEventListener("click", () => {
          this.cart.addProductToCart(product as CartProduct);
        });
    });
  }

  private handleLoadMoreClick(): void {
    this.currentIndex += this.pageSize;
    this.renderProductsHtlm(this.totalProducts.slice(0, this.currentIndex));
    if (this.currentIndex >= this.totalProducts.length) {
      if (this.loadMoreButton) this.loadMoreButton.classList.add("hidden");
    }
  }
}
