import { User } from './user.entity';
import { UserRepository } from './user.repository';

export class UserService {
  async createUser(nickname: string): Promise<User> {
    const existingUser = await UserRepository.findOneBy({ nickname });
    if (existingUser) {
      throw { status: 409, message: 'El usuario ya existe' };
    }

    const user = UserRepository.create({ nickname });
    return await UserRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await UserRepository.find();
  }
}
