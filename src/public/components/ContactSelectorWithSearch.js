import { ContactCard } from './ContactCard.js';

/** Contacts: [{ id: number, name: string }]. Returns only the selected ID. */
export function ContactSelectorWithSearch({
  contacts = [],
  selectedContactId = null,
  onContactIdSelected = () => {},
} = {}) {
  const element = document.createElement('section');
  element.className = 'contact-selector';

  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'contact-selector__search';
  search.placeholder = 'Buscar contacto...';
  search.setAttribute('aria-label', 'Buscar contacto');

  const grid = document.createElement('div');
  grid.className = 'contact-selector__grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Contactos');

  const status = document.createElement('p');
  status.className = 'contact-selector__status';
  status.setAttribute('role', 'status');
  element.append(search, grid, status);

  function renderContacts() {
    const query = search.value.trim().toLocaleLowerCase();
    const filtered = contacts.filter(contact =>
      contact.name.toLocaleLowerCase().includes(query)
    );
    grid.replaceChildren();
    for (const contact of filtered) {
      const card = ContactCard({
        contact,
        isSelected: contact.id === selectedContactId,
        onSelect: () => {
          selectedContactId = contact.id;
          // Update in place to preserve keyboard focus on the selected card.
          for (const button of grid.children) {
            button.setAttribute('aria-pressed', String(button === card));
          }
          onContactIdSelected(contact.id);
        },
      });
      grid.append(card);
    }
    status.textContent = filtered.length ? '' :
      (contacts.length ? 'No se encontraron contactos.' : 'No hay contactos disponibles.');
    status.hidden = filtered.length > 0;
  }

  search.addEventListener('input', renderContacts);
  renderContacts();

  return {
    element,
    setContacts(nextContacts) {
      contacts = nextContacts;
      renderContacts();
    },
    setSelectedContactId(id) {
      selectedContactId = id;
      renderContacts();
    },
  };
}

