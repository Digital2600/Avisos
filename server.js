const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const cors = require('cors');

const app = express();
// Configurar body-parser para manejar datos del formulario
app.use(cors());
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
// Configurar la conexion a la base de datos MySQL

const db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password: 'root',
	database :'avisos'
});

//rutas.....

app.use(express.static(__dirname +'/public'));

//----- Servir(Mostrar) el archivo HTML

app.get('/',(req,res)=>{
		res.sendFile(__dirname+'/index.html');
	});



const PORT = process.env.PORT|| 3000;

app.listen(PORT, function () {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




//------
db.connect(function(err){
	console.log('Conectando a la base de datos MySQL') ;
if (err) {throw err;
}else{
	console.log('Conexion exitosa');
}
});

//-------Manejar la solicitud POST del formulario, funciona ok

 app.post('/submit-form', (req, res) => { 
    const { dni, Apellido, Nombre, FechaDeNac, FechaDeDef, Frase, Aviso } = req.body;
    const sql = 'INSERT INTO difuntos (DNI, APELLIDO, NOMBRE, FECHA_NAC, FECHA_DEF, FRASE, AVISO) VALUES (?, ?, ?, ?, ?, ?, ?)';
	console.log('Datos recibidos:', 
		{
			dni,
			Apellido,
			Nombre,
			FechaDeNac,
			FechaDeDef,
			Frase,
			Aviso
		}
	);
    
	db.query(sql, [dni, Apellido, Nombre, FechaDeNac, FechaDeDef, Frase, Aviso], (err, result) => {
        if (err) {console.error(err);
            return res.status(500).send('Error al guardar en la base de datos');}
        res.send(`
            <p>Registro exitoso</p>
            <h2>Datos del Aviso</h2>
            <p>DNI: ${dni}</p>
            <p>Nombre: ${Nombre}</p>
            <p>Apellido: ${Apellido}</p>
            <p>Fecha de Nacimiento: ${FechaDeNac}</p>
            <p>Fecha de Defunción:${FechaDeDef}</p>
            <p>Frase Elegida: ${Frase}</p>
            <p>Aviso: ${Aviso}</p>
        `);
    });
});   
   
//-------Inserta Registro hardcodeado, si funiona---
 /* const nuevoregistro = "INSERT INTO difuntos (DNI, NOMBRE, APELLIDO, FECHA_NAC, FECHA_DEF, FRASE,AVISO) VALUES (7878, 'jud', 'perd', '2024-08-01', '2024-08-16', 'PAPA SIEMPRE TE RECORDAREMOS CON CARIÑO','MISA CON AMIGOS')";

db.query(nuevoregistro,function(error,filas){
	if(error){
		throw error;
	}else{
		console.log("datos instertados correctamente");
	}
});  */

//------- Muestra Registros por consola, si funciona---------
const registros = "SELECT * FROM difuntos";

db.query(registros, function(error, lista){
	if (error){
		throw error;

	}else{
		console.log(lista);
		
	}	
	});
	

app.get('/api/datos', (req, res) => {
  const query = 'SELECT * FROM difuntos LIMIT 50';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
  });
});
 


	
    
   