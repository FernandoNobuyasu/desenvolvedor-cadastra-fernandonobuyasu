import { Product } from "../interfaces/product.interface";
import { ProductList } from "./product_list";
import { Sorting } from "./sorting";

export class Filters {
  private products: Product[];
  private sorting: Sorting;

  constructor(products: Product[], sorting: Sorting) {
    this.products = products;
    this.sorting = sorting;
  }

  init() {
    this.renderFilters();
    this.setEventListeners();
  }

  private renderFilters() {
    this.renderColorFilters();
    this.renderSizeFilters();
    this.renderPriceFilters();
  }

  private renderColorFilters() {
    const colorFilterContainer = document.querySelector(
      ".js-color-filters"
    ) as HTMLElement;
    const uniqueColors = this.products
      .map((product) => product.color)
      .filter((color, index, array) => array.indexOf(color) === index);

    colorFilterContainer.innerHTML = uniqueColors
      .map(
        (color) => `
         <li class="filter__item">
            <input
              class="filter__input js-filter-color"
              type="checkbox"
              id="filter-color-${color.toLocaleLowerCase()}"
              name="filter_color"
              value="${color.toLocaleLowerCase()}"
            />
            <label class="filter__label" for="filter-color-${color.toLocaleLowerCase()}">
              ${color}
            </label
            >
        </li>
        `
      )
      .join("");

    this.setColorFilterListOverflow();
  }

  private renderSizeFilters() {
    const sizeFilterContainer = document.querySelector(".js-filters-size");
    const uniqueSizes = this.products
      .flatMap((product) => product.size)
      .filter((size, index, array) => array.indexOf(size) === index);

    if (sizeFilterContainer)
      sizeFilterContainer.innerHTML = uniqueSizes
        .map(
          (size) => `
          <li class="filter__item">
            <input
              class="filter__input js-filter-size"
              type="checkbox"
              id="filter-size-${size}"
              name="filter_size"
              value="${size}"
            />
            <label class="filter__label--square" for="filter-size-${size}"
              >${size}</label
            >
          </li>
          `
        )
        .join("");
  }

  private renderPriceFilters() {
    const priceFilterContainer = document.querySelector(
      ".js-filters-price"
    ) as HTMLElement | null;
    const priceRanges = [
      { min: 0, max: 50, label: "de R$0 até R$ 50" },
      { min: 51, max: 150, label: "R$ 51 até R$ 150" },
      { min: 151, max: 300, label: "R$ 151 até R$ 300" },
      { min: 301, max: 500, label: "R$ 301 até R$ 500" },
      { min: 500, max: Infinity, label: "a partir de R$ 500" },
    ];
    if (priceFilterContainer)
      priceFilterContainer.innerHTML = priceRanges
        .map(
          ({ min, max, label }) => `
            
          <li class="filter__item">
            <input
              class="filter__input js-filter-price"
              type="checkbox"
              data-min="${min}"
              data-max="${max}"
              id="filter-price-${min}-${max}"
              name="filter_price"
              value="0-50"
            />
            <label class="filter__label" for="filter-price-${min}-${max}"
              >${label}</label
            >
          </li>
          `
        )
        .join("");
  }

  private setEventListeners() {
    const debounceFilter = this.debounce(() => {
      this.applyFilters();
    }, 300);

    document
      .querySelectorAll(".js-filter-title")
      .forEach((title) => title.addEventListener("click", this.toggleFilter));

    document
      .querySelectorAll(".js-filter-color")
      .forEach((checkbox) =>
        checkbox.addEventListener("change", debounceFilter)
      );

    document
      .querySelectorAll(".js-filter-size")
      .forEach((checkbox) =>
        checkbox.addEventListener("change", debounceFilter)
      );

    document
      .querySelectorAll(".js-filter-price")
      .forEach((checkbox) =>
        checkbox.addEventListener("change", debounceFilter)
      );
  }

  private applyFilters() {
    const selectedColors = Array.from(
      document.querySelectorAll(".js-filter-color:checked")
    ).map((input) => (input as HTMLInputElement).value.toLocaleLowerCase());

    const selectedSizes = Array.from(
      document.querySelectorAll(".js-filter-size:checked")
    ).map((input) => (input as HTMLInputElement).value.toLocaleLowerCase());

    const selectedPriceRanges = Array.from(
      document.querySelectorAll(".js-filter-price:checked")
    ).map((input) => ({
      min: parseFloat((input as HTMLInputElement).dataset.min!),
      max: parseFloat((input as HTMLInputElement).dataset.max!),
    }));

    const filteredProducts = this.products.filter((product) => {
      const matchesColor = selectedColors.length
        ? Array.isArray(product.color)
          ? product.color.some((color) =>
              selectedColors.includes(color.toLowerCase())
            )
          : selectedColors.includes(product.color.toLowerCase())
        : true;

      const matchesSize = selectedSizes.length
        ? product.size.some((size) =>
            selectedSizes.includes(size.toLowerCase())
          )
        : true;

      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some(
          (range) => product.price >= range.min && product.price <= range.max
        );

      return matchesColor && matchesSize && matchesPrice;
    });
    this.sorting.updateProducts(filteredProducts);
  }

  private debounce(func: Function, wait: number = 300) {
    let timeout: number;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  }

  private listHasOverflow(list: HTMLElement | null): boolean {
    if (!list) return false;

    const listHeight = list.scrollHeight;
    const containerHeight = list.clientHeight;

    return listHeight > containerHeight ? true : false;
  }

  private addLoadMoreButtonAfterList(list: HTMLElement | null): void {
    const btn = document.createElement("button");
    btn.classList.add(
      "filter__show-all-colors",
      "js-show-all-colors",
      "mobile-hidden"
    );
    btn.innerHTML = `
        <span>Ver todas as cores</span>
        <img
          src="img/icons/arrow.svg"
          alt="Seta para baixo"
          width="7"
          height="7"
        />
      `;
    if (list) {
      list.after(btn);
      btn.addEventListener("click", () => {
        list.classList.toggle("expanded");
        btn.classList.toggle("expanded");
      });
    }
  }

  private setColorFilterListOverflow(): void {
    const list = document.querySelector(".js-color-filters") as HTMLElement;

    if (this.listHasOverflow(list)) {
      this.addLoadMoreButtonAfterList(list);
    }
  }

  private toggleFilter(e: Event): void {
    const filterTitle = e.currentTarget as HTMLElement;
    const filterContent = (e.currentTarget as HTMLElement)
      .nextElementSibling as HTMLElement;
    filterContent.classList.toggle("expanded-mobile");
    filterTitle.classList.toggle("expanded-mobile");
  }
}
