const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //analyze the cart for exisiting product
      let existingProductIndex = cart.products.findIndex((p) => p.id === id);
      let existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //add new product/increment the quantity
      if (existingProduct) {
        //increase the qty
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice);
      //write it back to the file
      console.log("cart ", cart);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("error writing to cart.json: ", err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let cart = JSON.parse(fileContent);
      const product = cart.products.find((p) => p.id === id);
      if (!product) {
        return;
      }
      let updatedCart = { ...cart };
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * product.qty;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log("error writing to cart.json: ", err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
