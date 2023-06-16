import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const PClient = new PrismaClient();

export const createdTask = async (req: Request, res: Response) => {
	const taskSchema = z.object({
		title: z.string().min(2).max(55),
		description: z.string().min(2).max(255),
		userId: z.number()
	});

	const { title, description, userId } = taskSchema.parse(req.body);

	try {
		await PClient.task.create({
			data: {
				title: title,
				description: description,
				userId: userId
			}
		});
		
		return res.status(200).json({Message:'Tarefa criada com sucesso!'});

	} catch (error) {
		return res.status(500).json({error: 'Erro ao criar tarefa'});
	}
};

export const getTasks = async (req: Request, res: Response) => {
	const { userId } = req.body;

	try {
		const tasks = await PClient.task.findMany({
			where: {
				userId: userId
			}
		});

		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json({error: 'Erro ao buscar tarefas'});
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await PClient.task.delete({
			where: {
				id: Number(id)
			}
		});
		return res.status(200).json({Message: 'Tarefa deletada com sucesso!'});
	} catch (error) {
		return res.status(500).json({error: 'Erro ao deletar tarefa'});
	}
};

export const updateTask = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, description, status } = req.body;

	try {
		await PClient.task.update({
			where: {
				id: Number(id)
			},
			data: {
				title: title,
				description: description,
				status: status
			}
		});
		return res.status(200).json({Message: 'Tarefa atualizada com sucesso!'});
	} catch (error) {
		return res.status(500).json({error: 'Erro ao atualizar tarefa'});
	}
};