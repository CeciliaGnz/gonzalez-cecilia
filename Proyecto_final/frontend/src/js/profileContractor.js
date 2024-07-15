function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.add("hidden");
    }
    tablinks = document.getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active:bg-purple-200");
    }
    document.getElementById(tabName).classList.remove("hidden");
    evt.currentTarget.classList.add("active:bg-purple-200");
}

function aceptarPostulante(button) {
// Mostrar mensaje de confirmación
if (confirm("¿Está seguro de que desea aceptar a este postulante? Esto rechazará a todos los demás postulantes.")) {
// Obtener el <li> padre del botón
const li = button.closest('li');

// Cambiar el contenido del <li> para mostrar el postulante aceptado
li.innerHTML = `
    <span class="font-semibold text-lg tracking-tight text-gray-500 flex justify-between items-center">
        <p>Persona encargada: <span>${li.querySelector('span').textContent.split(' - ')[0]}</span></p>
    </span>
`;

// Rechazar a todos los demás postulantes
const ul = li.closest('ul');
const lis = ul.querySelectorAll('li');
lis.forEach(l => {
    if (l !== li) {
        l.remove();
    }
});
}
}

//ACORDION
$(document).on('click', '.accordion li', function(e) {
$(this).find('div').slideToggle();
$(this).find('svg').toggleClass('flipY');
});