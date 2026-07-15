import express from 'express'
import morgan from "morgan"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";
// ES Modules do not provide __filename and __dirname like CommonJS.
// We recreate them using import.meta.url so we can work with file paths
// (e.g., sendFile(), reading files, serving static assets).

const __filename = fileURLToPath(import.meta.url);
// Get the directory of the current file.
// Equivalent to CommonJS's built-in __dirname.
const __dirname = path.dirname(__filename);

const app = express()
app.use(morgan('dev'))

//"If someone requests a file that exists inside the public folder, send it directly."
//Serves static assets (CSS, JS, images, fonts, etc.) from the public folder.
app.use(express.static('public'))

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get('/api/user',(req,res)=>{
    const user =  [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
        { id: 4, name: "David" },
    ];

    res.status(200).json(user)
})

app.get('/check',(req,res)=>{
    res.status(200).json({
        message : 'happy'
    })
})

//👉 For any route that isn't a static file or API route, send index.html so the frontend router (React Router, Vue Router, etc.) can handle the URL.
app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})