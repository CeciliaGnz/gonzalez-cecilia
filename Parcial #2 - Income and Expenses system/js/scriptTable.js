((Sesion) => {
  const App = {
      chartData: {
          ingresos: 0,
          salidas: 0
      },
      htmlElements: {
          sendMoney: document.getElementById('sendMoney'),  
          monto: document.getElementById('monto'),  
          tipoTransaccion: document.getElementById('tipo-transaccion'),  
          tablaBody: document.getElementById('tabla-body'),
          chartIngresos: document.getElementById('chart-ingresos'),
          chartSalidas: document.getElementById('chart-salidas'),
          porcentajeIngreso: document.getElementById('porcentajeIngreso'),
          porcentajeSalida: document.getElementById('porcentajeSalida')
      },

      init() {
          App.bindEvents();
          App.verificarSesion();
          App.methods.cargarTransacciones();
      },

      bindEvents() {
          App.htmlElements.sendMoney.addEventListener("click", App.handlers.onSubmit);
      },

      verificarSesion() {
          Sesion.estadoNoLoggeado();
      },

      handlers: {
          onSubmit(e) {
            e.preventDefault();
              const monto = parseFloat(App.htmlElements.monto.value);
              const tipo = App.htmlElements.tipoTransaccion.value;  
              const fecha = new Date().toLocaleString(); 

              if (monto > 0 && tipo) { 
                  const transaccion = { monto, fecha, tipo };
                  App.methods.agregarTransaccion(transaccion);  
                  App.methods.guardarTransaccion(transaccion);  
                  if (tipo === 'Ingreso') {
                    App.chartData.ingresos += monto;
                } else if (tipo === 'Salida') {
                    App.chartData.salidas += monto;
                }
                App.chart.actualizarPorcentajes();
              }
          }
      },

      methods: {
          cargarTransacciones() {
              const username = localStorage.getItem("username");
              const transacciones = JSON.parse(localStorage.getItem(`transacciones_${username}`)) || [];
              App.chartData.ingresos = 0;
              App.chartData.salidas = 0;

              if (transacciones.length > 0) {
                  transacciones.forEach(transaccion => {
                      App.methods.agregarTransaccion(transaccion);

                      if (transaccion.tipo === 'Ingreso') {
                          App.chartData.ingresos += transaccion.monto;
                      } else if (transaccion.tipo === 'Salida') {
                          App.chartData.salidas += transaccion.monto;
                      }
                  });
                  App.chart.actualizarPorcentajes();
              } else {
                  App.htmlElements.tablaBody.innerHTML = '<tr id="data"><td colspan="3">Sin datos</td></tr>';
              }
          },

          agregarTransaccion(transaccion) {
              const nuevaFila = document.createElement('tr');
              nuevaFila.innerHTML = `<td>${transaccion.monto}</td><td>${transaccion.fecha}</td><td>${transaccion.tipo}</td>`;
              App.htmlElements.tablaBody.appendChild(nuevaFila);
              const sinDatos = document.getElementById('data');
              if (sinDatos) sinDatos.remove(); 
          },

          guardarTransaccion(transaccion) {
              const username = localStorage.getItem("username");
              let transacciones = JSON.parse(localStorage.getItem(`transacciones_${username}`)) || [];
              transacciones.push(transaccion);
              localStorage.setItem(`transacciones_${username}`, JSON.stringify(transacciones));  
          }
          
      },

      chart : {
        actualizarPorcentajes() {
          const total = App.chartData.ingresos + App.chartData.salidas;
          const porcentajeIngresos = (App.chartData.ingresos / total) * 100;
          const porcentajeSalidas = (App.chartData.salidas / total) * 100;

          App.htmlElements.chartIngresos.style.width = `${porcentajeIngresos}%`;
          App.htmlElements.chartSalidas.style.width = `${porcentajeSalidas}%`;
          App.htmlElements.porcentajeIngreso.textContent = `${porcentajeIngresos.toFixed(2)}%`;//convierte a dos decimales
          App.htmlElements.porcentajeSalida.textContent = `${porcentajeSalidas.toFixed(2)}%`;
      }
      }
  };

  App.init();
})(window.Sesion);
