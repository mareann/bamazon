# bamazon
Amazon-like storefront 

Amazon-like storefront using node, and MySQL. The app will take in orders from customers and deplete stock from the store's inventory.
It uses inquirer, mysql, and easy-table npm packages.

To start bamazonCustomer.js app:

Type:
node bamazonCustomer

After the app starts, it asks for the product id of the item the user would like to purchase. After any invalid input a red error message will be shown and the user is prompted to reenter the product id.


            BAMAZON BEST SELLERS        (enter q to exit)

- Product Id  Description                                            Price, USD  Avail
- ----------  -----------------------------------------------------  ----------  -----
- 100         BOOK:    12 Rules for Life An Antidote to Chaos             13.50  3
- 101         BOOK:    Harry Potter And The Goblet Of Fire                 9.50  6
- 102         BOOK:    End of Watch A Novel                               16.50  1
- 103         Blu-ray: Justice League with Henry Cavill, Amy Adams        24.95  84
- 104         Blu-ray: Wonder with Julia Roberts                          18.95  84
- 105         Blu-ray: The Greatest Showman                               19.95  76
- 106         CD:      DCU Batman Gotham By Gaslight                      16.95  42
- 107         CD:      By The Way, I Forgive You Brandi Carlile           10.75  63
- 108         CD:      Man of the Woods Justin Timberlake                  9.95  40
- 109         CD:      Rumours Fleetwood Mac                              20.95  3

?   Please select enter product id you would like to buy: 
?   Please select enter product id you would like to buy:    Invalid input. Please try again
?   Please select enter product id you would like to buy:  0  Invalid input. Please try again
?   Please select enter product id you would like to buy:  111  Invalid id. Please try again
?   Please select enter product id you would like to buy:  105


