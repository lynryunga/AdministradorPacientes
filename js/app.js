
//inputs
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//formulario UI
const formulario = document.querySelector('#nueva-cita');
//ul donde se mostraran los datos
const contenedorCitas = document.querySelector('#citas');

let editando;

//definiendo mis clases
class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];

    console.log(this.citas);
  }

  eliminarCita(id) {
    this.citas = this.citas.filter( cita => cita.id !== id );
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
  }
}

class UI {

  imprimirAlaerta(mensaje, tipo) {

    //crea la alerta
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

    //Crear alerta tipo error
    if(tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    //Agregar el Mensaje de error
    divMensaje.textContent = mensaje;

    //Agregar al DOM => antes de .agregar-cita
    document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))

    //quitar la alerta despues de 3 segundos 
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  }

  //Aplicar destructuring desde el parametro '{citas}'
  imprimirCitas({citas}) {

    this.limpiarHTML()
    
    citas.forEach( cita => {

      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

      const divCita = document.createElement('DIV');
      divCita.classList.add('cita', 'p-3');
      divCita.dataset.id = id;

      //Scriptin de los elementos de la cita
      const mascotaParrafo = document.createElement('H2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('P');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement('P');
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement('P');
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement('P');
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement('P');
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
      `;

      //Boton para eliminar 
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
      btnEliminar.innerHTML = `Eliminar <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;

      btnEliminar.onclick = () => eliminarCita(id);

      //Añade un boton para editae
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-info', );
      btnEditar.innerHTML = `Editar <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
    </svg>`

      btnEditar.onclick = () => cargarEdicion(cita);

      //Agregar los parrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      //agregar las citas al HTML
      contenedorCitas.appendChild(divCita);
    } )
  }

  limpiarHTML() {
    while(contenedorCitas.firstChild) {
      contenedorCitas.removeChild( contenedorCitas.firstChild );
    }
  }

}

//Intanciar
const ui = new UI();
const administrarCitas = new Citas();

//Registrar  eventos
eventListeners();
function eventListeners() {
  mascotaInput.addEventListener( 'change', datosCita)
  propietarioInput.addEventListener( 'change', datosCita)
  telefonoInput.addEventListener( 'change', datosCita)
  fechaInput.addEventListener( 'change', datosCita)
  horaInput.addEventListener( 'change', datosCita)
  sintomasInput.addEventListener( 'change', datosCita)

  formulario.addEventListener('submit', nuevaCita)
}

//Objeto principal
const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
}

//Agrega datos al objeto principal
function datosCita(e) {

  citaObj[e.target.name] = e.target.value;
}

//Valida y agrega una nueva cita a la clase de citas => submit
function nuevaCita(e) {

  e.preventDefault();

  //extraer la informaicion del objeto de cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  //Validar
  if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas ==='' ) {

    ui.imprimirAlaerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if(editando) {

    ui.imprimirAlaerta('Editado correctamente');

    //Pasar el objeto de la cita a edición
    administrarCitas.editarCita({...citaObj});

    // Regresar el texto del boton a su anterior estado
    formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

    //Quitar modo edicion
    editando = false;

  } else {

    //Generar un id unico para editar o eliminar el objeto
    citaObj.id = Date.now();
  
    //Creando una nueva cita "{...citaObj}" crea una copia del objeto y no lo reescribe
    administrarCitas.agregarCita({...citaObj});

    //Mensaje de agregado correctamente
    ui.imprimirAlaerta('Se agregó correctamente')
  }


  //Reiniciar el objeto 
  reiniciarObjeto();

  //Reinicia el formulario
  formulario.reset();

  //Mostrar el html de las citas administrarCitas contiene el objeto 
  ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

function eliminarCita(id) {

  //Eliminar la cita
  administrarCitas.eliminarCita(id);

  //muestre un mensaje
  ui.imprimirAlaerta('La cita se elimino correctamente');

  // refrescar la cita
  ui.imprimirCitas(administrarCitas);
}

//Carga los datos y el modo edicion
function cargarEdicion(cita) {

  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //Llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //Cambiar el texto del boton
  formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

  editando = true;
}