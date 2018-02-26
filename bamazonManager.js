/*  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product
*/
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
pool.getConnection( function(err,connection) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  poolConnection = connection;
  afterConnection(connection);
});
var choicesAvailable = [];
function userChoices()
{
	 choicesAvailable = [ "View Products for Sale",
                          "View Low Inventory",
                          "Add to Inventory",
                          "Add New Product" ]
  /*                        
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{
   	choicesAvailable[j]=String(inventory[j].product)+" price:$"+String(inventory[j].price)+String(" id: "+inventory[j].id
   	+":"+inventory[j].stock_quantity)
   }
   choicesAvailable[j]=quitString
  */
}
function afterConnection(connection) {

    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: 'list',
        message: "  Please select",
        name: "options",
        choices:  [ "View Products for Sale",
                          "View Low Inventory",
                          "Add to Inventory",
                          "Add New Product" ] // choicesAvailable
      }
      ])
    .then(function(Selection) {

       console.log(Selection.options)
     }); // end selection inquirer

} // end afterConnection

