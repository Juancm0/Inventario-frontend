const api = 'https://inventario-backend-4i4e.onrender.com';
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista');
const filtro = document.getElementById('filtro');

let productos = [];
let editId = null;

async function cargarProductos() {
  const res = await fetch(api);
  productos = await res.json();
  mostrarProductos();
}

function mostrarProductos() {
  const busqueda = filtro.value.toLowerCase();
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda) ||
    p.categoria.toLowerCase().includes(busqueda)
  );
  lista.innerHTML = '';
  filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  filtrados.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.categoria}</td>
      <td>
        <button class="edit" onclick="editarProducto(${producto.id})">Editar</button>
        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
      </td>
    `;
    lista.appendChild(fila);
  });
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const cantidad = document.getElementById('cantidad').value;
  const categoria = document.getElementById('categoria').value;

  const nuevo = { nombre, cantidad, categoria };

  if (editId !== null) {
    await fetch(`${api}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    editId = null;
  } else {
    await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
  }
  formulario.reset();
  cargarProductos();
});

async function eliminarProducto(id) {
  await fetch(`${api}/${id}`, { method: 'DELETE' });
  cargarProductos();
}

function editarProducto(id) {
  const producto = productos.find(p => p.id === id);
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('cantidad').value = producto.cantidad;
  document.getElementById('categoria').value = producto.categoria;
  editId = id;
}

filtro.addEventListener('input', mostrarProductos);
cargarProductos();
