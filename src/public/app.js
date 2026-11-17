import { ContactSelectorWithSearch } from './components/ContactSelectorWithSearch.js';
import { AppChips } from './components/AppChips.js';


// Replace this array with the contacts from your data source: [{ id: 1, name: 'Nombre' }].
const contacts =[
  { "id": 1, "name": "Adolfo Peña", "number": "5491155786120" },
  { "id": 21, "name": "Agustin De Giacomi", "number": "5491168721737" },
  { "id": 2, "name": "Albano Orccellet", "number": "5491156465935" },
  { "id": 3, "name": "Alejandro Scalesi", "number": "5491137939880" },
  { "id": 4, "name": "Ana Sofia Jimenez", "number": "5491133107572" },
  { "id": 5, "name": "Andrea Fund", "number": "5491156951597" },
  { "id": 6, "name": "Andrea Puracchio", "number": "5491158754273" },
  { "id": 9, "name": "Armando Bartuli", "number": "5491134365878" },
  { "id": 47, "name": "Armin Molas", "number": "595971333938" },
  { "id": 11, "name": "Daniela Betancourt", "number": "5491123920053" },
  { "id": 13, "name": "Diego Turano", "number": "5491133110143" },
  { "id": 14, "name": "Ezequiel Rubino", "number": "5491164366757" },
  { "id": 15, "name": "Federico Bascaran", "number": "5491137939879" },
  { "id": 12, "name": "Francisco Calviño", "number": "5491159374812" },
  { "id": 16, "name": "Franco Peliza", "number": "5491123724123" },
  { "id": 17, "name": "Gina Rengifo", "number": "5491123886950" },
  { "id": 18, "name": "Gonzalo Couso", "number": "5491155955359" },
  { "id": 30, "name": "Gonzalo Jauregui", "number": "5491171122857" },
  { "id": 19, "name": "Gonzalo Zurdo", "number": "5493413358609" },
  { "id": 20, "name": "Gustavo Flores", "number": "5491171025196" },
  { "id": 23, "name": "Iñaki Rodriguez Gaete", "number": "5491162376633" },
  { "id": 24, "name": "Javier Maques", "number": "5491133110126" },
  { "id": 25, "name": "Jenaro Tisera", "number": "5491137771451" },
  { "id": 31, "name": "Joel Vallejo", "number": "5491132658759" },
  { "id": 26, "name": "Jose Luis Ortega", "number": "5491133107989" },
  { "id": 27, "name": "Joyce Garcia", "number": "5491168715538" },
  { "id": 28, "name": "Juan Mertens", "number": "5491135791350" },
  { "id": 29, "name": "Julia Baldassarre", "number": "5491145782818" },
  { "id": 49, "name": "Leo Leiva", "number": "5491159679622" },
  { "id": 32, "name": "Luciano D'Alessandro", "number": "5493413358424" },
  { "id": 33, "name": "Luciano Mascolo", "number": "5491159022338" },
  { "id": 34, "name": "Marielba Rodriguez", "number": "5491161382339" },
  { "id": 35, "name": "Matias De Giacomi", "number": "5491149394629" },
  { "id": 36, "name": "Mauricio Primavera", "number": "5491138625095" },
  { "id": 37, "name": "Nazarena Monzon", "number": "5491132973551" },
  { "id": 39, "name": "Nicolas Chujbeb", "number": "5491128743287" },
  { "id": 38, "name": "Nicolas Foti", "number": "5491154046746" },
  { "id": 40, "name": "Osvaldo Medina", "number": "5491150132799" },
  { "id": 41, "name": "Osvaldo Seoane", "number": "5491133108313" },
  { "id": 42, "name": "Pablo Schivo", "number": "5491126464830" },
  { "id": 22, "name": "Robert Diego Bentos", "number": "5491126889465" },
  { "id": 43, "name": "Santiago Eastman", "number": "5491133107944" },
  { "id": 48, "name": "Stefani Dure", "number": "595992998254" },
  { "id": 44, "name": "Walter Jimenez", "number": "5491154901511" },
  { "id": 45, "name": "Ximena Poggi", "number": "5491156461371" }
]
let selectedContactId = null;

const contactSelector = ContactSelectorWithSearch({
  contacts,
  selectedContactId,
  onContactIdSelected: (id) => {
    selectedContactId = id;
  },
});
let selectedOptions = new Set();

const chips = AppChips({
  options: ['🛵 Delivery/PedidosYa', '🤝 Visita/Reunión', '📤 Retiro','📥 Entrega','📦 Paquete/Documentación recibida'],
  selectedOptions: new Set(),
  optionLabel: (option) => option,
  onSelectionChanged: (selected) => {
    selectedOptions = selected; 
  },
});
document.querySelector('#chips-container').append(chips.element);
document.querySelector('#contact-selector').append(contactSelector.element);


document.getElementById('submit-button').addEventListener('click', async () => {
    const number = contacts.find(contact => contact.id === selectedContactId)?.number;
    const motivos = Array.from(selectedOptions).map(option => option).join(', ');
    const detalle = document.getElementById('detalle').value;
    const mensaje = `👋 ¡Hola! Tenés un mensaje desde la recepción.\n*Motivo/s:* ${motivos}\n*Detalle:* ${detalle}`;
    try {
        const respuesta = await fetch('./avisos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numero: number,
                mensaje: mensaje,
            }),
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || 'No se pudo enviar el aviso');
        }

        alert(datos.mensaje);
    } catch (error) {
        alert(error.message);
    }
});

