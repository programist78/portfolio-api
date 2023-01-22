import pick from 'lodash';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const issueAuthToken = (id, email, res, req) => {
    let token =  jwt.sign({
        id,
        email
        }, 
        process.env.SECRET_KEY, {
        expiresIn: '30m'
        }
    );
    return `Bearer ${token}`;
};

export const serializeUser = user => pick(user, [
    'id',
    'email',
    'fullname'
]);