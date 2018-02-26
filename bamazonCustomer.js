var mysql = require("mysql")
var inquirer = require("inquirer")

var pool = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  port: 3306,

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

pool.getConnection( function(err,connection) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  poolConnection = connection;
  afterConnection(connection);
});
//console.log('\x1b[36m%s\x1b[0m','teststring')
//console.log("\x1b[32mtesting\x1b[0m")
var inventory = {}
var inventoryNumberDisplayed = 0;
var choicesAvailable = []
var itemID = 0;
//var itemIDtmp = '';
var finalCost = 0;
var orderQuantity = 0;
var quitString = "quit"

function userChoices()
{
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{
   	choicesAvailable[j]=String(inventory[j].product)+" price:$"+String(inventory[j].price)+String(" id: "+inventory[j].id
   	+":"+inventory[j].stock_quantity)
   }
   choicesAvailable[j]=quitString
 
}
function updateQuantity(connection,item,quantity) {
  //console.log("update connected as id " + connection.threadId);
  
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
        //type: 'rawlist',
        type: 'list',
        message: "  Please select product you would like to buy",
        name: "itemDesc",
        choices:  choicesAvailable

  // [ "1 Harry Potter And The Order Of The Phoenix 8.5",
  //   "2 Harry Potter And The Goblet Of Fire 9.5",
  //   "3 End of Watch: A Novel (The Bill Hodges Trilogy) 16.5"             ]
    }
 //   ,
 //   {
 //   message: "  How many would you like to buy?",
 //   type: "input",
 //   name: "quantityNum"   
 //   }
  ])
  .then(function(itemSelection) {
 
      if(itemSelection.itemDesc===quitString)
        {
          console.log("\x1b[32m\n  See you next time!\x1b[0m")
          process.exit(0)
        }
      else 
        {
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
          inquirer.prompt([
            {
              message: "  How many would you like to buy?",
              type: "input",
              name: "quantityNum",
              validate: function (value) {
                   if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
                   return true;
                   }
                  return false;
                }     
            }
            ])  
            .then(function(itemQuantity) {
              
           /*   if(isNaN(itemQuantity.quantityNum))
              {
                 console.log("not a number")
              }
              else
              {*/
              orderQuantity = parseInt(itemQuantity.quantityNum);
              if (itemQuantity.quantityNum <= inventoryNum)
              {
                 if (orderQuantity>1)
      	           console.log("\x1b[37m\n  YAY!  "+orderQuantity+" \x1b[36m"+itemTitle+"\x1b[0m are available!")    	
                 else
                   console.log("\x1b[37m\n  YAY!  \x1b[36m"+itemTitle+"\x1b[0m is available!")      
 
      	         finalCost = parseFloat(Price*orderQuantity);
      	         updateQuantity(connection, itemID, itemQuantity.quantityNum)
              }
              else
	             {
               	 console.log("\x1b[31m  Sorry. Please reduce your quantity.\x1b[0m")
              	 console.log("need new prompt here")
      	         process.exit(0)
	             }
            //  }
        
               
          }) // end quantity inquirer

        } //else  
     }); // end selection inquirer
   
  }); // function query1 err,result

} // end afterConnection
