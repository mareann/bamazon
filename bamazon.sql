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
VALUES ("12 Rules for Life An Antidote to Chaos      ", "Books",13.50,10),
       ("Harry Potter And The Goblet Of Fire         ", "Books",9.50, 115),
       ("End of Watch A Novel                        ", "Books",16.50, 3),
       ("Justice League with Henry Cavill, Amy Adams ","MOVIES",24.95,120),
       ("Wonder with Julia Roberts                   ","MOVIES",18.95,125),
       ("The Greatest Showman                        ","MOVIES",19.95,118),
       ("DCU Batman Gotham By Gaslight               ","MOVIES",16.95,48),
       ("By The Way, I Forgive You Brandi Carlile    ","Music",10.75,77),
       ("Man of the Woods Justin Timberlake          ","Music",9.95,43),
       ("Rumours Fleetwood Mac                       ","Music",20.95,26)
-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
