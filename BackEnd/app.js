console.log("hello world")

app.use(express.json())
app.use(morgan("tiny"));
app.use(`${api}/products`, productRoute);
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/users`, userRoute);


mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "tresorEshop"})
  .then(() => console.log("connection to DB"))
  .catch((err) => {
    console.log(err);
  }); 

app.get("/", (req, res) => {
  res.json("hello world");
});

app.listen(3000, () => {
  console.log("Hello world");
});
