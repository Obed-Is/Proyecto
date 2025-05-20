// // Array para almacenar los proveedores
let proveedores = [];


function modalEditarProveedor(idProveedor) {
    const proveedorEditar = proveedores.find((proveedor) => proveedor._id == idProveedor);
    document.getElementById('nombreProveedorEdit').value = proveedorEditar.nombre;
    document.getElementById('tipoContactoEdit').value = proveedorEditar.contacto.tipo;
    document.getElementById('valorContactoEdit').value = proveedorEditar.contacto.valor;

    const btnEditarProveedor = document.getElementById('btnEditarProveedor');
    btnEditarProveedor.removeAttribute('data-id-proveedor');
    btnEditarProveedor.setAttribute('data-id-proveedor', idProveedor);

    // Limpiar y agregar productos
    const productosList = document.getElementById('productosProveedorEdit');
    productosList.value = proveedorEditar.productos;

    // Abre el modal
    const modal = new bootstrap.Modal(document.getElementById('editarProveedorModal'));
    modal.show();
}

function actualizarProveedor(e) {
    e.preventDefault();

    const idProveedor = e.target[6].getAttribute('data-id-proveedor');
    const proveedorData = {
        nombre: document.getElementById('nombreProveedorEdit').value,
        contacto: { tipo: document.getElementById('tipoContactoEdit').value, valor: document.getElementById('valorContactoEdit').value },
        productos: document.getElementById('productosProveedorEdit').value
    }

    console.log('Id del proveedor para actualizar ', e.target[6].getAttribute('data-id-proveedor'))


    fetch(`proveedores/api/actualizar/${idProveedor}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedorData)
    }).then(res => res.json())
        .then(data => {
            console.log('Respuesta al intentar actualizar proveedor: ', data)
            if (data.success == true) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message,
                    confirmButtonColor: '#252627'
                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.reload();
                    }
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Aviso',
                    text: data.message,
                    confirmButtonColor: '#252627'
                });
            }
        })
        .catch(err => {
            console.log('Ocurrio un error al hacer el fetch de actualizar: ', err);
            Swal.fire({
                icon: 'error',
                title: 'Error al intentar actualizar',
                text: 'Ocurrio un error al intentar actualizar el proveedor',
                confirmButtonColor: '#252627'
            });
        })
    return false;
}

// Agrega evento para cuando se cierra el modal
document.getElementById('proveedorModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('proveedorForm').reset();
});

function mostrarProveedores(proveedoresData) {
    const tbody = document.getElementById('proveedoresTableBody');
    tbody.innerHTML = '';

    proveedoresData.forEach((proveedor) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td class="text-center">${proveedor.nombre}</td>
                    <td class="text-center">
                        <strong>${proveedor.contacto.tipo}:</strong> ${proveedor.contacto.valor}
                    </td>
                    <td class="txt-prod text-center">
                            ${proveedor.productos}
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary me-2" onclick="modalEditarProveedor('${proveedor._id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProveedor('${proveedor._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

function eliminarProveedor(idProveedor) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Si eliminas el proveedor, no podrás revertir esta accion",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const proveedorEliminar = proveedores.find((proveedor) => proveedor._id == idProveedor);
            console.log('Datos del Proveedor a eliminar: ', proveedorEliminar);
            fetch(`proveedores/api/eliminar/${proveedorEliminar._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
                .then(data => {
                    if (data.success == true) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: data.message,
                            confirmButtonColor: '#252627'
                        }).then(() => window.location.reload());
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message,
                            confirmButtonColor: '#252627'
                        });
                    }
                })
                .catch(err => {
                    console.log('error en el fetch de eliminar proveedor ', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ha ocurrido un error al intentar eliminar el proveedor',
                        confirmButtonColor: '#252627'
                    });
                })
        }
    });
}

function agregarProveedor(event) {
    event.preventDefault();

    const nombreProveedor = document.getElementById('nombreProveedor').value;
    const productos = document.getElementById('productosNuevoProveedor').value;

    if (productos.length <= 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error en los productos',
            text: 'Debe agregar al menos un producto valido',
            confirmButtonColor: '#252627'
        });
        return false;
    }

    // Validar email o teléfono
    const tipo = document.querySelector('.tipo-contacto').value;
    const valor = document.querySelector('.valor-contacto').value;

    if (tipo === 'email' && !validarEmail(valor) || valor.length > 64) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el correo',
            text: 'El correo electrónico no es válido o es demasiado largo',
            confirmButtonColor: '#252627'
        });
        return false;
    }
    if (tipo === 'telefono' && !validarTelefono(valor.replace(/\s+/g, ''))) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el teléfono',
            text: 'El número de teléfono no es válido',
            confirmButtonColor: '#252627'
        });
        return false;
    }

    // Crear objeto del proveedor
    const proveedor = {
        nombre: nombreProveedor,
        contacto: {
            tipo: tipo,
            valor: valor.replace(/\s+/g, '')
        },
        productos: productos
    };

    fetch('proveedores/api/nuevoProveedor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    }).then(res => res.json())
        .then(data => {
            console.log('respuesta de al fetch de agregar un nuevo proveedor: ', data.message);
            if (data.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message,
                    confirmButtonColor: '#252627'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                    document.getElementById('proveedorForm').reset();
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    confirmButtonColor: '#252627'
                });
            }
        })
        .catch(err => {
            console.log('error en el fetch de agregar un nuevo proveedor: ', err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrio un error al agregar el proveedor',
                confirmButtonColor: '#252627'
            });
        });
    return false;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarTelefono(telefono) {
    const re = /^(?!(\d)\1{7})(?!.*(\d)\2{3})[267]\d{3} ?\d{4}$/;
    return re.test(telefono);
}

// Cargar proveedores al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
    fetch('proveedores/api/obtenerProveedores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => {
            console.log('Datos de todos los proveedores: ', data)
            if (data.success === false || data.length <= 0) {
                document.getElementById('noProveedores').innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> No hay proveedores registrados.';
            } else {
                mostrarProveedores(data);
                proveedores = data;
                document.getElementById('proveedorForm').reset();
            }
        });
});
