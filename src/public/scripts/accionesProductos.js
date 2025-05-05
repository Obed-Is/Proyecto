// Hacer una solicitud para obtener los productos desde el servidor
fetch('api/productos')
    .then(response => response.json())
    .then(data => {
        const tabla = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];

        data.forEach((producto, index) => {
            const fila = tabla.insertRow();
            fila.insertCell(0).textContent = index + 1;
            fila.insertCell(1).textContent = producto.nombre;
            fila.insertCell(2).textContent = producto.precioDetalle;
            fila.insertCell(3).textContent = producto.precioPorMayor;
            fila.insertCell(4).textContent = producto.cantidadMinina;
            fila.insertCell(5).textContent = producto.stock;
            fila.insertCell(6).textContent = producto.proveedor;

            const acciones = fila.insertCell(7);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn', 'btn-warning', 'me-2');
            btnEditar.setAttribute('data-bs-toggle', 'modal');
            btnEditar.setAttribute('data-bs-target', '#editarProductoModal');
            btnEditar.onclick = () => cargarProductoEnModal(producto);
            acciones.appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.classList.add('btn', 'btn-danger');
            btnEliminar.onclick = () => eliminarProducto(producto._id);
            acciones.appendChild(btnEliminar);
        });
    })
    .catch(error => console.error('Error al cargar los productos:', error));

// Cargar datos del producto en el modal
function cargarProductoEnModal(producto) {
    document.getElementById('editarId').value = producto._id;
    document.getElementById('editarNombre').value = producto.nombre;
    document.getElementById('editarPrecioDetalle').value = producto.precioDetalle;
    document.getElementById('editarPrecioPorMayor').value = producto.precioPorMayor;
    document.getElementById('editarCantidadMinina').value = producto.cantidadMinina;
    document.getElementById('editarStock').value = producto.stock;
    document.getElementById('editarProveedor').value = producto.proveedor;
}

// Enviar cambios del producto
document.getElementById('formEditarProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editarId').value;
    const productoEditado = {
        nombre: document.getElementById('editarNombre').value,
        precioDetalle: document.getElementById('editarPrecioDetalle').value,
        precioPorMayor: document.getElementById('editarPrecioPorMayor').value,
        cantidadMinina: document.getElementById('editarCantidadMinina').value,
        stock: document.getElementById('editarStock').value
    };

    try {
        await fetch(`/api/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoEditado)
        });
        location.reload();
    } catch (error) {
        console.error('Error al editar el producto:', error);
    }
});

// Eliminar producto
async function eliminarProducto(id) {
    try {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        location.reload();
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

// Buscar productos por numero o nombre
function buscarProducto() {
    const criterio = document.getElementById('buscarProducto').value.trim().toLowerCase();
    const filas = document.querySelectorAll('#tabla-productos tbody tr');
    filas.forEach(fila => {
        const numero = fila.cells[0].textContent.toLowerCase();
        const nombre = fila.cells[1].textContent.toLowerCase();
        fila.style.display = numero.includes(criterio) || nombre.includes(criterio) ? '' : 'none';
    });
}

// Filtrar productos por proveedor
function filtrarPorProveedor() {
    const proveedor = document.getElementById('filtrarProveedor').value.trim().toLowerCase();
    const filas = document.querySelectorAll('#tabla-productos tbody tr');
    filas.forEach(fila => {
        const proveedorFila = fila.cells[6].textContent.toLowerCase();
        fila.style.display = proveedor === "" || proveedorFila.includes(proveedor) ? '' : 'none';
    });
}

// Restablecer tabla a su estado original
function restablecerTabla() {
    const filas = document.querySelectorAll('#tabla-productos tbody tr');
    filas.forEach(fila => {
        fila.style.display = '';
    });
    document.getElementById('buscarProducto').value = '';
    document.getElementById('filtrarProveedor').value = '';
    ordenarProductos('original');
}

// ordenar productos o restablecer tabla
function ordenarProductos(criterio) {
    const filas = Array.from(document.querySelectorAll('#tabla-productos tbody tr'));
    const tabla = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];

    if (criterio === 'original') {
        filas.sort((a, b) => parseInt(a.cells[0].textContent) - parseInt(b.cells[0].textContent));
    } else if (criterio === 'precio') {
        filas.sort((a, b) => parseFloat(a.cells[2].textContent) - parseFloat(b.cells[2].textContent));
    } else if (criterio === 'nombre') {
        filas.sort((a, b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));
    }

    filas.forEach(fila => tabla.appendChild(fila));
}