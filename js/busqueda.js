
const inputBusqueda = document.querySelector('#inputBusqueda');
const btnBusqueda = document.querySelector('#btnBusqueda');
const containerProductos = document.querySelector('#containerProductos');
const spinner = document.querySelector('#spinner');

btnBusqueda.addEventListener('click', () =>{
  
    const busqueda = inputBusqueda.value.toLowerCase();
    const resultados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda)
    );
    
    containerProductos.style.visibility = 'hidden';

    setTimeout(() => {
      spinner.style.display = 'block';
    }, 500);

    setTimeout(() => {
      spinner.style.display = 'none';
      resultados.length !== 0 ? renderizarProductos(resultados) : catalogoProd.innerHTML = "<span class='notFound'>Producto No encontrado :(<span>";
      containerProductos.style.visibility = 'visible';
    }, 2000);   
})
