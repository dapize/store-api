import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '@app';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

describe('User Routes', () => {
  it('Should create a user when a valid request is sent', async () => {
    const response = await request(app).post('/users').send({ nickname: 'testUser' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.nickname).toBe('testUser');
  });

  it('Should return all users when requested', async () => {
    await UserRepository.save(UserRepository.create({ nickname: 'user1' }));
    await UserRepository.save(UserRepository.create({ nickname: 'user2' }));

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('Should return 400 when trying to create a user with an invalid nickname', async () => {
    const response = await request(app).post('/users').send({ nickname: 'ab' });

    expect(response.status).toBe(400);
  });

  it('Should return 409 when trying to create a duplicate user', async () => {
    await UserRepository.save(UserRepository.create({ nickname: 'duplicateUser' }));

    const response = await request(app).post('/users').send({
      nickname: 'duplicateUser'
    });

    expect(response.status).toBe(409);
  });

  it('Should return 409 when createUser receives an existing user error', async () => {
    vi.spyOn(UserService.prototype, 'createUser').mockRejectedValue({
      status: 409,
      message: 'El usuario ya existe'
    });

    const response = await request(app).post('/users').send({ nickname: 'duplicateUser' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('El usuario ya existe');
  });

  it('Should return 500 if getAllUsers fails', async () => {
    vi.spyOn(UserService.prototype, 'getAllUsers').mockRejectedValue(new Error('DB fail'));

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error obteniendo los usuarios');
  });

  it('Should return 500 if createUser throws a non-409 error', async () => {
    vi.spyOn(UserService.prototype, 'createUser').mockRejectedValue({
      status: 500,
      message: 'DB error'
    });

    const response = await request(app).post('/users').send({ nickname: 'BrokenUser' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error creando el nuevo usuario');
  });
});
