const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(cors());
// ROUTES

const userRoute = require('./api/routes/user');
app.use('/user',userRoute);
const barracoRoute = require('./api/routes/barraco');
app.use('/barraco',barracoRoute);
const cerdaRoute = require('./api/routes/cerda');
app.use('/cerda',cerdaRoute);
const pachaRoute = require('./api/routes/pacha');
app.use('/pacha',pachaRoute);
const sesionRoute = require('./api/routes/sesion');
app.use('/sesion',sesionRoute);
const clienteRoute = require('./api/routes/cliente');
app.use('/cliente',clienteRoute);
const permisoRoute = require('./api/routes/permiso');
app.use('/permiso',permisoRoute);
const ControlCerdaRoute = require('./api/routes/controlCerda');
app.use('/controlcerda',ControlCerdaRoute);

const ControlPartoRoute = require('./api/routes/controlPartos');
app.use('/controlparto',ControlPartoRoute);

const InfoPartoRoute = require('./api/routes/infoParto');
app.use('/infoparto',InfoPartoRoute);

const TratamientoRoute = require('./api/routes/tratamiento');
app.use('/tratamiento',TratamientoRoute);
const TemperaturaRoute = require('./api/routes/temperatura');
app.use('/temperatura',TemperaturaRoute);
const ResumenPartoRoute = require('./api/routes/resumenParto');
app.use('/resumenparto',ResumenPartoRoute);

const PartoRoute = require('./api/routes/parto');
app.use('/parto',PartoRoute);

const DesteteRoute = require('./api/routes/destete');
app.use('/destete',DesteteRoute);



const CamadaLechonesRoute = require('./api/routes/camadaLechones');
app.use('/camadalechones',CamadaLechonesRoute);

const VentasRoute = require('./api/routes/ventas');
app.use('/ventas',VentasRoute);



const ProductoRoute = require('./api/routes/producto');
app.use('/producto',ProductoRoute);


const ProveedorRoute = require('./api/routes/proveedor');
app.use('/proveedor',ProveedorRoute);



const ComprasRoute = require('./api/routes/compras');
app.use('/compras',ComprasRoute);

module.exports = app;








