const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const { append, redirect } = require("express/lib/response");
const { query } = require("express");
const mongoose = require("mongoose");
const _ = require("loadsh");
mongoose.connect(
  "mongodb+srv://abdul:Oracle123@cluster0.d3eoq.mongodb.net/tododb"
);

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

saveTodo = function saveTodo(insname) {
  const todo = new Todotable({
    name: insname,
  });
  todo.save().then(() => console.log("data saved succefully!"));
};

fetchTodo = function fetchTodo(searchObj) {
  var result = Todotable.find(searchObj);
  return result;
};

deleteTodo = function deleteTodo(items) {
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
  items: [todoSchema],
});

const ListTable = new mongoose.model("List", listSchema);

saveList = function saveList(menu) {
  let saveList = new ListTable(menu);
  saveList.save().then(() => {
    console.log("menu save successfully!");
  });
};

const app = express();
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(3000, function () {
  console.log("server port in 3000");
});

app.get("/", function (req, res) {
  var query = fetchTodo({});
  query.exec(function (err, result) {
    if (err) return console.log(err);
    res.render("todolist.ejs", { getData: result, title: "Today's Todo" });
  });
});

app.get("/:customParam", function (req, res) {
  const param = _.capitalize(req.params.customParam);
  item1 = new Todotable({
    name: "hi",
  });
  item2 = new Todotable({
    name: "Thankyou",
  });
  item3 = new Todotable({
    name: "welcome",
  });
  let itemsList = [item1, item2, item3];
  ListTable.findOne({ name: param }, function (err, response) {
    if (!err) {
      if (!response) {
        saveList({ name: param, items: itemsList });
        res.redirect("/" + param);
      } else {
        res.render("todolist", {
          getData: response.items,
          title: param,
        });
      }
    } else {
      redirect("/");
    }
  });
});

app.post("/", function (req, res) {
  const param = _.capitalize(req.body.addtodo);
  const insname = req.body.cinpdata;
  if (param == "Today's todo") {
    saveTodo(insname);
    res.redirect("/");
  } else {
    item1 = new Todotable({
      name: insname,
    });
    ListTable.findOne({ name: param }, function (err, response) {
      response.items.push(item1);
      response.save();
      res.redirect("/" + param);
    });
  }
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  getItems = req.body.items;
  param = req.body.delitemtitle;
  if (_.capitalize(param) == "Today's todo") {
    deleteTodo(getItems);
    res.redirect("/");
  } else {
    ListTable.findOneAndUpdate(
      { name: param },
      { $pull: { items: { _id: getItems } } },
      function (err, response) {
        if (!err) {
          res.redirect("/" + param);
        }
      }
    );
  }
});
