import './styles.css';

const app = document.getElementById('app');
app.innerHTML = `<h1>Menu pizzetas</h1>
<h3> escoge tu sabor y cantidad </h3>`

// Crear el menú
const menu = [
    { name: 'Hawaina', price: 6000 },
    { name: 'Pollo', price: 7000 },
    { name: 'Criolla', price: 8000 },
];

let selectedOrder = [];

// Crear función para renderizar el menú
function renderMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu';

    menu.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <span>${item.name} - $${item.price}</span>
            <input type="number" min="0" id="quantity-${index}" placeholder="Cantidad">
            <button id="add-btn-${index}">Añadir</button>
        `;
        menuDiv.appendChild(itemDiv);
    });

    app.appendChild(menuDiv);

    // Añadir event listeners a los botones
    menu.forEach((item, index) => {
        const addButton = document.getElementById(`add-btn-${index}`);
        addButton.addEventListener('click', () => addItem(index));
    });
}

// Crear función para añadir items al pedido
function addItem(index) {
    const quantityInput = document.getElementById(`quantity-${index}`);
    const quantity = parseInt(quantityInput.value);

    if (quantity > 0) {
        const orderItem = {
            name: menu[index].name,
            price: menu[index].price,
            quantity: quantity,
        };

        selectedOrder.push(orderItem);
        renderOrder();
    }
}

// Crear función para renderizar el pedido
function renderOrder() {
    let orderDiv = document.getElementById('order');

    if (!orderDiv) {
        orderDiv = document.createElement('div');
        orderDiv.id = 'order';
        app.appendChild(orderDiv);
    }

    orderDiv.innerHTML = '<h2>Pedido</h2>';
    let total = 0;

    selectedOrder.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <span>${item.name} - ${item.quantity} x $${item.price}</span>
        `;
        orderDiv.appendChild(itemDiv);
        total += item.price * item.quantity;
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'order-total';
    totalDiv.innerHTML = `Total: $${total}`;
    orderDiv.appendChild(totalDiv);
}

renderMenu();
