import express from "express"

const PORT = process.env.PORT || 5000
const router = express()

router.listen(PORT, () =>
  console.log(`Listening on localhost ${PORT}`)
)

export default router
