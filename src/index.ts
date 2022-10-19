import express, { Response, Request } from "express"

const PORT = process.env.PORT || 5000

const app = express()
app.get('/', (req: Request, res: Response) => {
    res.send('Helo World')
})

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})