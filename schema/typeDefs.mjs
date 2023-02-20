// import singleTypeDefs from ''

const typeDefs = `#graphql
  scalar Upload
  type File {
    url: [String]
  }
  enum Role {
  USER
  ADMIN
  }
  type PostwImg {
    id: ID
    title: String
    text: String
    images: [String]
  }

  type FileUploadResponse {
  ETag: String!
  Location: String!
  key: String!
  Key: String!
  Bucket: String
  }

  type Role {
    id: ID
    value: String
  }
  type User{
    id: ID
    fullname: String
    email: String
    roles: Role
  }
  type AuthPayload {
    user: User
    token: String
  }
  type Query {
    getAllPosts: [PostwImg]
    getPost(id: ID): PostwImg
    hello: String
  }

  type Image {
  id: ID!
  filename: String!
  url: String!
}

  input PostInput {
    title: String
    text: String
  }

  input LoginInput{
    email: String
    password: String!
  }

  input RegisterInput{
    fullname: String!
    email: String!
    password: String!
    confirm_password: String!
  }

  type Mutation {
    createPost(post: PostInput, file: [Upload]!): PostwImg
    fileUpload(file: Upload!): FileUploadResponse!
    uploadImage(file: Upload!): Image!
    deletePost(id: ID): String
    updatePost(id: ID,post: PostInput, file: [Upload]!): [PostwImg]!
    loginUser(id: ID, about: LoginInput): AuthPayload
    registerUser(id: ID, about: RegisterInput): AuthPayload
  }
`;

// export const uploadTypeDefs = `#graphql
//   extend type Query: {
//     greetings: String
//   }
//   extend type Mutation: {
//     singleUpload(file: Upload!): SuccessMessage
//   }
//   type SuccessMessage: {
//     message: String
//   }
// `

export default typeDefs