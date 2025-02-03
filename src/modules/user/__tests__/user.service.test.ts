import { describe, expect, it } from 'vitest';
import { UserService } from '../user.service';

describe('User Service', () => {
  const userService = new UserService();

  it('Should create a user when a valid nickname is provided', async () => {
    const user = await userService.createUser('testUser');
    expect(user).toHaveProperty('id');
    expect(user.nickname).toBe('testUser');
  });

  it('Should return all users when requested', async () => {
    await userService.createUser('user1');
    await userService.createUser('user2');

    const users = await userService.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(2);
  });
});
