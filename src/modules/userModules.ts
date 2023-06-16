import { Request, Response } from 'express';
import { string, z } from 'zod';
import { PrismaClient, Users } from '@prisma/client';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PClient = new PrismaClient();

export const createUser = async(req: Request, res: Response)=> {
	const userSchema = z.object({
		name: z.string().min(2).max(55),
		email: z.string().email(),
		password: z.string().min(6).max(50)
	});

	const {name, email, password} = userSchema.parse(req.body);

	const verifyUser = await PClient.users.findUnique({
		where: {
			email: email
		}
	});

	if(verifyUser) {
		return res.status(400).json({error: 'Este email já existe'});
	}

	const handleSalt = 8;
	const incryptPassword = bycrypt.hashSync(password, handleSalt);

	await PClient.users.create({
		data:{
			name: name,
			email: email,
			password: incryptPassword
		}
	});

	return res.status(200).json({Message:'Usuário criado com sucesso!'});
};

export const getUsers = async (_req: Request, res: Response) => {
	const users: Users[] = await PClient.users.findMany();
	return res.status(200).json(users);
};

export const loginUser = async (req: Request, res: Response) => {
	const autenticateUserSchima = z.object({
		email: string().email(),
		password: string().min(6).max(20)
	});

	const {email, password} = autenticateUserSchima.parse(req.body);

	const user = await PClient.users.findUnique({
		where: {
			email
		}
	});

	if(!user){
		return res.status(401).json({MessageError: 'Usuário não encontrado'});
	}

	const verifyPassword = user?.password && await bycrypt.compare(password, user.password);

	if(!verifyPassword){
		return res.status(401).json({MessageError: 'Senha incorreta!'});
	}

	const token = jwt.sign({
		id: user?.id,
		name: user?.name,
		email: user?.email
	}, process.env.JWT_SECRET || 'secret', {expiresIn: '2h'});

	res.status(200).json({Message: 'Autenticado com sucesso!', token});
};