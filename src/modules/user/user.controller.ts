import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

interface IServiceError {
  status: number;
  message: string;
}

export const createUser = async (request: Request, response: Response) => {
  try {
    const { nickname } = request.body as { nickname: string };
    const user = await userService.createUser(nickname);
    response.status(200).json({ data: user });
  } catch (error) {
    if ((error as IServiceError).status === 409) {
      response.status(409).json({ message: (error as IServiceError).message });
      return;
    }

    response.status(500).json({ message: 'Error creando el nuevo usuario' });
  }
};

export const getAllUsers = async (_: Request, response: Response) => {
  try {
    const user = await userService.getAllUsers();
    response.status(200).json({ data: user });
  } catch (error) {
    response.status(500).json({
      message: 'Error obteniendo los usuarios',
      error: error instanceof Error ? error.message : error
    });
  }
};
