let formulasDataOBJ = [];
let alertaActiva = null;

function mostrarAlerta(alertaID, mensaje) {
    const alerta = document.getElementById(alertaID);
    let tiempoAlerta = 3500;
    const tiempoExtra = 1500;

    if (!alerta) {
        console.warn(`No se encontró el elemento con ID '${alertaID}'`);
        return;
    }

    const spanID = alertaID === "alertaExito" ? "msjAlertaExito" : "msjAlertaError";
    const mensajeSpan = document.getElementById(spanID);

    if (mensaje) {
        mensajeSpan.innerText = mensaje;
    }

    if (alertaActiva != null) {
        clearTimeout(alertaActiva);
        tiempoAlerta += tiempoExtra;
    }

    alerta.classList.remove("d-none");
    alertaActiva = setTimeout(() => {
        const alerta1 = document.getElementById("alertaExito")
        const alerta2 = document.getElementById("alertaError")
        alerta1.classList.add("d-none");
        alerta2.classList.add("d-none");
    }, tiempoAlerta);
}

function getAllFormulas() {
    return fetch("/formulas/api/all")
        .then(res => res.json())
        .then(data => {
            formulasDataOBJ = data;
            console.log("peticion fetch: ", formulasDataOBJ)
            mostrarFormulas(formulasDataOBJ);
        })
        .catch(err => {
            console.log("Error al hacer el fetch de formulas: ", err);
            mostrarAlerta("alertaError", "No se pudieron encontrar las formulas");
            document.getElementById("spinnerCargando").style.display = "none";
        });
}

function mostrarDetallesFormula(idFormula) {
    const formulaEncontrada = formulasDataOBJ.find((formula) => formula._id == idFormula);

    document.getElementById("formulaTituloDetalle").innerText = formulaEncontrada.nombreFormula;
    document.getElementById("descripcionFormulaDetalle").innerText = formulaEncontrada.descripcionFormula;
    document.getElementById("tiempoFormulaDetalle").innerText = formulaEncontrada.tiempoFormula + " hrs";
    document.getElementById("cantidadFormulaDetalle").innerText = `${formulaEncontrada.cantidadProducida}`;
    document.getElementById("materiaFormulaDetalle").innerText = formulaEncontrada.materiaPrima;
}

function mostrarFormulas(formulasData) {
    const containerFormulas = document.getElementById("containerFormulas");

    setTimeout(() => {
        if (Object.values(formulasData).length <= 0) {
            console.info("Las formulas estan vacias")
            const avisoSinFormulas = document.createElement("div");
            avisoSinFormulas.className = "text-center py-5";
            avisoSinFormulas.innerHTML = `
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"
                viewBox="0 0 24 24"  fill="currentColor"  class="mb-2 icon icon-tabler 
                icons-tabler-filled icon-tabler-alert-hexagon">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10.425 1.414a3.33 3.33 0 0 1 3.026 -.097l.19 .097l6.775 
                    3.995l.096 .063l.092 .077l.107 .075a3.224 3.224 0 0 1 1.266 
                    2.188l.018 .202l.005 .204v7.284c0 1.106 -.57 2.129 -1.454 
                    2.693l-.17 .1l-6.803 4.302c-.918 .504 -2.019 .535 -3.004 .068l-.196 
                    -.1l-6.695 -4.237a3.225 3.225 0 0 1 -1.671 -2.619l-.007 
                    -.207v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098zm1.585 
                    13.586l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 
                    -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 
                    -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                </svg>
                <h5 class="text-muted">No hay formulas registradas</h5>
                <p class="text-muted">Haz clic en “Agregar formula” para crear una nueva.</p>
            `;
            containerFormulas.appendChild(avisoSinFormulas);
        }

        for (let i = 0; i < formulasData.length; i++) {
            const tarjeta = document.createElement("div");
            tarjeta.className = "col-md-4 mb-3 fade-in";
            tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm" id="${formulasData[i]._id}">
                        <div class="card-body d-flex flex-column">
                            <p class="card-title h5 fw-semibold">${formulasData[i].nombreFormula}</p>
                            <p class="card-text">${formulasData[i].descripcionFormula}</p>
                            <div class="d-flex justify-content-end gap-2 mt-auto">
                                <button class="btn btn-dark btn-sm" onclick="mostrarDetallesFormula('${formulasData[i]._id}')" data-bs-toggle="modal" data-bs-target="#mostrarFormula">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 27"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-list-details">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M13 5h8" />
                                        <path d="M13 9h5" />
                                        <path d="M13 15h8" />
                                        <path d="M13 19h5" />
                                        <path
                                            d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                        <path
                                            d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                    </svg>
                                    Detalles
                                </button>
                                <button type="button" class="btn btn-warning btn-sm" onclick="actualizarFormulaInfo('${formulasData[i]._id}')" data-bs-toggle="modal" data-bs-target="#actualizarFormula" data-id="${formulasData[i]._id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 27"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarFormula('${formulasData[i]._id}')" data-bs-toggle="modal" data-bs-target="#modalConfirmarEliminacion" ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 27"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 7l16 0" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 11l0 6" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
        `;
            setTimeout(() => {
                tarjeta.classList.add("show");
            }, i * 30);
            containerFormulas.appendChild(tarjeta);
        }
        document.getElementById("spinnerCargando").style.display = "none";
    }, 300);


}

function confirmacionInsercionFormula() {
    const params = new URLSearchParams(location.search);
    const confirmacion = params.get("insercion");

    switch (confirmacion) {
        case "exito":
            mostrarAlerta("alertaExito", "Formula agregada con correctamente");
            break;
        case "error":
            mostrarAlerta("alertaError", "Ocurrio un error al agregar la formula");
            break;
        default:
            break;
    }
}

async function eliminarFormula(IDformula) {
    let confirmacion = await new Promise((resolve) => {
        const btnConfirmar = document.getElementById("eliminacionConfirmada");
        const btnRechazar = document.getElementById("eliminacionRechazada");

        const limpiarEvento = () => {
            btnConfirmar.removeEventListener("click", confirmar);
            btnRechazar.removeEventListener("click", rechazar);
        }

        const confirmar = () => {
            limpiarEvento();
            resolve(true);
        }

        const rechazar = () => {
            limpiarEvento();
            resolve(false);
        };

        btnConfirmar.addEventListener("click", confirmar);
        btnRechazar.addEventListener("click", rechazar);
    })

    console.log("Confirmacion de la elimiacion de la formula: ", confirmacion)
    if (confirmacion === false) return;

    fetch(`/formulas/api/eliminar/${IDformula}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.mensaje);
            mostrarAlerta("alertaExito", data.mensaje);
            document.getElementById("containerFormulas").innerHTML = "";
            getAllFormulas();
        })
        .catch(err => {
            console.log(err);
            mostrarAlerta("alertaError", "Ocurrio un error al intentar eliminar la formula");
        })
}

