const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});
userSchema.methods.addToCart = function (product) {
  const cartProductIndex =
    this.cart &&
    this.cart.items &&
    this.cart.items.findIndex(
      (p) => p.productId.toString() === product._id.toString()
    );
  let newQuantity = 1;
  let existingCartItems = [];
  if (this.cart) {
    existingCartItems = [...this.cart.items];
  }
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    existingCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    existingCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: existingCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.deleteFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter(
    (i) => i.productId.toString() !== prodId.toString()
  );
  updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");
// class User {
//   constructor(username, email, cart, id) {
//     (this.name = username),
//       (this.email = email),
//       (this.cart = cart),
//       (this._id = id);
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }
//   addToCart(product) {
//     const cartProductIndex =
//       this.cart &&
//       this.cart.items &&
//       this.cart.items.findIndex(
//         (p) => p.productId.toString() === product._id.toString()
//       );
//     let newQuantity = 1;
//     let existingCartItems = [];
//     if (this.cart) {
//       existingCartItems = [...this.cart.items];
//     }
//     //console.log("cartProductIndex ", cartProductIndex);
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       existingCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       existingCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: existingCartItems,
//     };
//     //console.log("updatedCart ", updatedCart);
//     console.log(new mongodb.ObjectId(this._id));
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIDs = this.cart.items.map((i) => i.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIDs } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }
// deleteFromCart(prodId) {
//   const updatedCartItems = this.cart.items.filter(
//     (i) => i.productId.toString() !== prodId.toString()
//   );
//   const db = getDb();
//   //console.log(updatedCartItems);
//   return db
//     .collection("users")
//     .updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     );
// }
//   addOrder() {
//     const db = getDb();
//     //get products from cart
//     return this.getCart().then((products) => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name,
//         },
//       };
//       //make new collection "orders"
//       //insert products + users details in "orders"
//       return db
//         .collection("orders")
//         .insertOne(order)
//         .then((result) => {
//           //clear the cart from here + in db also
//           this.cart.items = [];
//           return db
//             .collection("users")
//             .updateOne(
//               { _id: new mongodb.ObjectId(this._id) },
//               { $set: { cart: { items: [] } } }
//             );
//         })
//         .then(() => {
//           console.log("cart cleared!");
//         })
//         .catch((err) => console.log(err));
//     });
//   }
//   getOrder() {
//     const db = getDb();
//     //fetch doc from orders collection for that user
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((err) => console.log(err));
//   }
//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find({ _id: new mongodb.ObjectId(userId) })
//       .next();
//   }
// }
// module.exports = User;
