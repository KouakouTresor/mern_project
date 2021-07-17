const express = require("express");
const categoryRoute = express.Router();
const { Category } = require("../models/categories");

categoryRoute.get("/", async (req, res) => {
  const category = await Category.find();
  if (!category) res.status(404).json("Pas de category");
  res.json(category);
});

categoryRoute.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) res.status(404).json("Pas de category");
  res.json(category);
});

categoryRoute.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });
  category = await category.save()
  if (!category) res.status(404).send("Creation de la category echouée");
  res.json(category);
});


categoryRoute.delete("/:id", (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(()=>{
        res.status(200).send("Category supprimer")
    }).catch((err)=>{
        console.log(err)
    })
})

module.exports = categoryRoute;
