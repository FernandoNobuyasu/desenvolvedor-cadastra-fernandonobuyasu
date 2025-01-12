import { Product } from "./Product";

const SERVER_URL = "http://localhost:5000";

function main() {
  console.log(SERVER_URL);
  
  initDrawer();

  initFilters();

  initSort();
}

function initDrawer(): void {
  const backdrop = document.querySelector(".js-backdrop")!;
  const body = document.querySelector("body")!;

  function openDrawer(targetClass: string): void {
    const drawer = document.querySelector(`.${targetClass}`);
    if (drawer) {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      body.classList.add("no-scroll");
    }
  }

  function closeDrawer(targetClass: string): void {
    const drawer = document.querySelector(`.${targetClass}`);
    if (drawer) {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      body.classList.remove("no-scroll");
    }
  }

  function closeAllDrawers(): void {
    document.querySelectorAll(".drawer.active").forEach((drawer) => {
      drawer.classList.remove("active");
    });
    backdrop.classList.remove("active");
    body.classList.remove("no-scroll");
  }

  function initEventListeners(): void {
    document.querySelectorAll(".js-drawer-button").forEach((button) => {
      button.addEventListener("click", () => {
        const targetClass = (button as HTMLElement).dataset.target!;
        openDrawer(targetClass);
      });
    });

    document.querySelectorAll(".js-drawer-close").forEach((button) => {
      button.addEventListener("click", () => {
        const targetClass = (button as HTMLElement).dataset.target!;
        closeDrawer(targetClass);
      });
    });

    backdrop.addEventListener("click", () => {
      closeAllDrawers();
    });
  }

  initEventListeners();
}

function initFilters(): void {
  //TODO: Implementar a lógica de filtros
  initFilterListOverflow();
  initEventListeners();

  function initFilterListOverflow(): void {
    const list = document.querySelector(
      ".js-color-filters-list"
    ) as HTMLElement;

    const listHeight = list.scrollHeight;
    const containerHeight = list.clientHeight;

    if (listHeight > containerHeight) {
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
      list.after(btn);

      btn.addEventListener("click", () => {
        list.classList.toggle("expanded");
        btn.classList.toggle("expanded");
      });
    }
  }

  function toggleFilter(e: Event): void {
    const filterTitle = e.currentTarget as HTMLElement;
    const filterContent = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    filterContent.classList.toggle("expanded-mobile");
    filterTitle.classList.toggle("expanded-mobile");
  }

  function initEventListeners(): void {
    document.querySelectorAll(".js-filter-title").forEach((title) => {
      title.addEventListener("click", toggleFilter);
    });
  }
}

function initSort(): void {
  //TODO: Implementar a lógica de ordenação
  initShowOrderOptionsButton();

  function initShowOrderOptionsButton(): void {
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

document.addEventListener("DOMContentLoaded", main);
