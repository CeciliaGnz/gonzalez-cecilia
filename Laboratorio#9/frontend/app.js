(() => {
    const App = {
      htmlElements: {
        form: document.getElementById('form'),
        res: document.getElementById('fibonacciItems'),
      },
      init() {
        App.bindEvents();
      },
      bindEvents() {
        App.htmlElements.form.addEventListener('submit', App.handlers.handleForm);
      },
      handlers: {
        async handleForm(e) {
            e.preventDefault();
            const num = parseInt(App.htmlElements.form.num.value);
            if (isNaN(num) || num <= 0) {
                alert('Introduce un número válido.');
                return;
            }
            const response = await fetch(`http://localhost:3000/fibonacci?num=${num}`);
            const sequence = await response.json();
            App.render(sequence);
        },
    },
      render(sequence) {
        App.htmlElements.res.innerHTML = '';
            sequence.forEach(num => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.textContent = num;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete');

            deleteButton.addEventListener('click', (e) => {
                item.parentNode.removeChild(item);
            });

            item.appendChild(deleteButton);

            App.htmlElements.res.appendChild(item);
        });
      }
    };
    App.init();
  })();