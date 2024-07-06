# Proyecto-Ds9
Un proyecto donde utilizamos express, tailwinds y otras herramientas para reecrear un sitio webs con e-commerce

Execute Tailwindcss in terminal: npm run build:css
End Tailwindcss: Ctrl+C

"scripts": {
    "build:css": "tailwindcss -i ./frontend/src/css/input.css -o ./frontend/src/css/output.css --watch",
    "start": "npm run build:css & npm run start:server",
    "start:css": "tailwindcss -i ./frontend/src/css/input.css -o ./frontend/src/css/output.css",
    "start:server": "node backend/src/index.js"
  }

  Con el comando de (npm run "nombre"), ejecutamos el script
  build:css : Ejecuta tailwind y cuando se guardan cambios se refleja enseguida
  start: Ejecuta tanto tailwind y el servidor de node
  start:css: Ejecuta tailwind con los ultimos cambios guardado, no se reflejan los que se guardan luego de ejecutarse
  start:server: Ejecuta el servidor de node

    Para ejecutar aparte tailwind y el servido:
    abrir dos terminales: ejecutar en la carpeta raiz de proyecto-ds9: npm run build:css
    en la carpeta backend (para moverno a la carpeta (cd backend) ó para regresar a la raiz (cd ..)): ejecutar npm start

 /*validar si estas dependecias(express y cors) en la carpeta raiz van, porque ya estan en el package.json del backend?*/
