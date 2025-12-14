import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// CONFIGURATION 
// yeh configuration express ki hai jaha hum json data ki limit set kar rahe hai
app.use(express.json({limit: "16kb"}))
// yeh configuration express ki hai jaha hum url ko encode karnege
app.use(express.urlencoded({extended: true, limit:"16kb"}))
// yeh configuration express ki hai jaha hum ye describe karenge ki jo bhi chize store karni hai use di gayi folder/location se 
app.use(express.static("public"))

// COOKIE PARSER
// Serever se user ke browser me cookie ko access kar saku aur CRUD operation kar saku
// Secure Cookie hota hai jo kewal server hi read kare aur use kar sake
app.use(cookieParser())


export { app }