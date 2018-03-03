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

pool.getConnection( function(err,connection) {
  if (err) 
   {
    console.log("error: getConnection ("+connection.threadId+")");
    throw err;
   }

  poolConnection = connection;
  getCurrentProducts(connection);
});

var inventory = [];

var itemPrice = 0;
var itemId = '';           // item description
var inventoryQuantity = 0; //quantity available to sell
var itemDescription = '';
var finalCost = 0;
var orderQuantity = 0;     // number of item requested from the customer prompt
var quitString = "quit";
var debug = false;
var prodResult = {};

function updateQuantity(connection,item,quantity) {
  if (debug)
    console.log("updateQuantity "+item+" "+quantity+" "+connection.threadId)

  var query2 = "UPDATE products SET stock_quantity=stock_quantity-? WHERE item_id=?"
  
  connection.query(query2, [quantity, item], function(err,result) {

  	if (err) 
      {
        console.log("Error: updateQuantity ")
        throw err;
      }
    if (debug)
  	  console.log(result.affectedRows + " record(s) updated");
  	if (result.affectedRows)
  	{
  	  console.log("    \x1b[32mOrder processed successfully!\x1b[0m"); //green text
  	  console.log("    Total Cost: \x1b[32m$"+finalCost.toFixed(2)+"\x1b[0m\n\n    Thank you for your business!")
    }

    //restart bamazon
    getCurrentProducts(connection);
  	
  });
}
/* 
FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"  */ 

function getCustomerQuantity(connection) {

            inquirer.prompt([
            {
              message: "  How many \x1b[36m"+itemDescription.trim()+"\x1b[0m would you like to buy?",
              type: "input",
              name: "quantityNum",
              validate: function (value) {
                   if (value == quitString || value == 'q')
                    {
                      console.log("\x1b[32m\n\n    See you next time!\x1b[0m")
                      process.exit(0)
                    }
                   if (value < inventoryQuantity && isNaN(value) === false && parseInt(value) > 0)
                     return true;
                   else
                   { 
                     if ( value == 0 )
                      console.log(" \x1b[31mPlease enter valid quantity or enter q to quit\x1b[0m"); //red text
                     else
                      console.log(" \x1b[31mPlease reduce quantity or enter q to quit\x1b[0m"); //red text
                   }
                }     
            }
            ])  
            .then(function(itemQuantity) {

              orderQuantity = parseInt(itemQuantity.quantityNum);
   
              if (orderQuantity <= inventoryQuantity)
              {
                 if (orderQuantity>1)
                   console.log("\x1b[37m\n    YAY! "+orderQuantity+" \x1b[36m"+itemDescription.trim()+"\x1b[0m are available!")     
                 else
                   console.log("\x1b[37m\n    YAY! \x1b[36m"+itemDescription.trim()+"\x1b[0m is available!")

                 finalCost = parseFloat(itemPrice*orderQuantity);
                 updateQuantity(connection, itemId, itemQuantity.quantityNum)
              }           
          })
}

function executeQuery(connection, query, qCallback) {

  connection.query(query, function (err, rows, fields) {

    if (err) 
      {
        console.log('exe The solution is: ', rows[0].solution)
        console.log("exe err "+err)
        return qCallback(err, null,connection);
      }
    if (rows.length == 0 )
       return(-1)
    else
      return qCallback(null, rows,connection);
  })
}

function getQuantity(connection,id) {
  //var subquery = " and ("+id+" in (select distinct item_id from products))"
  var query3 = "SELECT stock_quantity as quan, price,product_name FROM products WHERE item_id ="+id

  executeQuery(connection, query3, qCallback);
}

function qCallback(err,row,connection) {

    if (row.length == 0)
      return(-1);
    if (err) 
     { 
      console.log("Error: qCallback "+err)
      throw err;
     }
    inventoryQuantity = row[0].quan;
    itemPrice = row[0].price;
    itemDescription = row[0].product_name;
       //console.log("fields "+fields.quan)
    if (debug)
      console.log("Callback quantity available is "+inventoryQuantity+" price "+itemPrice+" "+itemId+" "+itemDescription);    //qResult[0].quan);
    
    getCustomerQuantity(connection);
}

function validItemId(id){
  for (var i=0; i<inventory.length;i++)
  {
     if (inventory[i] == id)
      return(true)
  }
  console.log("\x1b[31m  Invalid id. Please try again\x1b[0m")
  return(false)
}

function getCurrentProducts(connection) {
	var query1 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products"
//debugger;
    connection.query(query1, function(err, prodResult) { //, fields) {
    if (err) 
      {
        console.log("error: getCurrentProducts")
        throw err;
      }
    console.log("\n\x1b[36m            BAMAZON BEST SELLERS\x1b[0m        (enter q to exit)\n")
    
    inventoryQuantityberDisplayed = prodResult.length;

    var tbl = new Table
    var i = 0;
    
    prodResult.forEach(function(product) {
      tbl.cell('Product Id', product.id)
      tbl.cell('Description', product.product)
      tbl.cell('Price, USD', product.price, Table.number(2))
      tbl.cell('Avail',product.stock_quantity)
      tbl.newRow()
      inventory[i++]=product.id;
    })
   if (debug )
     console.log("inventory ids: "+inventory)

   // print table to console screen
   console.log(tbl.toString());
   console.log("\n\n\n\n\n\n\n")
    // Create a "Prompt" for input.
    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "  \x1b[36mPlease select enter product id you would like to buy: \x1b[0m", //cyan text
        name: "itemID",
        validate: function (value) {
        if (value == quitString || value == 'q')
         {
           console.log("\x1b[32m\n\n    See you next time!\x1b[0m"); //green text
           process.exit(0);
         }
        if (isNaN(value) === false && parseInt(value) > 0)
        {
          // verify the entered itemId is from the product table
          if (validItemId(value))
           return true;
          else
           return false;
        }
        else
         {
           console.log("\x1b[31m  Invalid input. Please try again\x1b[0m"); //red text
           return false;
         }
        }                 
    }
  ])
  .then(function(itemSelection) {
 
 //console.log("result "+prodResult[0].stock_quantity)
 
      itemId = itemSelection.itemID;
      
      if(itemId===quitString || itemId == 'q')
        {
          console.log("\x1b[32m\n\n    See you next time!\x1b[0m")
          process.exit(0)
        }
      else 
        getQuantity(connection,itemId);
  }); // end selection inquirer
   
  }); // function query1 err,result

} // end getCurrentProducts
