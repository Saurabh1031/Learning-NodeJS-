const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // if product already exists, then update/edit product
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const oldPrice = products[existingProductIndex].price;
        products[existingProductIndex] = this;
        //when we are editing the product, we should also update the cart for the same product
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (!err) {
            Cart.deleteProduct(this.id, oldPrice);
          }
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
  static deleteById(id) {
    getProductsFromFile((products) => {
      const Product = products.find((p) => p.id === id);
      let updatedProducts = [];
      updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, Product.price);
        }
      });
    });
  }
};
