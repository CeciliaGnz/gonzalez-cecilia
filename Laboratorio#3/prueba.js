/*PROBLEMA #1
-------------------------------------------------------------------------*/
(() => {
    const paliDiez = (numero) => {
        const strNumero = numero.toString();
        for (let i = 0; i < Math.floor(strNumero.length / 2); i++) {
            if (strNumero[i] !== strNumero[strNumero.length - 1 - i]) {
                return false;
            }
        }
        return true;
    };

    const paliDos = (numero) => {
        const binario = numero.toString(2); //valor en base 2
        for (let i = 0; i < Math.floor(binario.length / 2); i++) {
            if (binario[i] !== binario[binario.length - 1 - i]) {
                return false;
            }
        }
        return true;
    };

    const paliDoble = (numero) => {
        return paliDiez(numero) && paliDos(numero);
    };

    // Función para validar el número ingresado en el HTML
    const validarNumero = () => {
        const input = document.getElementById('numeroPali');
        const numero = parseInt(input.value);
        const resultado = paliDoble(numero);

        // Display the result in the HTML
        const resultadoElemento = document.getElementById('resultPalin');
        if (resultado) {
            resultadoElemento.textContent = `El número ${numero} es un palíndromo de doble base.`;
        } else {
            resultadoElemento.textContent = `El número ${numero} no es un palíndromo de doble base.`;
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const btnValidar = document.getElementById('validarBtn');
        btnValidar.addEventListener('click', validarNumero);
    });
})();
//-------------------------------------------------------------------------


/*PROBLEMA #2
-------------------------------------------------------------------------*/
(()=>{
    const caracteres = String => {
        const contCaract = {}

        for(let char of String){
            if(contCaract[char]){
                contCaract[char]++;
            }else{
                contCaract[char]=1;
            }
        }return contCaract;
    };


    const cadenaCaract = () => {
        const cadenaInput = document.getElementById('cadena');
        const cadena = cadenaInput.value;
        const result = caracteres(cadena);

        // Mostrar el resultado en el HTML
        const resultElemento = document.getElementById('resultCaract');
        resultElemento.textContent = JSON.stringify(result); // Mostrar el objeto como cadena JSON
    };

    document.addEventListener('DOMContentLoaded', () => {
        const btnEnviar = document.getElementById('btnEnviar');
        btnEnviar.addEventListener('click', cadenaCaract);
    });

})();
//-------------------------------------------------------------------------


/*PROBLEMA #3
-------------------------------------------------------------------------*/
(()=>{


})();
//-------------------------------------------------------------------------


/*PROBLEMA #4
-------------------------------------------------------------------------*/
(()=>{
    const esPrimo = (num) => {

        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {return false;}
        }return true;
    };

    const sumaPrimos = (n) => {
        let suma = 0;

        for (let i = 1; i < n; i++) { //SUMA HASTA EL NUMERO DEBAJO DEL DADO   
            if (esPrimo(i)) {
                suma += i;}
        }return suma;
    };

    const verificarPrimo = () => {
        const numPrimo = parseInt(document.getElementById('numPrimo').value);
        const resultSum = sumaPrimos(numPrimo);

        document.getElementById('resultPrimo').innerText = `La sumatoria de todos los números primos menores que ${numPrimo} es: ${resultSum}`;
    };

    document.addEventListener('DOMContentLoaded', () => {
        const btnVerificar = document.getElementById('btnVerificar');
        btnVerificar.addEventListener('click', verificarPrimo);
    });

})();
//-------------------------------------------------------------------------