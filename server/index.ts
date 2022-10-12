import express from "express"
const PORT = process.env.PORT || 5000

express()
  .get("/", (req, res) => res.send("SJS Squad"))
  .listen(PORT, () => console.log(`Listening on localhost${PORT}`))
