/** Object options use reference equality, as in a JavaScript Set. */
export function AppChips({
  options = [],
  selectedOptions = new Set(),
  onSelectionChanged = () => {},
  optionLabel = String,
  enabled = true,
} = {}) {
  let selection = new Set(selectedOptions);
  const element = document.createElement('div');
  element.className = 'app-chips';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', 'Opciones');
  const chips = [];

  function updateState() {
    for (const { button, option } of chips) {
      button.disabled = !enabled;
      button.setAttribute('aria-pressed', String(selection.has(option)));
    }
  }

  for (const option of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'app-chips__chip';
    button.textContent = optionLabel(option);
    button.addEventListener('click', () => {
      if (!enabled) return;
      const nextSelection = new Set(selection);
      if (nextSelection.has(option)) {
        nextSelection.delete(option);
      } else {
        nextSelection.add(option);
      }
      selection = nextSelection;
      updateState();
      onSelectionChanged(new Set(selection));
    });
    chips.push({ button, option });
    element.append(button);
  }
  updateState();

  return {
    element,
    setSelectedOptions(nextSelection) {
      selection = new Set(nextSelection);
      updateState();
    },
    setEnabled(value) {
      enabled = value;
      updateState();
    },
  };
}
