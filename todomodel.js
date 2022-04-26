const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/tododb");

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
function todoScehma() {
  const Todotable = mongoose.model("todotab", todoSchema);
  return Todotable;
}
var Todotable = todoScehma();

exports.saveTodo = function saveTodo(insname) {
  const todo = new Todotable({
    name: insname,
  });
  todo.save().then(() => console.log("data saved succefully!"));
};

exports.fetchTodo = function fetchTodo(searchObj) {
  var result = Todotable.find(searchObj);
  return result;
};

exports.deleteTodo = function deleteTodo(items) {
  Todotable.deleteMany({ _id: { $in: items } }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted successfully!");
    }
  });
};

const listSchema = mongoose.Schema({
  name: String,
  list: [todoSchema],
});

const ListTable = new mongoose.model("List", listSchema);

exports.saveList = function saveList(menu) {
  let saveList = new ListTable(menu);
  saveList.save().then(() => {
    console.log("menu save successfully!");
  });
};

exports.Todotable = function () {
  return Todotable;
};

exports.ListTable = function ListTable() {
  return ListTable;
};
