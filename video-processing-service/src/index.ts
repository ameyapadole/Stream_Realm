import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";


setupDirectories(); 

const app = express();
app.use(express.json());

/**
 * Invoked by cloud pus/sub message. 
 * We get the bucket and filename from the cloud pub/sub message.
 */
app.post("/process-video", async (req, res)=>{
   let data; 
   try{
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse('message');
        if(!data.name){
            throw new Error('Invalid message payload recieved.');
        }
    }
   catch(error){
        console.log(error)
        return res.status(404).send("Bad Request: missing filename"); 
   }

   const inputFileName = data.name; 
   const outputFileName = `processed-${inputFileName}`;

   //Dowloading the raw video from Cloud storage 

   await downloadRawVideo(inputFileName); 

   try{
    await convertVideo(inputFileName, outputFileName);
   }
   catch(error){
        return res.status(500).send('internal Server Error: Video Processing Failed')
        console.log(error)
   }
   //Upload the processed video to Cloud Storage
   uploadProcessedVideo(outputFileName);

});

const port = process.env.PORT || 3000; 
//Standard process to start a port at runtime
app.listen(port, () => {
    console.log(`Video Processing Service Listening at http://localhost:${port}`);
})