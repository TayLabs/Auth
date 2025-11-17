import express from 'express';

// /auth/*
const loginRouter = express.Router();

loginRouter.post('/login', () => {});

export { loginRouter };
