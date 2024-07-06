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
let orderCount = 0; // Contador de pedidos
let orders = []; // Lista de pedidos completos

// Crear función para renderizar el menú
function renderMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu';

    // Crear la tabla
    const table = document.createElement('table');
    table.className = 'menu-table';

    // Crear encabezados de la tabla
    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Añadir</th>
        </tr>
    `;
    table.appendChild(header);

    // Crear cuerpo de la tabla
    const body = document.createElement('tbody');

    menu.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><input type="number" min="0" id="quantity-${index}" placeholder="Cantidad"></td>
            <td><button id="add-btn-${index}">Añadir</button></td>
        `;
        body.appendChild(row);
    });

    table.appendChild(body);
    menuDiv.appendChild(table);
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
        const existingItemIndex = selectedOrder.findIndex(item => item.name === menu[index].name);

        if (existingItemIndex !== -1) {
            // Si el ítem ya está en el pedido, actualizar la cantidad
            selectedOrder[existingItemIndex].quantity += quantity;
        } else {
            // Si el ítem no está en el pedido, añadirlo
            const orderItem = {
                name: menu[index].name,
                price: menu[index].price,
                quantity: quantity,
            };

            selectedOrder.push(orderItem);
        }

        renderOrder();

        // Restablecer el valor del campo de cantidad a cero
        quantityInput.value = '';
    }
}

// Crear función para eliminar items del pedido
function removeItem(index) {
    selectedOrder.splice(index, 1);
    renderOrder();
}

// Crear función para completar el pedido
function completeOrder() {
    selectedOrder.forEach((item, index) => {
        const row = document.getElementById(`order-item-${index}`);
        if (row) {
            row.classList.add('completed');
            row.innerHTML += ' ✅';
        }
    });

    // Guardar el pedido completado
    orders.push({
        id: ++orderCount,
        items: [...selectedOrder]
    });

    // Mostrar el botón de nuevo pedido
    renderNewOrderButton();
}

// Crear función para iniciar un nuevo pedido
function newOrder() {
    selectedOrder = [];
    renderOrder();
    renderOrders();
}

// Crear función para renderizar el pedido
function renderOrder() {
    let orderDiv = document.getElementById('order');

    if (!orderDiv) {
        orderDiv = document.createElement('div');
        orderDiv.id = 'order';
        app.appendChild(orderDiv);
    }

    orderDiv.innerHTML = `<h2>Pedido Actual</h2>`;

    // Crear la tabla
    const table = document.createElement('table');
    table.className = 'order-table';

    // Crear encabezados de la tabla
    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acción</th>
        </tr>
    `;
    table.appendChild(header);

    // Crear cuerpo de la tabla
    const body = document.createElement('tbody');

    let total = 0;

    selectedOrder.forEach((item, index) => {
        const row = document.createElement('tr');
        row.id = `order-item-${index}`;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price * item.quantity}</td>
            <td><button id="remove-btn-${index}">Eliminar</button></td>
        `;
        body.appendChild(row);
        total += item.price * item.quantity;
    });

    table.appendChild(body);
    orderDiv.appendChild(table);

    const totalDiv = document.createElement('div');
    totalDiv.className = 'order-total';
    totalDiv.innerHTML = `Total: $${total}`;
    orderDiv.appendChild(totalDiv);

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = 'Completar Pedido';
    completeButton.addEventListener('click', completeOrder);
    orderDiv.appendChild(completeButton);

    // Añadir event listeners a los botones de eliminar
    selectedOrder.forEach((item, index) => {
        const removeButton = document.getElementById(`remove-btn-${index}`);
        removeButton.addEventListener('click', () => removeItem(index));
    });
}

// Crear función para renderizar todos los pedidos
function renderOrders() {
    let ordersDiv = document.getElementById('orders');

    if (!ordersDiv) {
        ordersDiv = document.createElement('div');
        ordersDiv.id = 'orders';
        app.appendChild(ordersDiv);
    }

    ordersDiv.innerHTML = '<h2>Pedidos Completados</h2>';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'completed-order';
        orderDiv.innerHTML = `<h3>Pedido #${order.id}</h3>`;

        // Crear la tabla
        const table = document.createElement('table');
        table.className = 'order-table';

        // Crear encabezados de la tabla
        const header = document.createElement('thead');
        header.innerHTML = `
            <tr>
                <th>Item</th>
                <th>Cantidad</th>
                <th>Precio</th>
            </tr>
        `;
        table.appendChild(header);

        // Crear cuerpo de la tabla
        const body = document.createElement('tbody');

        let total = 0;

        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
            `;
            body.appendChild(row);
            total += item.price * item.quantity;
        });

        table.appendChild(body);
        orderDiv.appendChild(table);

        const totalDiv = document.createElement('div');
        totalDiv.className = 'order-total';
        totalDiv.innerHTML = `Total: $${total}`;
        orderDiv.appendChild(totalDiv);

        ordersDiv.appendChild(orderDiv);
    });
}

// Crear función para renderizar el botón de nuevo pedido
function renderNewOrderButton() {
    let orderDiv = document.getElementById('order');

    const newOrderButton = document.createElement('button');
    newOrderButton.className = 'new-order-button';
    newOrderButton.textContent = 'Nuevo Pedido';
    newOrderButton.addEventListener('click', newOrder);
    orderDiv.appendChild(newOrderButton);
}

renderMenu();
renderOrder();