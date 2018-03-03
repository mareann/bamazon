DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(15),
  price DECIMAL(10,2) NULL,
  stock_quantity INTEGER NULL,
  PRIMARY KEY (item_id)
);
ALTER TABLE products AUTO_INCREMENT = 100;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BOOK:    12 Rules for Life An Antidote to Chaos      ", "Books",13.50,10),
       ("BOOK:    Harry Potter And The Goblet Of Fire         ", "Books",9.50, 115),
       ("BOOK:    End of Watch A Novel                        ", "Books",16.50, 3),
       ("Blu-ray: Justice League with Henry Cavill, Amy Adams ","MOVIES",24.95,120),
       ("Blu-ray: Wonder with Julia Roberts                   ","MOVIES",18.95,125),
       ("Blu-ray: The Greatest Showman                        ","MOVIES",19.95,118),
       ("CD:      DCU Batman Gotham By Gaslight               ","MOVIES",16.95,48),
       ("CD:      By The Way, I Forgive You Brandi Carlile    ","Music",10.75,77),
       ("CD:      Man of the Woods Justin Timberlake          ","Music",9.95,43),
       ("CD:      Rumours Fleetwood Mac                       ","Music",20.95,6);