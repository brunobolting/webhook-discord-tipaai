import app from '../api/index.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Express started on port ${PORT}`)
})
