((Sesion) => {
  const App = {
      chartData: {
          ingresos: 0,
          salidas: 0
      },
      htmlElements: {
          form:document.getElementById("form-money"),
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
        async onSubmit(e) {
            e.preventDefault();
            const monto = parseFloat(App.htmlElements.monto.value);
            const tipo = App.htmlElements.tipoTransaccion.value;  
            const fecha = new Date().toLocaleString(); 
            const username = localStorage.getItem("username");

            if (monto > 0 && tipo) { 
                const transaccion = {monto, fecha, tipo };
                try {
                    let endpoint = tipo === 'Ingreso' ? '/api/ingresos' : '/api/egresos';
                    const response = await fetch(`http://localhost:3000${endpoint}?username=${username}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(transaccion)
                    });

                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }

                    const data = await response.json();
                    App.methods.agregarTransaccion(transaccion);  
                    App.chartData[tipo === 'Ingreso' ? 'ingresos' : 'salidas'] += monto;
                    App.chart.actualizarPorcentajes();
                    App.template.mensajeExitoso(App.htmlElements.form, "Monto ingresado correctamente.");
                } catch (error) {
                    console.error(error);
                    alert('Hubo un problema con la solicitud.');
                }
            }
        }
    },

      methods: {
        async cargarTransacciones() {
            const username = localStorage.getItem("username");
            try {
                const ingresosResponse = await fetch(`http://localhost:3000/api/ingresos?username=${username}`);
                const egresosResponse = await fetch(`http://localhost:3000/api/egresos?username=${username}`);

                if (!ingresosResponse.ok || !egresosResponse.ok) {
                    throw new Error('Error en la solicitud');
                }

                const ingresosData = await ingresosResponse.json();
                const egresosData = await egresosResponse.json();

                const transacciones = [...ingresosData.data, ...egresosData.data];

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
            } catch (error) {
                console.error(error);
                alert('Hubo un problema al cargar las transacciones.');
            }
        },

          agregarTransaccion(transaccion) {
              const nuevaFila = document.createElement('tr');
              nuevaFila.innerHTML = `<td>${transaccion.monto}</td><td>${transaccion.fecha}</td><td>${transaccion.tipo}</td>`;
              App.htmlElements.tablaBody.appendChild(nuevaFila);
              const sinDatos = document.getElementById('data');
              if (sinDatos) sinDatos.remove(); 
          },

          
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
      },

      template: {
        mensajeExitoso(form, mensaje) {
          const success = document.createElement("span");
          success.textContent = mensaje;
          success.style.color = "green";  
          success.style.marginTop = "10px"; 
          form.appendChild(success);
          setTimeout(() => {
              success.remove();
          }, 2000);
        }
      }
  };

  App.init();
})(window.Sesion);
