const { Telegraf } = require('telegraf')
//TOKEN
const bot = new Telegraf('5347582378:AAEnBUCEPi96ehNzsfU3X2oVDGlKtG3ZG6s');

//Conexion
const mysql=require('mysql')

const conn=mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"",
   database:"promart"
})

conn.connect(function(err){
   if(err){
      throw err;
   }
   console.log("connected!");


bot.start((ctx) => ctx.reply('Bienvenido!'));
bot.settings((ctx) => ctx.reply('Bienvenido!'));

//------------------------------------------------------------------------------------------------
//LISTA DE CATEGORIAS - Extracción
   conn.query("Select * from categoria", function(err,result,fields){
      if(err){
         throw err;
      }
      dataCategoria=[];
      //console.log(result);
      
      result.forEach(item=>{
         //console.log(item.nombre);
         dataCategoria.push({
            id:item.idCategoria,
            nombre:item.nombre,
            descripcion:item.descripcion
         })
      })
      
   })
   

//------------------------------------------------------------------------------------------------

//LISTA DE PRODUCTOS - Extracción
conn.query("Select * from producto", function(err,result,fields){
   if(err){
      throw err;
   }
   dataProductos=[];
   //console.log(result);
   
   result.forEach(item=>{
      //console.log(item.nombre);
      dataProductos.push({
         id:item.idProductos,
         nombre:item.nombre,
         costo:item.costo,
         cantidad:item.cantidad,
         descripcion:item.descripcion,
         idCategoria:item.idCategoria,
      })
   })
   
})
//------------------------------------------------------------------------------------------------

//LISTA DE PRODUCTOS LANZAMIENTO - Extracción
conn.query("Select * from producto WHERE estado='Lanzamiento'", function(err,result,fields){
   if(err){
      throw err;
   }
   dataProductosLanz=[];
   //console.log(result);
   
   result.forEach(item=>{
      //console.log(item.nombre);
      dataProductosLanz.push({
         id:item.idProductos,
         nombre:item.nombre,
         costo:item.costo,
         cantidad:item.cantidad,
         descripcion:item.descripcion,
         idCategoria:item.idCategoria,
      })
   })
   
})
//------------------------------------------------------------------------------------------------

//LISTA DE PRODUCTOS EN OFERTA - Extracción
conn.query("SELECT p.nombre AS producto, o.nombre AS oferta, p.costo,op.nuevo_precio AS nuevoCosto FROM ofertas_productos AS op JOIN producto AS p ON p.idProducto=op.idProducto JOIN oferta AS o ON o.idOferta=op.idOferta", function(err,result,fields){
   if(err){
      throw err;
   }
   dataProductosOferta=[];
   //console.log(result);
   
   result.forEach(item=>{
      //console.log(item.nombre);
      dataProductosOferta.push({
         producto:item.producto,
         oferta:item.oferta,
         costo:item.costo,
         nuevoCosto:item.nuevoCosto
      })
   })
   
})
//------------------------------------------------------------------------------------------------
})

//Respuesta del Help
const helpMessage='Muy buenos días. Escoja la opcion que desea:\n 1. /Categorias - Ver todas las categorías disponibles!\n 2. /Productos - Ver todos los productos de la tienda. \n 3. /ProductosLanzamiento - Ver los productos en lanzamiento.  \n 4. /ProductosOferta - Ver los todos los productos en oferta.';
bot.help((ctx) => ctx.reply(helpMessage))

bot.command('VerProductos',(ctx)=>{
   let mensajeMenu='Muy buenos días. Escoja la opcion que desea:\n 1. /Categorias - Ver todas las categorías disponibles!\n 2. /Productos - Ver todos los productos de la tienda. \n 3. /ProductosLanzamiento - Ver los productos en lanzamiento.  \n 4. /ProductosOferta - Ver los todos los productos en oferta.';
   ctx.reply(mensajeMenu);
   
})
//------------------------------------------------------------------------------------------------
//LISTA DE CATEGORIAS - Impresión
bot.command('Categorias',(ctx)=>{
   var idA=0;
   let CategoriaMensaje='Categorías: \n';
   
   dataCategoria.forEach(item=>{
      idA++;
      CategoriaMensaje+=idA+`. /${item.nombre}\n`;
   })

   CategoriaMensaje+='\n Para ver la descripción de la categoría, seleccione la categoría a su elección.'

   ctx.reply(CategoriaMensaje);
   
})
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
//DESCRIPCION DE CATEGORIAS - Impresión
var idA=0;
/*
//Ciclo de todas las categorias
dataCategoria.forEach(item=>{
   // segun la categoria seleccionada
   bot.command(item.nombre,(ctx)=>{
      let mens_descCategoria=`${item.nombre}` +`: `+ `${item.descripcion}\n`;
     
      ctx.reply(mens_descCategoria);
      
   })
})
*/

//------------------------------------------------------------------------------------------------
//LISTA DE PRODUCTOS - Impresión
bot.command('Productos',(ctx)=>{
   var idA=0;
   let ProductoMensaje='Todos los productos: \n';
   
   dataProductos.forEach(item=>{
      idA++;
      ProductoMensaje+=idA+`. ${item.nombre} -> S/. ${item.costo} \n\n`;
   })
   ctx.reply(ProductoMensaje);
   
})
//------------------------------------------------------------------------------------------------
//LISTA DE PRODUCTOS en LANZAMIENTO- Impresión
bot.command('ProductosLanzamiento',(ctx)=>{
   var idA=0;
   let ProductoMensaje='Todos los productos en lanzamiento: \n';
   
   dataProductosLanz.forEach(item=>{
      idA++;
      ProductoMensaje+=idA+`. ${item.nombre} -> S/. ${item.costo} \n\n`;
   })
   ctx.reply(ProductoMensaje);
   
})
//------------------------------------------------------------------------------------------------

//LISTA DE PRODUCTOS en OFERTA- Impresión
bot.command('ProductosOferta',(ctx)=>{
   var idA=0;
   let ProductoMensaje='Todos los productos en oferta: \n';
   
   dataProductosOferta.forEach(item=>{
      idA++;
      ProductoMensaje+=idA+`. ${item.producto} en oferta por ${item.oferta} -> Costo Original S/. ${item.costo}  -> Costo en OFERTA S/. ${item.nuevoCosto}  \n\n`;
   })
   ctx.reply(ProductoMensaje);
   
})
bot.command('Tecnologia',(ctx)=>{
   let CategoriaMensaje='Tecnologia: Incluye TV y Video, Computo, Telefonía, Casa inteligente, Audio, Videojuegos y Cámaras ';
   ctx.reply(CategoriaMensaje);
})

bot.command('Electrohogar',(ctx)=>{
   let CategoriaMensaje='Electrohogar: Incluye Electrodomésticos, Cocinas, campanas, hornos, refrigeradoras, Lavadoras, Secadoras, Climatización, Cuidado Personal y Termas';
   ctx.reply(CategoriaMensaje);
})



bot.launch()
