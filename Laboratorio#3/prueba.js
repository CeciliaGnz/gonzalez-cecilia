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

    const validarNumero = () => {
        const numInput = document.getElementById('numeroPali');
        const numero = parseInt(numInput.value);
        const resultado = paliDoble(numero);

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

        const resultElemento = document.getElementById('resultCaract');
        resultElemento.textContent = JSON.stringify(result); //De objeto a JSON
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

    const bisiesto =(anio)=>{
        if (anio % 4 === 0){
            if (anio % 100 === 0){
                if (anio % 400 === 0){
                    return true
                }
            }
        }
    }

    const validarAnio =()=>{
        const anioInput = document.getElementById('anio');
        const anio = parseInt(anioInput.value);
        const resulBisiesto = document.getElementById('resultBisiesto');
        
        if(anio > 0){
        const resultAnio=bisiesto(anio);
        if (resultAnio) {
            resulBisiesto.textContent = `El año ${anio} es bisiesto.`;
        } else {
            resulBisiesto.textContent = `El año ${anio} no es bisiesto`;
        }
    }else {resulBisiesto.textContent = `${anio} no es un año valido`;}

    }

    document.addEventListener('DOMContentLoaded', () => {
        const btnEnviar = document.getElementById('btnAnio');
        btnEnviar.addEventListener('click', validarAnio);
    });

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