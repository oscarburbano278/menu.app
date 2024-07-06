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
let currentEditingOrder = null; // Pedido que está siendo editado

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

    // Crear botón de nuevo pedido al lado del menú
    renderNewOrderButton();
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

        if (currentEditingOrder !== null) {
            // Si estamos editando un pedido existente
            const existingOrder = orders.find(order => order.id === currentEditingOrder);

            const existingItemIndex = existingOrder.items.findIndex(item => item.name === menu[index].name);
            if (existingItemIndex !== -1) {
                // Si el ítem ya está en el pedido, actualizar la cantidad
                existingOrder.items[existingItemIndex].quantity += quantity;
            } else {
                // Si el ítem no está en el pedido, añadirlo
                existingOrder.items.push(orderItem);
            }
            renderOrder(existingOrder.items);
        } else {
            // Si estamos creando un nuevo pedido
            const existingItemIndex = selectedOrder.findIndex(item => item.name === menu[index].name);
            if (existingItemIndex !== -1) {
                // Si el ítem ya está en el pedido, actualizar la cantidad
                selectedOrder[existingItemIndex].quantity += quantity;
            } else {
                // Si el ítem no está en el pedido, añadirlo
                selectedOrder.push(orderItem);
            }
            renderOrder(selectedOrder);
        }

        // Restablecer el valor del campo de cantidad a cero
        quantityInput.value = '';
    }
}

// Crear función para eliminar items del pedido
function removeItem(index) {
    if (currentEditingOrder !== null) {
        const existingOrder = orders.find(order => order.id === currentEditingOrder);
        existingOrder.items.splice(index, 1);
        renderOrder(existingOrder.items);
    } else {
        selectedOrder.splice(index, 1);
        renderOrder(selectedOrder);
    }
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

    // Reiniciar el pedido actual
    selectedOrder = [];

    // Mostrar el botón de nuevo pedido
    renderOrders();
    renderOrder(selectedOrder);
}

// Crear función para iniciar un nuevo pedido
function newOrder() {
    selectedOrder = [];
    currentEditingOrder = null;
    renderOrder(selectedOrder);
}

// Crear función para editar un pedido existente
function editOrder(orderId) {
    const existingOrder = orders.find(order => order.id === orderId);
    if (existingOrder) {
        selectedOrder = [...existingOrder.items];
        currentEditingOrder = orderId;
        renderOrder(selectedOrder);
    }
}

// Crear función para guardar los cambios en un pedido
function saveOrder() {
    if (currentEditingOrder !== null) {
        const existingOrder = orders.find(order => order.id === currentEditingOrder);
        if (existingOrder) {
            existingOrder.items = [...selectedOrder];
            currentEditingOrder = null;
            selectedOrder = [];
            renderOrders();
            renderOrder(selectedOrder);
        }
    }
}

// Crear función para buscar y mostrar un pedido
function searchOrder() {
    const searchInput = document.getElementById('search-order-input').value;
    const orderId = parseInt(searchInput);
    if (!isNaN(orderId)) {
        const order = orders.find(order => order.id === orderId);
        if (order) {
            selectedOrder = [...order.items];
            currentEditingOrder = orderId;
            renderOrder(selectedOrder);
        } else {
            alert('Pedido no encontrado');
        }
    } else {
        alert('Ingrese un número de pedido válido');
    }
}

// Crear función para renderizar el pedido
function renderOrder(order) {
    let orderDiv = document.getElementById('order');

    if (!orderDiv) {
        orderDiv = document.createElement('div');
        orderDiv.id = 'order';
        app.appendChild(orderDiv);
    }

    orderDiv.innerHTML = `<h2>${currentEditingOrder !== null ? `Editando Pedido #${currentEditingOrder}` : 'Pedido Actual'}</h2>`;

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

    order.forEach((item, index) => {
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

    if (currentEditingOrder !== null) {
        const saveButton = document.createElement('button');
        saveButton.className = 'save-button';
        saveButton.textContent = 'Guardar Cambios';
        saveButton.addEventListener('click', saveOrder);
        orderDiv.appendChild(saveButton);
    }

    // Añadir event listeners a los botones de eliminación
    order.forEach((_, index) => {
        const removeButton = document.getElementById(`remove-btn-${index}`);
        removeButton.addEventListener('click', () => removeItem(index));
    });
}

// Crear función para renderizar los pedidos completados
function renderOrders() {
    let ordersDiv = document.getElementById('orders');

    if (!ordersDiv) {
        ordersDiv = document.createElement('div');
        ordersDiv.className = 'orders';
        ordersDiv.id = 'orders';
        app.appendChild(ordersDiv);
    }

    ordersDiv.innerHTML = '<h2>Pedidos Completados</h2>';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';

        const title = document.createElement('h3');
        title.textContent = `Pedido #${order.id}`;
        orderDiv.appendChild(title);

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

        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
            `;
            body.appendChild(row);
        });

        table.appendChild(body);
        orderDiv.appendChild(table);

        const totalDiv = document.createElement('div');
        totalDiv.className = 'order-total';
        totalDiv.innerHTML = `Total: $${order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}`;
        orderDiv.appendChild(totalDiv);

        const editButton = document.createElement('button');
        editButton.className = 'edit-order-button';
        editButton.textContent = 'Editar Pedido';
        editButton.addEventListener('click', () => editOrder(order.id));
        orderDiv.appendChild(editButton);

        ordersDiv.appendChild(orderDiv);
    });
}

// Crear función para renderizar el campo de búsqueda
function renderSearchOrder() {
    let searchDiv = document.getElementById('search-order');

    if (!searchDiv) {
        searchDiv = document.createElement('div');
        searchDiv.className = 'search-order';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'search-order-input';
        input.placeholder = 'Buscar Pedido por ID';
        searchDiv.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Buscar';
        button.addEventListener('click', searchOrder);
        searchDiv.appendChild(button);

        app.appendChild(searchDiv);
    }
}

// Crear función para renderizar el botón de nuevo pedido
function renderNewOrderButton() {
    let newOrderButton = document.getElementById('new-order-button');

    if (!newOrderButton) {
        newOrderButton = document.createElement('button');
        newOrderButton.id = 'new-order-button';
        newOrderButton.className = 'new-order-button';
        newOrderButton.textContent = 'Nuevo Pedido';
        newOrderButton.addEventListener('click', newOrder);

        // Insertar el botón después del menú
        const menu = document.querySelector('.menu');
        menu.parentNode.insertBefore(newOrderButton, menu.nextSibling);
    }
}

// Inicializar la aplicación
function init() {
    renderMenu();
    renderOrder(selectedOrder);
    renderSearchOrder();
    renderOrders();
}

init();
