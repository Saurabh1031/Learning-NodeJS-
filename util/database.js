const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (cb) => {
  mongoClient
    .connect(
      "mongodb+srv://saurabh253:ImK1pI8Q3Hx79YFH@cluster0.av6lz7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((client) => {
      _db = client.db();
      console.log("MongoDB Connected!");
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw "Error in connecting mongoDB!";
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
