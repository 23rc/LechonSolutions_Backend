// Importa las dependencias necesarias para tus pruebas
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app'); // Asegúrate de que este sea el camino correcto a tu archivo principal de Express.
const ControlCerda = require('../../models/ControlCerda'); // Asegúrate de importar el modelo Cerda
const Producto = require('../../models/Producto');
const ControlParto = require('../../models/InfoParto');


chai.use(chaiHttp);
const expect = chai.expect;

describe('Prueba 1', () => {

  it('Insertar un registro en ControlCerda y rebajar el stock del producto', (done) => {
    chai
      .request(app)
      .post('/controlcerda/controlcerdaInsertar') 
      .send({
        // Proporciona los datos necesarios para la inserción
        cerda_id: 1, // Reemplaza con valores reales
        cerda_nombre: 'Martina', // Reemplaza con valores reales
        barraco_id: null, // Reemplaza con valores reales
        barraco_nombre: 'null', // Reemplaza con valores reales
        pacha_id: 16, // Reemplaza con valores reales
        pacha_nombre: 'AldonsoPower', // Reemplaza con valores reales
        tipo_carga: 'Artificial', // Reemplaza con valores reales
        fecha_inseminacion: '2023-10-28', // Reemplaza con valores reales
        fecha_confirmacion_carga: '2023-10-28', // Reemplaza con valores reales
        confirmar_carga: 'No Cargada', // Reemplaza con valores reales
        observaciones: 'Todo bien', // Reemplaza con valores reales
        producto_id: 16, // Reemplaza con valores reales
      })
      .end(async (err, res) => {
        try {
          expect(res).to.have.status(201); 
          expect(res.body).to.have.property('message', 'Registro de ControlCerda insertado exitosamente.');

          const producto = await Producto.findByPk(16);
          expect(producto).to.exist; 
          expect(producto.stock).to.equal(27); 

          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

describe('Prueba 2', () => {
  it('Elimina un registro de control de parto y actualizar confirmar_carga', (done) => {
    // Obtén el ID de un registro de control de parto existente que desees eliminar
    const controlPartoIdAEliminar = 93; // Reemplaza con el ID real que deseas eliminar
    const controlCerdaIdRelacionado = 80; // Reemplaza con el ID real de control_cerda relacionado

    chai
      .request(app)
      .delete(`/controlparto/controlPartoEliminar/${controlPartoIdAEliminar}`)
      .end(async (err, res) => {
        try {
          expect(res).to.have.status(200); // Se espera una respuesta exitosa
          expect(res.body).to.have.property('message', 'Registro de control de parto eliminado exitosamente y confirmar_carga actualizado.');

          // Verificar que el registro de control de parto haya sido eliminado
          const deletedControlParto = await ControlParto.findByPk(controlPartoIdAEliminar);
          expect(deletedControlParto).to.be.null; // Debería ser nulo ya que se eliminó

          // Verificar que confirmar_carga en control_cerda se haya actualizado
          const controlCerda = await ControlCerda.findByPk(controlCerdaIdRelacionado);
          expect(controlCerda).to.exist; // Debería existir
          expect(controlCerda.confirmar_carga).to.equal('No Cargada');

          done();
        } catch (error) {
          done(error);
        }
      });
  });
});


describe('Prueba 3', () => {
  it('Obtiene datos de control de parto con información relacionada', (done) => {
    chai
      .request(app)
      .get('/controlparto') 
      .end(async (err, res) => {
        try {
          expect(res).to.have.status(200); 
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});


describe('Prueba 4', () => {
  it('Obtiene el último parto de info_parto para una cerda', (done) => {
    const cerdaId = 2; // Reemplaza con el ID de cerda correcto
    chai
      .request(app)
      .get('/infoparto/obtener-ultimo-parto-info')
      .query({ cerdaId }) // Agrega el ID de cerda como parámetro de consulta
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res).to.have.status(200); // Verifica que la respuesta sea exitosa
          expect(res.body).to.be.a('number'); // Verifica que el cuerpo de la respuesta sea un número

          // Imprime en la consola el número del último parto obtenido
          console.log('Número del último parto:', res.body);

          done();
        }
      });
  });
});


describe('Prueba 5', () => {
  it('Debería insertar una nueva camada de lechones y actualizar el destete a "Cargado"', function(done) {


    // Define los datos de la nueva camada a insertar
    const nuevaCamada = {
      id_cerda: 1,
      numero_parto: 1,
      cerda_nombre: 'Martina',
      tip_carga: 'Natural',
      barraco_nombre: 'Martin',
      pacha_nombre: 'Pacha 1',
      fecha_parto: '2023-10-30',
      lechones: 5,
      id_destete: 23, // Reemplaza con el ID real del destete
    };

    chai
      .request(app)
      .post('/camadalechones/insertarCamada') // Reemplaza '/ruta/insertarCamada' con la ruta correcta
      .send(nuevaCamada)
      .end(async (err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res).to.have.status(200); // Verifica que la respuesta sea exitosa
          expect(res.body).to.have.property('codigo_camada'); // Verifica que se haya generado un código de camada

   

          // Imprime en la consola la respuesta recibida
          console.log('Respuesta de inserción de camada:', res.body);

          done();
        }
      });
  });
});
