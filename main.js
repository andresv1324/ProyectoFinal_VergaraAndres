class Bebidas {
    constructor(id, nombre, descripcion, precio, img, alt) {
        this.id = id
        this.nombre = nombre
        this.descripcion = descripcion
        this.precio = precio
        this.cantidad = 1
        this.img = img
        this.alt = alt
    }
}

class BebidaControlador {
    constructor() {
        this.listaBebidas = []
        this.listaBebidasFiltradas = []
    }

    agregar(bebida) {
        this.listaBebidas.push(bebida)
        this.listaBebidasFiltradas.push(bebida)
    }

    //DESCRIPCION PRODUCTO VISTA GENERAL
    verDOMCont() {
        let contenedorBebidas = document.getElementById("contenedorBebidas")

        contenedorBebidas.innerHTML = ""
        this.listaBebidasFiltradas.forEach(bebida => {
            contenedorBebidas.innerHTML += `
            <div class="card menu" style="width: 18rem;">
                <img src="${bebida.img}" class="card-img-top" alt="${bebida.alt}">
                <div class="card-body">
                    <h5 class="card-title">${bebida.nombre}</h5>
                    <p class="card-text">${bebida.descripcion}</p>
                </div>
                <div class="valoresBebida">
                <p class="card-text">$${bebida.precio}</p>
                <button href="#" class="btn btn-primary" id="be_${bebida.id}">Agregar</button>
                </div>
            </div>`
        })

        //ACCION DE AGREGAR A EL CARRITO Y VER 
        this.listaBebidasFiltradas.forEach(bebida => {
            const be = document.getElementById(`be_${bebida.id}`)

            be.addEventListener("click", () => {
                carrito.agregar(bebida)
                // NOTIFICACION AL AGREGAR PRODUCTO
                setTimeout(()=>{
                    Toastify({
                        text: "Bebida Añadida\n Al Carrito",
                        duration: 1500,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                    }).showToast();
                },1200)
                

                carrito.almacenStorage()
                carrito.verDOMCarr()
            })
        })
    }

    filtro() {
        const valorMini = document.getElementById("valorMin")
        const valorMaxi = document.getElementById("valorMax")
        let valorMinimo = 0
        let valorMaximo = Infinity

        valorMini.addEventListener("change", () => {
            if (valorMini.value > 0) {
                valorMinimo = valorMini.value
                console.log(valorMini.value)
                this.listaBebidasFiltradas = this.listaBebidas
                this.filtroPrecio(valorMinimo, valorMaximo)
                this.verDOMCont()
            }
        })

        valorMaxi.addEventListener("change", () => {
            valorMaximo = valorMaxi.value
            if (valorMaxi.value == 0) {
                this.listaBebidasFiltradas = this.listaBebidas
                this.verDOMCont()
            } else {
                this.listaBebidasFiltradas = this.listaBebidas
                this.filtroPrecio(valorMinimo, valorMaximo)
                this.verDOMCont()
            }

        })
    }

    filtroPrecio(min, max) {
        this.listaBebidasFiltradas = this.listaBebidas.filter((bebida) => min <= bebida.precio && bebida.precio <= max)
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = []
    }

    //EVITAR DUPLICADO DE PRODUCTO Y SUMA DE PRODUCTO 
    agregar(bebidaNueva) {
        let existe = false
        this.listaCarrito.forEach(bebida => {
            if (bebida.id === bebidaNueva.id) {
                bebida.cantidad += 1
                existe = true
            }
        })

        if (!existe) {
            this.listaCarrito.push(bebidaNueva)
        }
        this.almacenStorage()
    }

