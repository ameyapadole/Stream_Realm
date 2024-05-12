// GCS and Local file interactions handle karega

import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "stream-realm-raw-videos";
const processedVideoBucketName = "stream-realm-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


/**
 * Creates the local directories for raw and processed video files.
 */

export function setupDirectories(){

}
/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted. 
 */

export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions(["-vf scale=-1:360"]) //Converting to 360P
        .on("end", () =>{
             console.log("Video Processing Sucessful.")
             resolve();
        })
        .on("error", (err) => {
            console.log(`Error Occured:${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);

})

}

/**
 * @param filename - The name of the file to upload from the
 * {@link rawVideoBucketName} folder into the {@link localRawVideoPath}
 * @returns A promise that resolves when the file has been Downloaded 
*/
export async function downloadRawVideo(filename : string){
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({destination : `${localRawVideoPath}/${filename}`});
    
    console.log(
        `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}.`
    )
}


/**
 * @param filename - The name of the file to upload from the
 * {@link uploadProcessedVideo} folder into the {@link processedVideoBucketName}
 * @returns A promise that resolves when the file has been Uploaded 
*/
export async function uploadProcessedVideo(filename: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    
    await bucket.upload(`${localProcessedVideoPath}/${filename}`,{
            destination: filename
        });

    console.log(
            `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}.`
        )

    await bucket.file(filename).makePublic(); 
    }

    
/**
 * 
 * @param filePath - The path of the file to be deleted
 * @returns - A Promise that resolves when the file has been deleted
 *
 */
function deleteFile(filePath: string): Promise<void> {
        
    return new Promise((resolve, reject)=> {

        });
    }