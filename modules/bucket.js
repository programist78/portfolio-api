// import { S3 } from "@aws-sdk/client-s3";

// export const bucket = "portfolio-webxwizard";

// export const s3 = new S3({
//   endpoint: "http://localhost:4000",
//   accessKeyId: "AKIAQAK2Y3V6NHB7TV5F",
//   secretAccessKey: "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",
//   sslEnabled: false,
//   s3ForcePathStyle: true,
// });
// region: "eu-central-1",
import { S3Client } from "@aws-sdk/client-s3";

export const bucket = process.env.BUCKET_NAME;

export const s3 = new S3Client({
  // endpoint: "http://localhost:4000/graphql",
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  },
  
  // forcePathStyle: true,
  // sslEnabled: false,
});