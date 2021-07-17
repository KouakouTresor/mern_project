const express = require("express");
const productRoute = express.Router();
const { Product } = require("../models/products");
const { Category } = require("../models/categories");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    if (!isValid) {
      throw Error("Extension image invalid");
    }
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    //const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

productRoute.get("/", async (req, res) => {
  const product = await Product.find().populate("category");
  if (!product) res.status(404).json("Pas d'utilisateurs");
  res.json(product);
});

productRoute.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) res.json("Produit bientot disponible");
  res.json(product);
});

productRoute.post("/", upload.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).send("Category inexitant");
  } else {
    const urlImage = "http://localhost:3000/public/uploads/";
    const imageName = req.file.filename;
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${urlImage}${imageName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    product = await product.save();
    if (!product) res.status(500).json("Rajout produit echoué");
    res.json(product);
  }

  //;
});

productRoute.put("/:id", (req, res) => {
  const category = new Category(req.body.category);
  if (!category) res.status(400).json("Category inexistant");

 let file = req.file
 let newFile
 if(file){
    const urlImage = "http://localhost:3000/public/uploads/";
    const imageName = req.file.filename;
    newFile = `${urlImage}${imageName}`
 } else {
    newFile = product.image
 }

  const product = new Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: newFile,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) res.status(404).send("Modification echouée");
  res.json(product);
});

productRoute.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json("Produit supprimer");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = productRoute;
