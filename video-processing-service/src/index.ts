import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res)=>{
    //Get path of the input video file that we want to convert. 
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath; 

    if (!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing file path");
}
    
});

const port = process.env.PORT || 3000; 
//Standard process to start a port at runtime
app.listen(port, () => {
    console.log(`Video Processing Service Listening at http://localhost:${port}`);
})