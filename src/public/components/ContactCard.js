export function ContactCard({ contact, isSelected = false, onSelect = () => {} }) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'contact-card';
  card.dataset.contactId = String(contact.id);
  card.setAttribute('aria-pressed', String(isSelected));

  const avatar = document.createElement('span');
  avatar.className = 'contact-card__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = contact.name.trim().split(/\s+/)
    .filter(Boolean).slice(0, 2).map(part => Array.from(part)[0]).join('').toLocaleUpperCase();

  const name = document.createElement('span');
  name.className = 'contact-card__name';
  name.textContent = contact.name;

  card.append(avatar, name);
  card.addEventListener('click', onSelect);
  return card;
}
