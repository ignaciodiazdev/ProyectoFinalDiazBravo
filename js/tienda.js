
const catalogoProd  = document.querySelector('#catalogoProductos');
const allProducts   = document.querySelector('#allProducts');
const menuItems     = document.querySelectorAll('.menuItem');
const precioTotal   = document.querySelector('#precioTotal');
const carritoNumero = document.querySelector('#carritoNumero');
const btnVaciarCarrito = document.querySelector('#btnVaciarCarrito');
const btnPedido     = document.querySelector('#btnPedido');

const options = { style: 'currency', currency: 'USD' };

// Solicitud Async - Await - Fetch
const solicitarProductos = async () => { 
    const response  = await fetch(URL);
    const dataJSON      = await response.json();
    productos = dataJSON.map( producto => {
        return new Producto(producto.id, producto.nombre, producto.precio, producto.categoria, producto.img);
    })
    renderizarProductos(productos);
}
solicitarProductos();

// Agregando Evento para mostrar todos los Productos
allProducts.addEventListener('click', () => {
    renderizarProductos(productos);
});

// Agregando Evento a todos los Botones de Categorías
menuItems.forEach( item =>  {
    item.addEventListener('click', (e) => {
        let categoria = productos.filter(prod => (prod.categoria) === e.target.innerText);
        renderizarProductos(categoria);
    })
})

// Mostrando los Productos en la Página
const renderizarProductos = (productos) => {
    catalogoProd.innerHTML = ``;

    productos.forEach(({id, nombre, precio, categoria, img}) => {
        catalogoProd.innerHTML += `
        <article class="card-producto">
            <img src="../img/${img}" alt="${nombre}">
            <div class="content-descripcion">
                <span class="card-categoria">${categoria}</span>
                <h3>${nombre}</h3>
                <div class="content-precio">                        
                    <span>${precio.toLocaleString('en-US', options)}</span>
                </div>
                <button class="boton btn-addProducto" id="${id}">Agregar al carrito</button>
            </div>
        </article>
        `;  
    });
    agregarClickBoton('.btn-addProducto');
}

// Agregando Evento Click a Botones "Add y Delete"
const agregarClickBoton = (selector) => {
    let botones = document.querySelectorAll(`${selector}`);
    botones.forEach( boton => {
        boton.addEventListener('click', () => {
            let id = parseInt(boton.id);
            if(selector === '.btn-addProducto'){
                agregarAlCarrito(id);
                alertaAgregar();
            }
            else if(selector === '.btn-deleteProducto'){
                alertaConfirmarEliminar(id);
            }
        });
    });
}

const alertaAgregar = () => {
    Swal.fire({
        icon: 'success',
        title: 'Producto Agregado...',
        text: 'Se añadió al Carrito',
        confirmButtonText: 'Entendido!',
    })
}

// Agregando un producto al Carrito
const agregarAlCarrito = (id) => {
    let existeProducto = carrito.some(prod => prod.id === id);
    
    if(!existeProducto){   
        let producto = productos.find( prod => prod.id === id);
        carrito.push(producto);
        actualizarNumeroCarrito();
    }else{
        carrito.forEach(prod => {
            if(prod.id === id){
                prod.cantidad++;
            }
        })
    }
    localStorage.setItem('carritoProductos', JSON.stringify(carrito));
    listarCarrito();
}

const alertaConfirmarEliminar = (id) => {
    Swal.fire({
        title: '¿Estás Seguro de Eliminar este Producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, cancelar!',
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarProducto(id);
        }
    })
}

// Eliminando un producto del Carrito
const eliminarProducto = (id) => {
    let indice = carrito.findIndex( prod => prod.id === id);
    carrito.splice(indice, 1);
    listarCarrito();
    actualizarNumeroCarrito();
    localStorage.setItem('carritoProductos', JSON.stringify(carrito));
}

// Alerta de Vaciar Carrito
btnVaciarCarrito.addEventListener('click', () => {
    if(carrito.length !== 0){
        Swal.fire({
            title: '¿Está Seguro de Vaciar su Carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar!',
            cancelButtonText: 'No, cancelar!',
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
            }
        })
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Su Carrito ya está Vacío',
            confirmButtonText: 'Entendido!',
        })
    }
})

// Vaciando el Carrito
const vaciarCarrito = () => {
    carrito.splice(0, carrito.length);
    listarCarrito();
    actualizarNumeroCarrito();
    localStorage.clear();
}

// Listando en el Modal los productos que están en el Carrito
const listarCarrito = () => {
    let modalCarrito = document.querySelector('#modalCarrito');
    modalCarrito.innerHTML = ``;

    if(carrito.length !== 0){
        carrito.forEach( ({id, nombre, precio, img, cantidad}) => {

            modalCarrito.innerHTML += `
                <section class="carrito-producto">
                    <img class="carrito-producto__img" src="../img/${img}"/>
                    <div class="carrito-producto__detalle">
                        <h3 class="nombre">${nombre}</h3>
                        <div class="carrito__precios">
                            <span class="precio">Precio: ${precio.toLocaleString('en-US', options)}</span>
                            <span class="precio">SubTotal: ${(cantidad * precio).toLocaleString('en-US', options)}</span>
                        </div>
                        <div class="carrito-producto__botones">
                            <div class="carrito-cantidad">
                                <span>Cantidad: ${cantidad}</span>
                            </div>
                            <button class="boton btn-deleteProducto" id="${id}"><i class='bx bxs-trash'></i></button>
                        </div>
                    </div>
                </section>
            `
        });
        agregarClickBoton('.btn-deleteProducto');
    }else{
        modalCarrito.innerHTML = '<p>Tú Carrito está Vacío</p>';
    } 
    calcularPrecioTotal();
}

// Actualizando el Número que está en el Ícono de Carrito
const actualizarNumeroCarrito = () => {
    let carritoValor = carrito.length;
    carritoNumero.innerText = `${carritoValor}`;
}

// Calculando el Precio Total del Carrito
const calcularPrecioTotal = () => {
    if(carrito.length !== 0){
        let total = carrito.reduce( (acumulador, producto) => {
            return acumulador += producto.precio * producto.cantidad;
        },0);

        precioTotal.innerHTML = `
            <span>Precio Total:</span>
            <span>${total.toLocaleString('en-US', options)}</span>
        `
    }else{
        precioTotal.innerHTML = '';
    }
}

// Añadiendo evento de carga de página
document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];
    listarCarrito();
    actualizarNumeroCarrito();
});

// Realizando Pedido
btnPedido.addEventListener('click', () => {
    if(carrito.length !== 0){
        location.href = 'checkout.html';
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'No hay Productos en el Carrito',
            confirmButtonText: 'Entendido!',
        })
    }
})
