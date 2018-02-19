var mysql = require("mysql")
var inquirer = require("inquirer")


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "gross123",
  database: "bamazon"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

var inventory = {}
var inventoryNumberDisplayed = 0;
var choicesAvailable = []
function userChoices()
{
   for (var j=0;j<inventoryNumberDisplayed;j++)
	{
   	choicesAvailable[j]=String(inventory[j].product)+" "+"$"+String(inventory[j].price)//+" "inventory[j].product.toString()
   	//+" "+inventory[j].price.toString
   }
  // return(choicesAvailable)
}

function afterConnection() {
  connection.query("SELECT item_id as id,product_name as product,price FROM products", 
  	function(err, result) { //, fields) {
    if (err) throw err;
   // console.log(result);
    console.log("  BAMAZON BEST SELLERS")
    inventory = result;
    inventoryNumberDisplayed = result.length;

    for (var i=0;i<result.length;i++)
    {
      
      console.log("  "+result[i].id+" "+result[i].product+" "+result[i].price);
    }
    userChoices()
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      //name: availableProducts,
      //type: "input",
      type: 'rawlist',
      message: "  Please enter ID of product you would like to buy",
      name: "itemID",
      choices: choicesAvailable
  //            [ "1 Harry Potter And The Order Of The Phoenix 8.5",
  //"2 Harry Potter And The Goblet Of Fire 9.5",
  //"3 End of Watch: A Novel (The Bill Hodges Trilogy) 16.5"             ]
      //userChoices()   //["one","two"]
      //validate: validateName
    },
    {
    message: "  How many would you like to buy?",
    type: "input",
    name: "quantityID",
    //validate: validateName
    }
  ])
  .then(function(inquirerResponse) {

      console.log("\n"+inquirerResponse.itemID+" "+inquirerResponse.quantityID);
      //console.log(inventory[inquirerResponse.itemID-1].id)  
   });

    connection.end();
  }); // function err,result
} // afterConnection
/*
function fixRes(res) {
	var newRes = ""
	var resRowCt = res.length
	for (var i=0;i<res.length;i++)
	{
		console.log("res[+"+i+"len "+res[i].length)
        //for (var j=0;j<res[i].length;j++)
        //  {
          	//take out [{,}]
          	res[i] = res[i].replace('[','')
          	res[i] = res[i].replace(']','')
          	res[i] = res[i].replace('{','')
          	res[i] = res[i].replace('}','')
          	console.log("i "+i+" "+res[i])
         // }

	}
} // end fixRes
*/
/*
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "Please enter ID of product you would like to buy",
      name: "itemID",
      //validate: validateName
    },
    {
    message: "How many would you like to buy?",
    type: "input",
    name: "quantityID",
    //validate: validateName
    },
    // Here we create a basic password-protected text prompt.
   // {
   //   type: "password",
   //   message: "Set your password",
   //   name: "password"
   // },
   // {
   //   type: "confirm",
   //   message: "Are you sure:",
   //   name: "confirm",
   //   default: true
   // },
    // Here we give the user a list to choose from.
   // {
   //   type: "rawlist",
   //   message: "Which do you prefer?",
   //   choices: ["Mr", "Mrs", "Ms"],
   //   name: "hithere"
    }
    //,
    // Here we ask the user to confirm.
   // {
   //   type: "confirm",
   //   message: "You prefer that?",
   //   name: "confirm",
   //   default: true
   // }
  ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      console.log("\nWelcome " + inquirerResponse.hithere+" "+inquirerResponse.username);
      //console.log("Your " + inquirerResponse.pokemon + " is ready for battle!\n");
    }
    else {
      console.log("\nThat's okay " + inquirerResponse.username + ", come again when you are more sure.\n");
    }
  });*/