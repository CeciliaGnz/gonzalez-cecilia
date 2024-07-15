document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');

    if (tab) {
        openTab(null, `tab${tab}`); // Llama a la función que activa el tab deseado
    }

    // Aquí va el resto de tu código...
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.add("hidden"); // Oculta todos los tabs
    }
    tablinks = document.getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active:bg-purple-200");
    }
    document.getElementById(tabName).classList.remove("hidden"); // Muestra el tab seleccionado
    if (evt) {
        evt.currentTarget.classList.add("active:bg-purple-200");
    }

    // Actualiza la URL para reflejar el tab activo
    history.replaceState(null, null, `?tab=${tabName.substr(3)}`);
}
