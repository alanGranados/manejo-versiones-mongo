import { MongoClient } from "mongodb";

import dotenv from 'dotenv';

dotenv.config();

async function main() {
    let uri = '';

    //Obten parametros de la linea de comandos
    // Se obtienen desde el 3cer parametro ya que desde ahi se guardan los que mandamos nosotros
    const args = process.argv.slice(2);
    console.log(args);
    
    const [DevOrProd, versionEmpresaMicrosip, anio, versionSiCSEsquema, versionPVDescEsquema, eliminado] = args;

    if(DevOrProd === 'PROD'){
        uri = process.env.MONGO_URI_PROD;
    } else if(DevOrProd === 'DEV'){
        uri = process.env.MONGO_URI_DEV;
    } else{
        console.log("Debes indicar si sera en PROD o DEV");
        process.exit(1);
    }
    
    const client = new MongoClient(uri);
    
    try {
        // Conéctate al cliente
        await client.connect();

        // Conéctate a la base de datos y a la colección
        const database = client.db('conversiones');
        const collection = database.collection('versionCompatibilidad');

        // Crear un nuevo registro
        const newVersion = {
            versionEmpresaMicrosip: parseInt(versionEmpresaMicrosip),
            anio: parseInt(anio),
            versionSiCSEsquema: versionSiCSEsquema,
            versionPVDescEsquema: versionPVDescEsquema,
            eliminado: eliminado,
            version: 0,
            creadoEn: new Date(),
            modificadoEn: new Date(),
        };
        console.log(newVersion.versionEmpresaMicrosip);
        console.log(newVersion.anio);
        console.log(newVersion.versionSiCSEsquema);
        console.log(newVersion.versionPVDescEsquema);
        console.log(newVersion.eliminado);
        
        // Inserta el nuevo registro
        const resultado = await collection.insertOne(newVersion);
        console.log(`Nuevo registro insertado con el ID: ${resultado.insertedId}`);
    } finally {
        // Cierra la conexión
        await client.close();
    }
}

main().catch(console.error);



// {
//     "_id" : ObjectId("66c62a01c75f4d14472e4bb8"),
//     "versionEmpresaMicrosip" : NumberInt(1229),
//     "anio" : NumberInt(2024),
//     "versionSiCSEsquema" : "2.0.9",
//     "versionPVDescEsquema" : "1.0.7",
//     "version" : NumberLong(0),
//     "eliminado" : false,
//     "creadoEn" : ISODate("2024-08-21T18:14:43.234+0000"),
//     "modificadoEn" : ISODate("2024-08-21T18:14:43.234+0000")
// }