import express from 'express'
import morgan from "morgan"
import dotenv from 'dotenv'

const app = express()
app.use(morgan('dev'))

app.get('/api/health',(req,res)=>{
    res.status(200).json({
        message : 'hello there'
    })
})

app.get('/api/user',(req,res)=>{
    const user =  [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
        { id: 4, name: "David" },
    ];

    res.status(200).json(user)
})

app.get('/',(req,res)=>{
    res.status(200).json({
        message : 'happy'
    })
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})