function actualizarFormulaInfo(idFormula) {
    const formula = formulasDataOBJ.find((formula) => formula._id == idFormula)
    const cantidadFormulaDetalle = formula.cantidadProducida.split(" ");

    document.getElementById("formActualizarFormula").setAttribute("data-id-formula", idFormula);
    document.getElementById("nombreFormulaActualizar").value = formula.nombreFormula;
    document.getElementById("descripcionFormulaActualizar").value = formula.descripcionFormula;
    document.getElementById("tiempoFormulaActualizar").value = formula.tiempoFormula;
    document.getElementById("cantidadProducidaActualizar").value = cantidadFormulaDetalle[0];
    document.getElementById("unidadCantidadProducidaActualizar").value = cantidadFormulaDetalle[1];
    document.getElementById("materiaPrimaActualizar").value = formula.materiaPrima;
}

// EVENTO PARA RECIBIR LOS VALORES DE LA FORMULA A ACTUALIAZAR
document.getElementById("formActualizarFormula").addEventListener("submit", function (e) {
    e.preventDefault();

    const formulaActualizada = {
        idFormula: e.target.getAttribute("data-id-formula"),
        nombreFormula: e.target[0].value,
        descripcionFormula: e.target[1].value,
        tiempoFormula: e.target[2].value,
        cantidadProducida: `${e.target[3].value} ${e.target[4].value}`,
        materiaPrima: e.target[5].value
    }
    console.warn("Data de la Formula actualizada: ", formulaActualizada)
    actualizarFormula(formulaActualizada);
})

function actualizarFormula(nuevaFormula) {
    const modal = bootstrap.Modal.getInstance(document.getElementById("actualizarFormula"));

    fetch(`/formulas/api/actualizar/${nuevaFormula.idFormula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFormula)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.mensaje);
            if (data.modificacion == true) {
                modal.hide();
                mostrarAlerta("alertaExito", data.mensaje);
                document.getElementById("containerFormulas").innerHTML = "";
                getAllFormulas();
            } else {
                modal.hide();
                mostrarAlerta("alertaError", data.mensaje);
            }
        })
        .catch(err => {
            console.error(err);
            modal.hide();
            mostrarAlerta("alertaError", "Ocurrio un error al querer actualizar la formula");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    confirmacionInsercionFormula();
    getAllFormulas();

    if (window.history.replaceState) {
        const url = new URL(window.location);
        url.search = "";
        window.history.replaceState({}, document.title, url.toString());
    }

    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
});