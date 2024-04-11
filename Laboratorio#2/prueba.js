//Creación de var
var num1 = 8, num2 = 4;
//Creación de let
let word1 = "Hola", word2 = "Adios";
//Creación de const
const const1 = true, const2 = 9;


//Operaciones
console.log ("Operaciones con los números "+num1+" y "+num2)
console.log("Suma: "+(num1+num2))
console.log("Resta: "+(num1-num2))
console.log("Multiplicación: "+(num1*num2))
console.log("División: "+(num1/num2))

//Concatenacion de las variable tipo let
console.log("\n"+word1+" "+word2)
//Impresión del tipo de dato con const
console.log("\nTipo de dato de constante 1: "+typeof const1+"\nTipo de dato de constante 2: "+typeof const2+"\n")

//Creación del objeto
const objetoPrueba = {
    numero: 9,
    cadena: "JavaScript",
    booleano: true,
    nuevoObjeto:{} //objeto vacio
}
console.log(objetoPrueba)

const num = 10
const result = sumaMultiplos(num);
console.log("\nNumero: "+num+"\nResultado de suma de multiplos: "+result)
    

//Funcion de suma de multiplos
function sumaMultiplos(num) {
    let sum = 0;
    for (let i = 0; i < num; i++) {
        if (i % 3 === 0 || i % 5 === 0) {
            sum += i;
        }
    }
    return sum;
}

