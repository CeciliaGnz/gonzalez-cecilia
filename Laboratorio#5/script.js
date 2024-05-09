//INICIO
(() => {
  const App={
    htmlElements: {
      form: document.getElementById("form"),
      formVote: document.getElementById("formVote"),
      candidatoLista: document.getElementById("candidatoLista")
    },

    init(){
      App.bindEvents();
    },

    bindEvents(){
      App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit);
      App.htmlElements.formVote.addEventListener("submit", App.handlers.onSubmit);
      
    },

    handlers: {
      onSubmit(e){
        e.preventDefault();
        const candidatoNombre = e.target.candidatoNombre.value;
        const colorSelector = e.target.colorSelector.value;
        const registro = App.methods.registroCandidato(candidatoNombre, colorSelector);
        App.methods.displayCandidates();

      },

      onClick(e) {
        e.target.parentElement.remove(); 
        const candidatoIndex = Array.from(App.htmlElements.candidatoLista.children).indexOf(e.target.parentElement);
        App.methods.candidatos.splice(candidatoIndex, 1); 
      },
    },

    methods: {

      candidatos: [],

      //Metodo registro
      registroCandidato(name, color){
        const candidato = {
          name: name,
          color: color,
          votes: 0
        }
        App.methods.candidatos.push(candidato);
        return candidato;
      },

      //Metodo muestra lista de candidatos
      displayCandidates() {
        App.htmlElements.candidatoLista.innerHTML = "";

        App.methods.candidatos.forEach(candidato => {
          const listaItem = document.createElement("li");
          listaItem.innerHTML = `
          <div class="candidato-info">
            <span>Candidato/a: ${candidato.name}</span>
            <span>, Color representativo: </span>
            <span class="color-circulo" style="background-color: ${candidato.color};"></span>
          </div>
          <button class="eliminarBtn">Eliminar candidato</button>`;
          App.htmlElements.candidatoLista.appendChild(listaItem);
        });

        //Crea boton eliminar cuando se crea la lista del candidato
        const eliminarButtons = document.querySelectorAll(".eliminarBtn");
        eliminarButtons.forEach(button => {
          button.addEventListener("click", App.handlers.onClick);
        });
      },

    },

    render(html){

    },

  };

  App.init();
})();

//FIN