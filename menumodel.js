const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/tododb");
const listSchema = mongoose.Schema({
  name: String,
  list: [Todotable],
});
const ListTable = new mongoose.model("List", listSchema);

exports.saveList = function saveList(menu) {
  let saveList = new ListTable(menu);
  saveList.save().then(() => {
    console.log("menu save successfully!");
  });
};
exports.ListTable = ListTable;