    //GUARDAR EN LOCALSTORAGE
    almacenStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listacarrito", listaCarritoJSON)
    }

    //VER Y RENDERIZAR LO GUARDADO EN LOCALSTORAGE
    verAlmacen() {
        let listaCarritoJSON = localStorage.getItem("listacarrito")
        let listaCarrito = JSON.parse(listaCarritoJSON)

        if (listaCarrito) {
            this.listaCarrito = listaCarrito
        }
    }

    //DESCRIPCION PRODUCTO VISTA CARRITO
    verDOMCarr() {
        let contenedorCarrito = document.getElementById("contenedorCarrito");

        contenedorCarrito.innerHTML = "";
        this.listaCarrito.forEach(bebida => {

            const totalProducto = bebida.precio * bebida.cantidad;



            const card = document.createElement("div");
            card.classList.add("card", "menuCarrito", "mb-3");
            card.style.maxWidth = "540px";
            card.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${bebida.img}" class="img-fluid rounded-start" alt="${bebida.alt}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${bebida.nombre}</h5>
                        <p class="card-text">Cantidad: 
                            <button class="btn btn-secondary btn-quitar" data-id="${bebida.id}">
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                            <span id="cantidad_${bebida.id}">${bebida.cantidad}</span>
                            <button class="btn btn-secondary btn-añadir" data-id="${bebida.id}">
                                <i class="fa-solid fa-caret-up"></i>
                            </button>
                        </p>
                        <p class="card-text">Precio: $${bebida.precio}  || Total: $${totalProducto} || 
                            <button class="trashCarrito" id="tacho_${bebida.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </p>
                    </div>
                </div>
            </div>`



            // Agregar la tarjeta al contenedor
            contenedorCarrito.appendChild(card);

            //EVENTO DEL BOTON TACHO
            const btnTacho = document.getElementById(`tacho_${bebida.id}`)
            btnTacho.addEventListener("click", () => {
                Swal.fire({
                    title: 'Esta Usted Seguro?',
                    text: "Eliminara Toda La Cantidad \n De Su Bebida!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirmar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(()=>{
                            this.eliminarBebida(bebida.id)
                        },1000)
                        Swal.fire(
                            'Eliminado!',
                            'Se Quito Al Completo Su Bebida',
                            'success'
                        )
                    }
                })
            })

            //EVENTO DEL BOTON +
            const btnAñadir = card.querySelector(`.btn-añadir`)
            btnAñadir.addEventListener("click", () => {
                this.añadirCantidad(bebida.id)
            })

            //EVENTO DEL BOTON -
            const btnQuitar = card.querySelector(`.btn-quitar`)
            btnQuitar.addEventListener("click", () => {
                this.quitarCantidad(bebida.id)
            })
        })

        const cantidadTotalElemento = document.getElementById("cantidadTotal")
        const cantidadTotal = this.calcularCantidadTotal()
        cantidadTotalElemento.textContent = `|| Total: ${cantidadTotal} ||`
    }

    //FUNCION PARA EL BOTON + DEL CARRITO  || Y RENDERIZACION EN DOM
    añadirCantidad(id) {
        const bebida = this.listaCarrito.find(bebida => bebida.id === id)
        if (bebida) {
            bebida.cantidad++
            this.almacenStorage()
            this.verDOMCarr()
        }
    }

    //FUNCION PARA EL BOTON - DEL CARRITO || Y RENDERIZACION EN DOM
    quitarCantidad(id) {
        const bebida = this.listaCarrito.find(bebida => bebida.id === id)
        if (bebida && bebida.cantidad > 1) {
            bebida.cantidad--
            this.almacenStorage()
            this.verDOMCarr()
        }
    }

    calcularCantidadTotal() {
        let total = 0
        this.listaCarrito.forEach(bebida => {
            total += bebida.precio * bebida.cantidad
        })
        return total
    }

    eliminarBebida(id) {
        this.listaCarrito = this.listaCarrito.filter(bebida => bebida.id !== id);

        const bebida = BC.listaBebidas.find(bebida => bebida.id === id)
        if (bebida) {
            bebida.cantidad = 1
        }

        this.almacenStorage();
        this.verDOMCarr();
    }

}

//EVENTO PARA EL BOTON DE TRASH DEL CARRITO || BORRAR ELEMENTOS DEL STORAGE Y DEL CARRITO
document.querySelector(".trash").addEventListener("click", () => {

    Swal.fire({
        title: 'Esta Usted Seguro?',
        text: "Eliminara Todas Las Bebidas En el Carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("listacarrito")
            carrito.listaCarrito = []
            carrito.verDOMCarr()
            Swal.fire(
                'Carrito Vacio!',
                'Su Carrito Fue Vaciado',
                'success'
            )
        }
    })


})

//EVENTO PARA TERMINAR COMPRAR (BORRA EL LOCALSTORAGE)
document.addEventListener('DOMContentLoaded', function () {
    const btncompraFin = document.querySelector('.compraFin')

    btncompraFin.addEventListener('click', function () {
        Swal.fire({
            title: 'Desea Finalizar Su Compra?',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const cantidadTotal = carrito.calcularCantidadTotal(); // Obtener el total
                Swal.fire(`Compra Terminada! \n$${cantidadTotal}`, '', 'success')
                localStorage.removeItem("listacarrito")
                carrito.listaCarrito.forEach((bebida) => {
                    carrito.eliminarBebida(bebida.id)
                })
            }
        })


        carrito.verDOMCarr()
    })
})


//Agregar Productos A Una Clase
const BC = new BebidaControlador()
const carrito = new Carrito()

// Bebidas 
// Carga De las Bebidas
fetch('bebidasAPI.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(bebida => {
            BC.agregar(new Bebidas(
                bebida.id,
                bebida.nombre,
                bebida.descripcion,
                bebida.precio,
                bebida.img,
                bebida.alt
            ));
        });
        
        // RENDERIZACION
        BC.verDOMCont()
        BC.filtro()
    })
    .catch(error => console.error('Error cargando las bebidas:', error));



//RENDIRIZACION DE LA VISTA CARRITO
carrito.verAlmacen()
carrito.verDOMCarr()

//RENDIRIZACION DE LA VISTA GENERAL
BC.verDOMCont()
BC.filtro()
