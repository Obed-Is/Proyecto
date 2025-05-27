document.addEventListener('DOMContentLoaded', function () {
    cargarProveedores();
});

// Hacer una solicitud para obtener los productos desde el servidor
fetch('/productos/api/productos')
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
            btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
            btnEditar.classList.add('btn', 'btn-warning', 'me-2');
            btnEditar.setAttribute('data-bs-toggle', 'modal');
            btnEditar.setAttribute('data-bs-target', '#editarProductoModal');
            btnEditar.onclick = () => cargarProductoEnModal(producto);
            acciones.appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
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
    // Selecciona el proveedor en el select
    const selectEditar = document.getElementById('editarProveedor');
    if (selectEditar) {
        // Espera un pequeño tiempo para asegurar que las opciones ya están cargadas
        setTimeout(() => {
            selectEditar.value = producto.proveedor;
        }, 100);
    }
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
        stock: document.getElementById('editarStock').value,
        proveedor: document.getElementById('editarProveedor').value
    };
    const erroresEditar = [];

    // Validaciones
    if (productoEditado.nombre.length < 2) {
        erroresEditar.push('El nombre debe tener al menos 2 caracteres.');
    }
    if (!/^\d+(\.\d+)?$/.test(productoEditado.precioDetalle) || Number(productoEditado.precioDetalle) <= 0) {
        erroresEditar.push('El precio detalle debe ser un número mayor a 0.');
    }
    if (!/^\d+(\.\d+)?$/.test(productoEditado.precioPorMayor) || Number(productoEditado.precioPorMayor) <= 0) {
        erroresEditar.push('El precio por mayor debe ser un número mayor a 0.');
    }else if(productoEditado.precioPorMayor >= productoEditado.precioDetalle){
        erroresEditar.push('El precio por mayor debe ser menor que el precio detalle.');
    }
    if (!/^\d+$/.test(productoEditado.cantidadMinina) || Number(productoEditado.cantidadMinina) < 1) {
        erroresEditar.push('La cantidad mínima debe ser un número entero mayor a 0.');
    }
    if (!/^\d+$/.test(productoEditado.stock) || Number(productoEditado.stock) < 0) {
        erroresEditar.push('El stock debe ser un número entero igual o mayor a 0.');
    }
    if (!productoEditado.proveedor) {
        erroresEditar.push('Debe seleccionar un proveedor.');
    }
    // Mostrar errores si hay
    if (erroresEditar.length > 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Errores encontrados',
            html: erroresEditar.join('<br>'),
            customClass: {
                htmlContainer: 'text-start'
            }
        });
    }

    try {
        await fetch(`/productos/api/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoEditado)
        });
        Swal.fire('¡Éxito!', 'Producto editado correctamente.', 'success').then(() => location.reload());
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al editar el producto.', 'error');
    }
});

// Eliminar producto
async function eliminarProducto(id) {
    try {
        await fetch(`/productos/api/productos/${id}`, { method: 'DELETE' });
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

        // Comprobar si número o nombre empiezan con el criterio
        const coincideNumero = numero.startsWith(criterio);
        const coincideNombre = nombre.startsWith(criterio);

        fila.style.display = (coincideNumero || coincideNombre) ? '' : 'none';
    });
}
document.getElementById('buscarProducto').addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // evita que el formulario se envíe si está dentro de uno
        document.querySelector('button[onclick="buscarProducto()"]').click();
    }
});



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
let ordenActual = {
    criterio: null,
    ascendente: true
};

function ordenarProductos(criterio) {
    const filas = Array.from(document.querySelectorAll('#tabla-productos tbody tr'));
    const tabla = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];

    // Si se ordena por el mismo criterio, cambia la dirección
    if (ordenActual.criterio === criterio) {
        ordenActual.ascendente = !ordenActual.ascendente;
    } else {
        // Si cambias de criterio, empieza ascendente
        ordenActual.criterio = criterio;
        ordenActual.ascendente = true;
    }

    filas.sort((a, b) => {
        let valorA, valorB;

        if (criterio === 'original') {
            valorA = parseInt(a.cells[0].textContent);
            valorB = parseInt(b.cells[0].textContent);
        } else if (criterio === 'precio') {
            valorA = parseFloat(a.cells[2].textContent);
            valorB = parseFloat(b.cells[2].textContent);
        } else if (criterio === 'nombre') {
            valorA = a.cells[1].textContent.toLowerCase();
            valorB = b.cells[1].textContent.toLowerCase();
        }

        if (typeof valorA === 'string') {
            return ordenActual.ascendente
                ? valorA.localeCompare(valorB)
                : valorB.localeCompare(valorA);
        } else {
            return ordenActual.ascendente
                ? valorA - valorB
                : valorB - valorA;
        }
    });

    filas.forEach(fila => tabla.appendChild(fila));
}


function cargarProveedores() {
    fetch('/proveedores/api/obtenerProveedores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de proveedores');
            }
            return response.json();
        })
        .then(data => {
            // Select para agregar producto
            const selectAgregar = document.getElementById('proveedor');
            // Select para filtrar productos
            const selectFiltrar = document.getElementById('filtrarProveedor');
            // Select para editar producto
            const selectEditar = document.getElementById('editarProveedor');

            // Limpiar opciones previas excepto la primera
            while (selectAgregar.options.length > 1) selectAgregar.remove(1);
            while (selectFiltrar.options.length > 1) selectFiltrar.remove(1);
            while (selectEditar.options.length > 1) selectEditar.remove(1);

            if (!Array.isArray(data)) {
                console.error('Datos de proveedores no válidos:', data);
                return;
            }

            data.forEach(proveedor => {
                // Para agregar producto
                const optionAgregar = document.createElement('option');
                optionAgregar.value = proveedor.nombre;
                optionAgregar.textContent = proveedor.nombre;
                selectAgregar.appendChild(optionAgregar);

                // Para filtrar productos
                const optionFiltrar = document.createElement('option');
                optionFiltrar.value = proveedor.nombre.toLowerCase();
                optionFiltrar.textContent = proveedor.nombre;
                selectFiltrar.appendChild(optionFiltrar);

                // Para editar producto
                const optionEditar = document.createElement('option');
                optionEditar.value = proveedor.nombre;
                optionEditar.textContent = proveedor.nombre;
                selectEditar.appendChild(optionEditar);
            });
        })
        .catch(error => console.error('Error al cargar proveedores:', error));
}

// Validación de campos para agregar producto
document.querySelector('form[action="/agregarProductos"]').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const precioDetalle = document.getElementById('precioDetalle').value.trim();
    const precioPorMayor = document.getElementById('precioPorMayor').value.trim();
    const cantidadMinina = document.getElementById('cantidadMinina').value.trim();
    const stock = document.getElementById('stock').value.trim();
    const proveedor = document.getElementById('proveedor').value;

    const erroresAgregar = [];

    // Validaciones
    if (nombre.length < 2) {
        erroresAgregar.push('El nombre debe tener al menos 2 caracteres.');
    }
    if (!/^\d+(\.\d+)?$/.test(precioDetalle) || Number(precioDetalle) <= 0) {
        erroresAgregar.push('El precio detalle debe ser un número mayor a 0.');
    }
    if (!/^\d+(\.\d+)?$/.test(precioPorMayor) || Number(precioPorMayor) <= 0) {
        erroresAgregar.push('El precio por mayor debe ser un número mayor a 0.');
    }else if(precioPorMayor >= precioDetalle){
        erroresAgregar.push('El precio por mayor debe ser menor que el precio detalle.');
    }
    if (!/^\d+$/.test(cantidadMinina) || Number(cantidadMinina) < 1) {
        erroresAgregar.push('La cantidad mínima debe ser un número entero mayor a 0.');
    }
    if (!/^\d+$/.test(stock) || Number(stock) < 0) {
        erroresAgregar.push('El stock debe ser un número entero igual o mayor a 0.');
    }
    if (!proveedor) {
        erroresAgregar.push('Debe seleccionar un proveedor.');
    }


    // Mostrar errores si hay
    if (erroresAgregar.length > 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Errores encontrados',
            html: erroresAgregar.join('<br>'),
            customClass: {
                htmlContainer: 'text-start'
            }
        });
    }

    // Enviar datos si no hay errores
    try {
        const response = await fetch('/productos/agregarProductos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                precioDetalle,
                precioPorMayor,
                cantidadMinina,
                stock,
                proveedor
            })
        });
        const data = await response.json();
        if (data.success) {
            Swal.fire('¡Éxito!', data.message, 'success').then(() => location.reload());
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al guardar el producto.', 'error');
    }

});

// Validación de campos para editar producto
document.getElementById('formEditarProducto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editarId').value;
    const nombre = document.getElementById('editarNombre').value.trim();
    const precioDetalle = document.getElementById('editarPrecioDetalle').value.trim();
    const precioPorMayor = document.getElementById('editarPrecioPorMayor').value.trim();
    const cantidadMinina = document.getElementById('editarCantidadMinina').value.trim();
    const stock = document.getElementById('editarStock').value.trim();
    const proveedor = document.getElementById('editarProveedor').value.trim();

    const erroresEditar2 = [];
    // Validaciones
    if (nombre.length < 2) {
        erroresEditar2.push('El nombre debe tener al menos 2 caracteres.');
    }
    if (!/^\d+(\.\d+)?$/.test(precioDetalle) || Number(precioDetalle) <= 0) {
        erroresEditar2.push('El precio detalle debe ser un número mayor a 0.');
    }
    if (!/^\d+(\.\d+)?$/.test(precioPorMayor) || Number(precioPorMayor) <= 0) {
        erroresEditar2.push('El precio por mayor debe ser un número mayor a 0.');
    }else if(precioPorMayor >= precioDetalle){
        erroresEditar2.push('El precio por mayor debe ser menor que el precio detalle.');
    }
    if (!/^\d+$/.test(cantidadMinina) || Number(cantidadMinina) < 1) {
        erroresEditar2.push('La cantidad mínima debe ser un número entero mayor a 0.');
    }
    if (!/^\d+$/.test(stock) || Number(stock) < 0) {
        erroresEditar2.push('El stock debe ser un número entero igual o mayor a 0.');
    }
    if (!proveedor) {
        erroresEditar2.push('Debe seleccionar un proveedor.');
    }

    // Mostrar errores si hay
    if (erroresEditar2.length > 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Errores encontrados',
            html: erroresEditar2.join('<br>'),
            customClass: {
                htmlContainer: 'text-start'
            }
        });
    }


    const productoEditado = {
        nombre,
        precioDetalle,
        precioPorMayor,
        cantidadMinina,
        stock,
        proveedor
    };

    try {
        await fetch(`/productos/api/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoEditado)
        });
        Swal.fire('¡Éxito!', 'Producto editado correctamente.', 'success').then(() => location.reload());
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al editar el producto.', 'error');
    }
});
