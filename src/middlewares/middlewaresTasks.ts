import { Request, Response, NextFunction } from 'express';

export const MiddlewareCreatedTask = (req: Request, res: Response, next: NextFunction) => {
	const { title, description, userId } = req.body;
    
	if(title === '' || title === undefined){
		return res.status(400).json({error: 'Título não pode ser vazio'});
	}
	if(description === '' || description === undefined){
		return res.status(400).json({error: 'Descrição não pode ser vazio'});
	}
	if(userId === '' || userId === undefined){
		return res.status(400).json({error: 'Usuário não identificado!'});
	}
	next();
};