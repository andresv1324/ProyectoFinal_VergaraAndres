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
                this.eliminarBebida(bebida.id)
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
    localStorage.removeItem("listacarrito")
    carrito.listaCarrito = []
    carrito.verDOMCarr()
})

//EVENTO PARA TERMINAR COMPRAR (BORRA EL LOCALSTORAGE)
document.addEventListener('DOMContentLoaded', function () {
    const btncompraFin = document.querySelector('.compraFin')

    btncompraFin.addEventListener('click', function () {
        localStorage.removeItem("listacarrito")
        carrito.listaCarrito.forEach((bebida) => {
            carrito.eliminarBebida(bebida.id)
        })
        carrito.verDOMCarr()
    })
})


//Agregar Productos A Una Clase
const BC = new BebidaControlador()
const carrito = new Carrito()

//Bebidas
BC.agregar(new Bebidas(1, "Speed", "Speed Unlimited Energy Drink es una bebida sin alcohol, que contiene Cafeína, Taurina y Vitaminas.", 393, "img/Speed.webp", "Speed,")
)
BC.agregar(new Bebidas(2, "Coca Cola", "Es una bebida azucarada gaseosa vendida a nivel mundial en tiendas, restaurantes y máquinas expendedoras en más de doscientos países o territorios.", 229, "img/CocaCola.webp", "Coca Cola enlatada")
)
BC.agregar(new Bebidas(3, "Coca Cola Zero", "Es un refresco que tiene un gran sabor, de alta calidad, con cero calorías, cero azúcar y baja en sodio.", 229, "img/CocaColaZero.webp", "Coca Cola Zero")
)
BC.agregar(new Bebidas(4, "Pepsi", "Es una bebida azucarada y gaseosa de cola creada en los Estados Unidos y producida por la compañía PepsiCo.", 180, "img/Pepsi.webp", "Pepsi")
)
BC.agregar(new Bebidas(5, "Pepsi Zero", "Pepsi Zero Sugar ha llegado y es exactamente lo que dice es: una audaz y refrescante soda cero calorías, con el máximo sabor", 178, "img/PepsiZero.webp", "Pepsi Zero")
)
BC.agregar(new Bebidas(6, "Fanta", "Bebida Regular con Naranja Con una personalidad brillante, burbujeante y frutal", 136, "img/Fanta.webp", "Fanta")
)
BC.agregar(new Bebidas(7, "Sprite", "Burbujeante, refrescante y de sabor ligero, Sprite es un refresco con sabor a lima y limón.", 150, "img/Sprite.webp", "Sprite")
)
BC.agregar(new Bebidas(8, "Fernet Branca", "Es un licor de origen italiano específicamente en la ciudad de Milán (1845), inventado por Bernardino Branca", 2988, "img/FernetBranca.webp", "Fernet Branca")
)
BC.agregar(new Bebidas(9, "Vodka", "Es un aguardiente transparente, incoloro e inodoro. Se produce generalmente por la fermentación de granos, aunque se ha llegado a obtener de la cáscara de la papa.", 2240, "img/Vodka.webp", "Vodka")
)
BC.agregar(new Bebidas(10, "Vino Blanco Fedrico", "Ideal para acompañar todo tipo de pescados y mariscos, así como quesos azules y suaves. Vista: De color pajizo brillante.", 971, "img/VinoBlancoFederico.webp", "Vino Blanco Fedrico")
)
BC.agregar(new Bebidas(11, "Vino Blanco Chenin", "Los vinos de la variedad Chenin Blanc presentan tonalidades amarillo verdosas con reflejos dorados. En aromas recuerda a repostería y frutos secos.", 2055, "img/VinoBlancoChenin.webp", "Vino Blanco Chenin")
)
BC.agregar(new Bebidas(12, "Vino Blanco Marlo", "Un vino de color verdoso muy seductor y atrapante. Aromas frutales y florales de gran intensidad son típico de los varietales que lo componen", 1355, "img/VinoBlancoMarlo.webp", "Vino Blanco Marlo")
)


//RENDIRIZACION DE LA VISTA CARRITO
carrito.verAlmacen()
carrito.verDOMCarr()

//RENDIRIZACION DE LA VISTA GENERAL
BC.verDOMCont()
BC.filtro()
