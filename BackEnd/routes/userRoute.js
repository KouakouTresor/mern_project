const express = require("express");
const userRoute = express.Router();
const { User } = require("../models/user");

userRoute.get("/", async (req, res) => {
  const user = await User.find();
  if (!user) res.status(404).json("Pas d'utilisateurs");
  res.json(user);
});

userRoute.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).json("Pas d'utilisateurs");
  res.json(user);
});

userRoute.post("/", (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    street: req.body.street,
    apartement: req.body.apartement,
    city: req.body.city,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = user
    .save()
    .then(() => {
      res.status(500).json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

userRoute.put("/:id", async (req, res) => {
  const user =  await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      street: req.body.street,
      apartement: req.body.apartement,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );
  if(!user)res.status(404).json("Mis à jour echouée")
  res.json(user)
});


userRoute.delete("/:id", async(req,res)=>{
  const user = await User.findByIdAndRemove(req.params.id)
  if(!user)res.status(404).json("Suppression utilisateur echouée")
  res.json({Message: "utilisateur sipprimer!"})
})

module.exports = userRoute;
