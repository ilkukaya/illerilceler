export function attachListFilter(
  input: HTMLInputElement | null,
  items: HTMLElement[],
  getText: (el: HTMLElement) => string,
  onFilter?: (visibleCount: number) => void,
) {
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLocaleLowerCase("tr-TR");
    let visible = 0;
    items.forEach((el) => {
      const match = !q || getText(el).toLocaleLowerCase("tr-TR").includes(q);
      el.classList.toggle("hidden", !match);
      if (match) visible++;
    });
    onFilter?.(visible);
  });
}
