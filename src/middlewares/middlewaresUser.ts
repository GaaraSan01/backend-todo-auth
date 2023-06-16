import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DecodedToken } from '../types/userTypes';

dotenv.config();

export const MiddlewareCretedUser = (req: Request, res: Response, next: NextFunction) => {
	const {name, email, password} = req.body;

	if(name === ''|| name === undefined){
		return res.status(401).json({MessageError: 'O campo nome está vazio!'});
	}
	if(email === '' || email === undefined){
		return res.status(401).json({MessageError: 'O campo email está vazio!'});
	}
	if(password === '' || password === undefined){
		return res.status(401).json({MessageError: 'O campo senha está vazio!'});
	}
	next();
};

export const MiddlewareLoginUser = (req: Request, res: Response, next: NextFunction) => {
	const {email, password} = req.body;

	if(email === '' || email === undefined){
		return res.status(400).json({MessageError: 'O campo "email" está vazio'});
	}
	if(password === '' || password === undefined){
		return res.status(400).json({MessageError: 'O campo "senha" está vazio'});
	}
	next();
};


export const MiddlewareVerifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1];

	if(!token){
		return res.status(401).json({MessageError: 'Token não encontrado'});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		const { id } = decoded as DecodedToken;
		req.body.userId = id;

		next();
	} catch (error) {
		return res.status(401).json({MessageError: 'Token inválido'});
	}
};