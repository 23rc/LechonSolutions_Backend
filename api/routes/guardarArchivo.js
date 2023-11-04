const fs = require('fs');

function guardarArchivoDeTexto() {
  const contenido = 'Este es el contenido del archivo de texto.';

  fs.writeFile('uploads/archivo.txt', contenido, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
    } else {
      console.log('Archivo de texto guardado exitosamente.');
    }
  });
}

// Llama a la función para guardar el archivo de texto
guardarArchivoDeTexto();
