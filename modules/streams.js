// @/src/modules/streams.js
// import stream from "stream";

// import { bucket, s3 } from "./bucket.js";

// export const createUploadStream = (key) => {
//   const pass = new stream.PassThrough();
//   return {
//     writeStream: pass,
//     promise: s3.upload({
//         Bucket: bucket,
//         Key: key,
//         Body: pass,
//       }).promise(),
//   };
// };
import { bucket, s3 } from "./bucket.js";
import stream from "stream";
import { Upload } from "@aws-sdk/lib-storage";
export const createUploadStream = (key) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: new Upload({
        client: s3,
        params: {
          Bucket: bucket,
          Key: key,
          Body: pass,
        }
      }),
  };
};