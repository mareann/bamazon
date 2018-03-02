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
var quitString = "quit";
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
  console.log("updateQuantity "+item+" "+quantity+" "+connection.threadId)
  //console.log("upd connection "+connection)
  var query2 = "UPDATE products SET stock_quantity=stock_quantity-? WHERE item_id=?"
  
  connection.query(query2, [quantity, item], function(err,result) {

  	if (err) throw err;
  	//console.log(result.affectedRows + " record(s) updated");
  	if (result.affectedRows)
  	{
  	  console.log("  \x1b[32mOrder processed successfully!\x1b[0m")
  	  console.log("  Total Cost: \x1b[32m$"+finalCost.toFixed(2)+"\x1b[0m\n  Hope to see you soon!")
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

            inquirer.prompt([
            {
              message: "  How many \x1b[36m"+itemDescription.trim()+"\x1b[0m would you like to buy?",
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
            }
            ])  
            .then(function(itemQuantity) {
   //console.log("how many then inventoryQuantity "+inventoryQuantity)
              orderQuantity = parseInt(itemQuantity.quantityNum);
   //console.log("how many then orderQuantity "+orderQuantity)
              if (orderQuantity <= inventoryQuantity)
              {
                 if (orderQuantity>1)
                   console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemDescription.trim()+"\x1b[0m are available!")     
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[36m"+itemDescription.trim()+"\x1b[0m is available!")

// console.log("desc "+itemDescription)
                 finalCost = parseFloat(itemPrice*orderQuantity);
                 updateQuantity(connection, itemId, itemQuantity.quantityNum)
              }           
          })
}

function executeQuery(connection, query, qCallback) {

  connection.query(query, function (err, rows, fields) {

    if (err) 
      {
        return qCallback(err, null,connection);
      }
    return qCallback(null, rows,connection);
  })
}

function getQuantity(connection,id) {
  var query3 = "SELECT stock_quantity as quan, price,product_name FROM products WHERE item_id ="+id
  executeQuery(connection, query3, qCallback)
}

function qCallback(err,row,connection) {

    if (err) { 
      console.log("qCallback error "+err)
      throw err;}
    inventoryQuantity = row[0].quan;
    itemPrice = row[0].price;
    itemDescription = row[0].product_name;
       //console.log("fields "+fields.quan)
    console.log("Callback quantity available is "+inventoryQuantity+" price "+itemPrice+" "+itemId+" "+itemDescription);    //qResult[0].quan);
    getCustomerQuantity(connection);
}

function getCurrentProducts(connection) {
	var query1 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products"
//debugger;
    connection.query(query1, function(err, prodResult) { //, fields) {
    if (err) 
      {
        console.log("getCurrentProducts ")
        throw err;
      }
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

    // Create a "Prompt" for input.
    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "  Please select enter product id you would like to buy",
        name: "itemID",
        validate: function (value) {
        if (value === quitString)
          process.exit(0);
        if (isNaN(value) === false)
           return true;
        else
          return false;
        }                 
    }
  ])
  .then(function(itemSelection) {
 
 //console.log("result "+prodResult[0].stock_quantity)
 
      itemId = itemSelection.itemID;
      
      if(itemId===quitString)
        {
          console.log("\x1b[32m\n  See you next time!\x1b[0m")
          process.exit(0)
        }
      else 
        {
    // console.log("You selected "+itemId)
          getQuantity(connection,itemId);
        }
  }); // end selection inquirer
   
  }); // function query1 err,result

} // end getCurrentProducts
