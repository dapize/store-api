import { Router } from 'express';
import { validUserNickName } from './user.middleware';
import { createUser, getAllUsers } from './user.controller';

export const router = Router();

router.post('/', validUserNickName, createUser);
router.get('/', getAllUsers);
