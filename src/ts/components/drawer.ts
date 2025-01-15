export class Drawer {
  private backdrop: HTMLElement | null;
  private body: HTMLElement | null;

  constructor() {
    this.backdrop = document.querySelector(".js-backdrop");
    this.body = document.querySelector("body")!;
    this.attachEventListeners();
  }

  private open(targetClass: string): void {
    const drawer = document.querySelector(`.${targetClass}`);
    if (drawer) {
      drawer.classList.add("active");
      if (this.backdrop) this.backdrop.classList.add("active");
      this.body!.classList.add("no-scroll");
    }
  }

  public close(targetClass: string): void {
    const drawer = document.querySelector(`.${targetClass}`);
    if (drawer) {
      drawer.classList.remove("active");
      if (this.backdrop) this.backdrop.classList.remove("active");
      this.body!.classList.remove("no-scroll");
    }
  }

  private closeAll(): void {
    document.querySelectorAll(".drawer.active").forEach((drawer) => {
      drawer.classList.remove("active");
    });
    if (this.backdrop) this.backdrop.classList.remove("active");
    this.body!.classList.remove("no-scroll");
  }

  private attachEventListeners(): void {
    document.querySelectorAll(".js-drawer-button").forEach((button) => {
      button.addEventListener("click", () => {
        const targetClass = (button as HTMLElement).dataset.target!;
        this.open(targetClass);
      });
    });

    document.querySelectorAll(".js-drawer-close").forEach((button) => {
      button.addEventListener("click", () => {
        const targetClass = (button as HTMLElement).dataset.target!;
        this.close(targetClass);
      });
    });

    if (this.backdrop)
      this.backdrop.addEventListener("click", () => {
        this.closeAll();
      });
  }
}
