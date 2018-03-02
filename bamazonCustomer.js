var mysql = require("mysql")
var inquirer = require("inquirer")
var Table = require('easy-table')

var pool = mysql.createPool({
  connectionLimit : 1,
  waitForConnections: true,
  host: "localhost",
  port: 3306,
  debug: false,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

/* 
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});*/
//var connection = mysql.createConnection({debug: true});
pool.getConnection( function(err,connection) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  poolConnection = connection;
  getCurrentProducts(connection);
});
//console.log('\x1b[36m%s\x1b[0m','teststring')
//console.log("\x1b[32mtesting\x1b[0m")
var inventory = {}
//var inventoryNumberDisplayed = 0;
var choicesAvailable = [];
//var itemID = 0;
var itemPrice = 0;
var itemId = ''; // item description
var inventoryQuantity = 0; //quantity available to sell
var itemDescription = '';
//var itemIDtmp = '';
var finalCost = 0;
var orderQuantity = 0;  // number of item requested from the customer prompt
var quitString = "quit"
/*
function userChoices()
{
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{
   	choicesAvailable[j]=String(inventory[j].product)+" price:$"+String(inventory[j].price)+String(" id: "+inventory[j].id
   	+":"+inventory[j].stock_quantity)
   }
   choicesAvailable[j]=quitString
 
}
*/
function updateQuantity(connection,item,quantity) {
  console.log("updateQuantity "+item+" "+quantity+" "+connection)
  console.log("upd connection "+connection)
  var query2 = "UPDATE products SET stock_quantity=stock_quantity-? WHERE item_id=?"
  
  connection.query(query2, [quantity, item], function(err,result) {

  	if (err) throw err;
  	//console.log(result.affectedRows + " record(s) updated");
  	if (result.affectedRows)
  	{
  	  console.log("  \x1b[32mOrder processed successfully!\x1b[0m")
  	  console.log("  Total Cost: \x1b[32m$"+finalCost+"\x1b[0m\n  Hope to see you soon!")
  	}
  	process.exit(0)
/* FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"  */ 
  });
}
var prodResult = {};

function getCustomerQuantity(connection){
console.log("getCustomerQuantity")
            inquirer.prompt([
            {
              message: "  How many "+itemDescription+" would you like to buy?",
              type: "input",
              name: "quantityNum",
              validate: function (value) {
                   if (value < inventoryQuantity && isNaN(value) === false && parseInt(value) > 0) // && parseInt(value) <= 10)
                    {
                    return true;
                    }
                   else
                   { 
                    console.log(" \x1b[31mplease reduce quantity\x1b[0m");
                    //return false;
                   }
                }     
/*
              message: "  How many would you like to buy?",
              type: "input",
              name: "quantityNum",
              validate: function (value) {
                   if (isNaN(value) === false && parseInt(value) > 0) // && parseInt(value) <= 10)
                    return true;
                   else
                    return false;
                }  */   
            }
            ])  
            .then(function(itemQuantity) {
   console.log("how many then inventoryQuantity "+inventoryQuantity)
              orderQuantity = parseInt(itemQuantity.quantityNum);
              console.log("how many then orderQuantity "+orderQuantity)
              if (orderQuantity <= inventoryQuantity)
              {
                 if (orderQuantity>1)
                   console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemDescription+"\x1b[0m are available!")     
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[36m"+itemDescription+"\x1b[0m is available!")

                  /*
                   console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[0m are available!")     
                 //  console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemTitle+"\x1b[0m are available!")     
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[0m is available!")*/   
 console.log("desc "+itemDescription)
                 finalCost = parseFloat(itemPrice*orderQuantity);
                 updateQuantity(connection, itemId, itemQuantity.quantityNum)
              }/*
              else
               {
                 console.log("\x1b[31m  Sorry. Please reduce your quantity.\x1b[0m")
                 console.log("need new prompt here")
                 process.exit(0)
               */               
          })
}

function executeQuery(connection, query, qCallback) {
    /*pool.getConnection(function (err, connection) {
        if (err) {
            return qCallback(err, null);
        }
        else if (connection)
        */ 
        {
            connection.query(query, function (err, rows, fields) {
              console.log("release")
                //connection.release();
                if (err) {
                    return qCallback(err, null,connection);
                }
                console.log("cal qCallback")
                return qCallback(null, rows,connection);
            })
        }
        /*
        else {
            return qCallback("No connection", null);
        }
    });*/
}

function getQuantity(connection,id) {
      var query3 = "SELECT stock_quantity as quan, price,product_name FROM products WHERE item_id ="+id
console.log("getQuantity before ")
     executeQuery(connection, query3, qCallback) 
}

function qCallback(err,row,connection) {
  console.log("in qCallback")
      if (err) { 
      console.log("error "+err)
      throw err;}
    inventoryQuantity = row[0].quan;
    itemPrice = row[0].price;
    itemDescription = row[0].product_name;
       //console.log("fields "+fields.quan)
    console.log("Callback quantity available is "+inventoryQuantity+" price "+itemPrice+" "+itemDescription);    //qResult[0].quan);
    getCustomerQuantity(connection);
}
/*
async function getProductQuantity(connection,id) {
    var query3 = "SELECT stock_quantity as quan, price,product_name FROM products WHERE item_id ="+id
    console.log(query3);

    await connection.query(query3, function(err, row) {
      
    if (err) { 
      console.log("error "+err)
      throw err;}
/*var query = await connection.query(query3);
query
  .on('error', function(err) {
    console.log("error "+err)
    if (err) throw err;
    // Handle error, an 'end' event will be emitted after this as well
  })*/
/*  .on('fields', function(fields) {
    // the field packets for the rows to follow
  }) */
  /*
  .on('result', function(row) {
    console.log("pause")
    // Pausing the connnection is useful if your processing involves I/O
    connection.pause();
 
    processRow(row, function() {

      connection.resume();
      console.log("resume row "+row)
      */
      /*
      inventoryQuantity = row[0].quan;
    itemPrice = row[0].price;
    itemDescription = row[0].product_name;
       //console.log("fields "+fields.quan)
    console.log("quantity available is "+inventoryQuantity+" price "+itemPrice+" "+itemDescription);    //qResult[0].quan);

    });

  //})
  /*.on('end', function() {
console.log("end")
    // all rows have been received
  });*/
  /*
  var query3 = "SELECT stock_quantity as quan, price,product_name FROM products WHERE item_id ="+id
    console.log(query3);
debugger;       
    connection.query(query3, function(err, qResult) { //, fields) {
       if (err) throw err;
       console.log("len "+qResult.length)
    inventoryQuantity = qResult[0].quan;
    itemPrice = qResult[0].price;
    itemDescription = qResult[0].product_name;
       //console.log("fields "+fields.quan)
    console.log("quantity available is "+inventoryQuantity+" price "+itemPrice+" "+itemDescription);    //qResult[0].quan);

    //return(qResult[0].quan);
 })*/
 /*
    console.log("getProductQ inventoryQuantity "+inventoryQuantity)
    if ( inventoryQuantity )
    {
      getCustomerQuantity();
      console.log("x itemId "+itemId)
      console.log("x inventory "+inventoryQuantity)
      console.log("x orderQuantity "+orderQuantity)
          //getCustomerQuantity();
      finalCost = parseFloat(itemPrice*orderQuantity);
    }
   // return(1)
   //return(qResult[0].quan)
}*/

function getCurrentProducts(connection) {
	var query1 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products"
debugger;
    connection.query(query1, function(err, prodResult) { //, fields) {
    if (err) throw err;
 
    console.log("  BAMAZON BEST SELLERS")
    inventory = prodResult;
    inventoryQuantityberDisplayed = prodResult.length;

    var tbl = new Table
 
    prodResult.forEach(function(product) {
      tbl.cell('Product Id', product.id)
      tbl.cell('Description', product.product)
      tbl.cell('Price, USD', product.price, Table.number(2))
      tbl.cell('Avail',product.stock_quantity)
      tbl.newRow()
    })

   console.log(tbl.toString());

//    userChoices();
    // Create a "Prompt" with a series of questions.
    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
      //name: availableProducts,
        type: "input",
        //type: 'list',
        message: "  Please select enter product id you would like to buy",
        name: "itemID",
        validate: function (value) {
        //if (value === quitstring)
        //  process.exit(0);
        if (isNaN(value) === false) //&& parseInt(value) > 0 && parseInt(value) <= 10) 
           return true;
        else
          return false;
        }     

        //choices:  choicesAvailable                  
    }
  ])
  .then(function(itemSelection) {
 
 //console.log("result "+prodResult[0].stock_quantity)
 
          itemId = itemSelection.itemID;
console.log("You selected "+itemId)
      if(itemId===quitString)
        {
          console.log("\x1b[32m\n  See you next time!\x1b[0m")
          process.exit(0)
        }
      else 
        {
          /*
          var tmp = itemSelection.itemDesc.split(":")
          var tmp0 = tmp[0].replace("price","").trim();
          var itemTitle = tmp0;
          //console.log("itemTitle"+itemTitle)
          itemID = parseInt(tmp[tmp.length-2])
          var tmp2 = tmp[tmp.length-3].split(" ") 
          var Price = parseFloat(tmp2[0].replace('$',''))
          //console.log("selected item "+itemID+"tmp "+tmp);
          var inventoryNum = parseInt(tmp[tmp.length-1])
          //console.log(" inventory of "+inventoryNum)
          */

          //var inventoryNum = itemSelection.stock_quantity;
          //console.log("inventoryNum "+inventoryNum)  
          //inventoryNum = 

          debugger;
            getQuantity(connection,itemId);
          //getProductQuantity(connection,itemId);
          //console.log("after getProductQuantity")
console.log("before upd itemId "+itemId+" "+itemDescription)
console.log("before upd inventory "+inventoryQuantity)
console.log("before upd orderQuantity "+orderQuantity)
          //getCustomerQuantity();
//          finalCost = parseFloat(itemPrice*orderQuantity);
  //console.log("before updateQuantity ")
          //updateQuantity(connection, inventoryQuantity, orderQuantity)
          ///console.log("bef inventoryQuantity "+inventoryQuantity)
          //while ( itemDescription === '')

          if (0){
          inquirer.prompt([
            {
              message: "  How many "+itemDescription+" would you like to buy?",
              type: "input",
              name: "quantityNum",
              validate: function (value) {
                   if (value < inventoryQuantity && isNaN(value) === false && parseInt(value) > 0) // && parseInt(value) <= 10)
                    return true;
                   else
                    return false;
                }     
            }
            ])  
            .then(function(itemQuantity) {
   console.log("inventoryQuantity "+inventoryQuantity)
              orderQuantity = parseInt(itemQuantity.quantityNum);
              console.log("orderQuantity "+orderQuantity)
              if (orderQuantity <= inventoryQuantity)
              {
                if (orderQuantity>1)
                 //  console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[0m are available!")     
                   console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemDescription.trim()+"\x1b[0m are available!")     
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[36m"+itemDescription.trim()+"\x1b[0m is available!")
                   //console.log("\x1b[37m\n  YAY!  \x1b[0m is available!")      
 
/*
                 if (orderQuantity>1)
      	           console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemTitle+"\x1b[0m are available!")    	
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[36m"+itemTitle+"\x1b[0m is available!")      
 */
      	         finalCost = parseFloat(itemPrice*orderQuantity);
      	         updateQuantity(connection, itemId, itemQuantity.quantityNum)
              }
              else
	             {
               	 console.log("\x1b[31m  Sorry. Please reduce your quantity.\x1b[0m")
              	 console.log("need new prompt here")
      	         process.exit(0)
	             }
               
          }) // end quantity inquirer
}
        } //else  
     }); // end selection inquirer
   
  }); // function query1 err,result

} // end afterConnection
