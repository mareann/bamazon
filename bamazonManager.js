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
var inventoryNumberDisplayed = 0;
var choicesAvailable = [];
var itemsAvailable = [];
var optionsAvailable = [ "View Products for Sale",
                         "View Low Inventory",
                         "Add to Inventory",
                         "Add New Product",
                         quitString ]
var quitString = "quit"
function itemList()
{
   var tmp =0;
   var price='';
   console.log("invnum "+inventoryNumberDisplayed)                 
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{     
      tmp = parseFloat(inventory[j].price).toFixed(2);
      if ( tmp < 10.00)
      {
        price = '0'+String(tmp)
        //console.log(j+" price ",price)
      }
      else
      {
      	price = String(tmp);
      	//console.log(j+" price ",price)
      }
   	  itemsAvailable[j] = String(inventory[j].product)+" price:$"+price+String(" id: "+inventory[j].id
   	+":"+inventory[j].stock_quantity)
   }

}
function afterConnection(connection) {

    inquirer
    .prompt([
      // Here we create a basic text prompt.
      {
        type: 'list',
        message: "  Please select",
        name: "option",
        choices:       //choicesAvailable
                   [ "View Products for Sale",
                          "View Low Inventory",
                          "Add to Inventory",
                          "Add New Product",
                          quitString ] // choicesAvailable
      }
      ])
    .then(function(selection) {
       
       switch ( selection.option )
       {
       	case "View Products for Sale":
       		var query1 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products"
            connection.query(query1, function(err, result) { //, fields) {
            if (err) throw err;
            console.log("  BAMAZON Available Items")
    		inventory = result;
    		inventoryNumberDisplayed = result.length;
    		itemList();
    		console.log(itemsAvailable)
           })
       	  break;
       	case "View Low Inventory":
       	    var query2 = "SELECT item_id as id,product_name as product,price,stock_quantity FROM products "+
       	    "WHERE stock_quantity < 5"
            connection.query(query2, function(err, result) { //, fields) {
            if (err) throw err;
            console.log("  BAMAZON Low Inventory Items")
    		inventory = result;
    		inventoryNumberDisplayed = result.length;
    		itemList();
    		console.log(itemsAvailable)
           })
       	  break;
       	case "Add to Inventory" : 
       	  break;
       	case  "Add New Product" :
           console.log("  BAMAZON Add Items")
           inquirer.prompt([
             {
               name: "name",
               message: "Products Name: "
             }, 
             {
               name: "department",
               message: "Department Name: "
             }, 
             {
               name: "price",
               message: "Product Price: "
             }, 
             {
               name: "quantity",
               message: "Quantity: "
             }
            ]).then(function (prod) {
   
       	   var query4 = "INSERT INTO products (product_name,department_name,price,stock_quantity) "+
       	    "VALUES("+"'"+String(prod.name)+"','"+String(prod.department)+"',"+prod.price+","+prod.quantity+")"
       	    //console.log(query4)
            connection.query(query4, function(err, result) { //, fields) {
            if (err) throw err;
    		console.log(result)
    	   })
           })

       	  break;
       	case  quitString :
       	  process.exit(0);
       	default: 
          process.exit(0);
       	  break;
       }
 
     }); // end selection inquirer

} // end afterConnection
