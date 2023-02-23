import User from '../models/User.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileRenamer } from "../helpers/FileRenamer.js";
import { issueAuthToken, serializeUser } from "../helpers/index.js";
import path from "path";
import fs from  'fs'
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import PostwImg from "../models/PostwImg.js";
import ImageUpload from "../models/ImageUpload.js";
import { createUploadStream } from '../modules/streams.js';
import AWS from 'aws-sdk'
const __dirname = path.resolve();
dotenv.config()
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  });

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        getAllPosts: async () => {
            const sortQuery = { createdAt: -1 };
            return await PostwImg.find().sort(sortQuery)
        },
        getPost: async(_parent, {id}, _context, _info) => {
            return await PostwImg.findById(id)
        },
        hello: () => {
            return "Hello world!"
        },
    },
    Mutation: {
        deletePost: async (parent, args, context, info) => {
            const { id } = args
            await PostwImg.findByIdAndDelete(id)
            return "Post deleted"
        },
        updatePost: async (parent,{ file, post, id }) => {
            let url = [];
            for (let i = 0; i < file.length; i++) {
            const { createReadStream, filename, mimetype } = await file[i];
            const stream = createReadStream();
            const assetUniqName = fileRenamer(filename);
            const pathName = path.join(__dirname,   `./uploads/${assetUniqName}`);
            await stream.pipe(fs.createWriteStream(pathName));
            const urlForArray = `http://localhost:4000/${assetUniqName}`;
            url.push({ url: urlForArray });
            }
            const title = post.title
            const text = post.text
            const postwimg = await PostwImg.findByIdAndUpdate(
                id,
                {title, text, images},
                { new: true }
            );
            return postwimg
        },
        createPost: async (parent,{ file, post }) => {
            let images = [];
            for (let i = 0; i < file.length; i++) {
            const { createReadStream, filename, mimetype, encoding } = await file[i];
            // const parts = filename.split('.');
            // const extension = parts[parts.length - 1];
            // const stream = createReadStream();
            const assetUniqName = fileRenamer(filename);
            const bucketName = process.env.BUCKET_NAME;
            const params = {
                Bucket: bucketName,
                Key: assetUniqName,
                Body: createReadStream(),
                // ACL: 'public-read',
                ContentType: mimetype,
              };
              
              const uploadResult = await s3.upload(params).promise();
            // const pathName = path.join(__dirname,   `./uploads/${assetUniqName}.${extension}`);
            // await stream.pipe(fs.createWriteStream(pathName));
            // const urlForArray = `${process.env.HOST}/${assetUniqName}.${extension}`;
            images.push(uploadResult.Location);
            }
            const title = post.title
            const text = post.text
            const postwimg = new PostwImg({ title, text, images })
            await postwimg.save()
            return postwimg;
        },
        fileUpload: async (parent, { file }) => {
            const { filename, createReadStream } = await file;

            const stream = createReadStream();
      
            let result;
      
            try {
              const uploadStream = createUploadStream(filename);
              stream.pipe(uploadStream.writeStream);
              result = await uploadStream.promise;
            } catch (error) {
              console.log(
                `[Error]: Message: ${error.message}, Stack: ${error.stack}`
              );
              throw new ApolloError("Error uploading file");
            }
            // console.log(result)
            return result;
          },
          uploadImage: async (parent, { file }) => {
            const { createReadStream, filename, mimetype, encoding } = await file;

            const bucketName = process.env.BUCKET_NAME;
            const assetUniqName = fileRenamer(filename);
            const params = {
                Bucket: bucketName,
                Key: assetUniqName,
                Body: createReadStream(),
                // ACL: 'public-read',
                ContentType: mimetype,
              };
        
              const uploadResult = await s3.upload(params).promise();
        
            //   const imageObj = {
            //     _id: ObjectId(),
            //     filename,
            //     url: uploadResult.Location,
            //   };
        
            //   await db.collection('images').insertOne(imageObj);
              const imagedb = new ImageUpload({ filename, url:uploadResult.Location  })
              let result = imagedb.save() 
              return result;
          },
        registerUser: async(parent, args, context, info) => {
            try {
                const { fullname, email, password, roles } = args.about
            const {id} = args
            const already_exsist = await User.findOne({ email });
            if (already_exsist) {
            throw new ValidationError("Email already exists");
            }
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            const user = new User({ fullname, email, passwordHash, roles:"ADMIN" })
            let result = await user.save()
            result = await serializeUser(result);
            const token = await issueAuthToken({id, email});

            return {token, user}
            } catch (err) {
                throw (err.message);
            } 

        },
        loginUser: async (_, args, context, info) => {
            const { email, password, roles, id } = args.about
            const user = await User.findOne(
            {email}
            );
            if (!user) {
                throw new ValidationError("Invalid email given");
            }
            const isValidPass = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPass) {
                throw new ValidationError("Invalid password given!");
            }
            let result = await user.save()
            result = await serializeUser(result);
            const token = await issueAuthToken({id, email});
            return {user, token}
        },
    }
}

export default resolvers