import { Product } from "../interfaces/product.interface";
interface CartProduct extends Product {
  quantity: number;
}

export class Cart {
  private cartProducts: CartProduct[];

  constructor() {
    this.cartProducts = [];
  }

  public addProductToCart(product: CartProduct) {
    const existingProduct: CartProduct | undefined = this.cartProducts.find(
      (p) => p.id === product.id
    );
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      this.updateCartItemQuantity(existingProduct);
    } else {
      product.quantity = 1;
      this.cartProducts.push(product);
      this.addCartItemToDOM(product);
    }
    this.updateCartTotal();
    this.updateCartCount();
  }

  private updateCartItemQuantity(product: CartProduct) {
    const cartItem = document.querySelector(
      `[data-product-id="${product.id}"]`
    );
    if (!cartItem) return;

    const quantityElement = cartItem.querySelector(".cart-product__quantity");
    if (quantityElement) {
      quantityElement.textContent = `Quantidade: ${product.quantity}`;
    }
  }

  private addCartItemToDOM(product: CartProduct) {
    const cartElement = document.querySelector(".js-cart-list");
    if (!cartElement) return;

    const productElement = this.createCartProductElement(product);
    cartElement.appendChild(productElement);
  }

  private createCartProductElement(product: CartProduct): HTMLElement {
    var div = document.createElement("div");
    div.innerHTML = `
      <li class="cart-product" data-product-id="${product.id.toString()}">
        <div class="cart-product__image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="cart-product__info">
          <h3 class="cart-product__name">${product.name}</h3>
          <p class="cart-product__quantity">Quantidade: ${product.quantity}</p>
          <p class="cart-product__price">R$ ${product.price}</p>
          <p class="cart-product__color">Cor: ${product.color}</p>
          <p class="cart-product__size">Tamanho: ${product.size}</p>
        </div>
        <button class="cart-product__remove" type="button" title="Remover produto">
          <img src="./img/icons/close.svg" alt="Remover produto">
        </button>
      </li>
    `.trim();

    div
      .querySelector(".cart-product__remove")!
      .addEventListener("click", () => this.removeProductFromCart(product.id));

    return div.firstChild as HTMLElement;
  }

  private removeProductFromCart(productId: string) {
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
    if (!cartItem) return;

    this.cartProducts = this.cartProducts.filter((p) => p.id !== productId);
    cartItem.remove();
    this.updateCartTotal();
  }

  private updateCartTotal() {
    const cartTotal = document.querySelector(".js-cart-total");
    if (!cartTotal) return;

    const total = this.cartProducts.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  }
  private updateCartCount() {
    const cartCount = document.querySelector(".js-cart-count");
    if (!cartCount) return;

    const count = this.cartProducts.reduce((sum, product) => {
      return sum + (product.quantity || 1);
    }, 0);

    cartCount.textContent = `${count}`;
  }
}
