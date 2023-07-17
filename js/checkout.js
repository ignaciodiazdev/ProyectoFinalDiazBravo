
const tablaDatos = document.querySelector('#tablaDatos');
const registroPedido = document.querySelector('#registroPedido');
const nombre = document.querySelector('#inputNombre');
const correo = document.querySelector('#inputCorreo');
const direccion = document.querySelector('#inputDireccion');
const telefono = document.querySelector('#inputTelefono');

let carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];

const options = { style: 'currency', currency: 'USD' };

const renderizarProductosTabla = () => {
    tablaDatos.innerHTML = ``;

    carrito.forEach(({nombre, precio, img, cantidad, subtotal}) => {
        tablaDatos.innerHTML += `
        <tr>
            <td>
                <img src="../img/${img}" alt="${nombre}">
            </td>
            <td>
                <span>${nombre}</span>
            </td>

            <td>
                <span>${precio.toLocaleString('en-US', options)}</span>
            </td>
            <td>
                <span>${cantidad}</span>
            </td>
            <td>
                <span>${(cantidad * precio).toLocaleString('en-US', options)}</span>
            </td>
        </tr>
        `;  
    });
}

const precioTotal   = document.querySelector('#precioTotal');

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

registroPedido.addEventListener('click', () => {
    if(nombre.value !== '' && correo.value !== '' && direccion.value !== '' && telefono.value !== ''){
        Swal.fire({
            icon: 'success',
            title: 'Gracias por su Compra',
            confirmButtonText: 'OK!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                location.href = 'tienda.html';
            }
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Rellena todos los Campos',
            confirmButtonText: 'OK!',
        })
    }
})

renderizarProductosTabla();
calcularPrecioTotal();