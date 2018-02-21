var mysql = require("mysql")
var inquirer = require("inquirer")

var pool = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "gross123",
  database: "bamazon"
});

/* 
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});*/

pool.getConnection( function(err,connection) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  poolConnection = connection;
  afterConnection(connection);
});

var inventory = {}
var inventoryNumberDisplayed = 0;
var choicesAvailable = []
var itemID = 0;
//var itemIDtmp = '';
var finalCost = 0;
var orderQuantity = 0;

function userChoices()
{
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{
   	choicesAvailable[j]=String(inventory[j].product)+" price:$"+String(inventory[j].price)+String(" id: "+inventory[j].id
   	+":"+inventory[j].stock_quantity)
   }
 
}
function updateQuantity(connection,item,quantity) {
  //console.log("update connected as id " + connection.threadId);
  
  var query2 = "UPDATE products SET stock_quantity=stock_quantity-"+quantity+" WHERE item_id="+item
  
  connection.query(query2, function(err,result) {
  	if (err) throw err;
  	//console.log(result.affectedRows + " record(s) updated");
  	if (result.affectedRows)
  	{
  	  console.log("Order processed successfully!")
  	  console.log("Total Cost: "+"$"+finalCost+" Hope to see you soon!")
  	}
  	process.exit(0)
    
  });
}

function afterConnection(connection) {
	var query1 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products"
    connection.query(query1, function(err, result) { //, fields) {
    if (err) throw err;
 
    console.log("  BAMAZON BEST SELLERS")
    inventory = result;
    inventoryNumberDisplayed = result.length;
    userChoices()
    // Create a "Prompt" with a series of questions.
    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
      //name: availableProducts,
        type: 'rawlist',
        message: "  Please enter number of product you would like to buy",
        name: "itemDesc",
        choices:  choicesAvailable

  // [ "1 Harry Potter And The Order Of The Phoenix 8.5",
  //   "2 Harry Potter And The Goblet Of Fire 9.5",
  //   "3 End of Watch: A Novel (The Bill Hodges Trilogy) 16.5"             ]
    },
    {
    message: "  How many would you like to buy?",
    type: "input",
    name: "quantityNum"
    
    }
  ])
  .then(function(inquirerResponse) {

      //console.log("\n"+inquirerResponse.itemDesc)
      //console.log(inquirerResponse) 
      var tmp = inquirerResponse.itemDesc.split(":")
      itemID = parseInt(tmp[tmp.length-2])
      var tmp2 = tmp[tmp.length-3].split(" ") 
      var Price = parseFloat(tmp2[0].replace('$',''))
      //console.log("selected item "+itemID);
      var inventoryNum = parseInt(tmp[tmp.length-1])
      //console.log(" inventory of "+inventoryNum)
      orderQuantity = parseInt(inquirerResponse.quantityNum);
      if ( inquirerResponse.quantityNum <= inventoryNum)
      {
      	console.log("YAY! Those are available!")
      	
      	finalCost = Price*orderQuantity;
      	
      	updateQuantity(connection,itemID,inquirerResponse.quantityNum)
      }
      else
	  {
      	console.log("Sorry. Please reduce your quantity.")
      	console.log("need new prompt here")
      	process.exit(0)
	  }
   });
   
  }); // function err,result

} // afterConnection
