(() => {
    const App = {
      htmlElements: {
        form: document.getElementById("form")
      },
      init() {
        App.bindEvents();
      },
      bindEvents() {
        App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit);
      },
      handlers: {
        onSubmit(e) {
          e.preventDefault();
          
        },
      },
      methods: {
        funcion(num) {
          //codigo
        },
        
      },
      render(html) {
        
      },
    };
    App.init();
  })();