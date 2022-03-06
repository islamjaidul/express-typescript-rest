import 'reflect-metadata';
import { container } from "tsyringe";
import { Application, Request, Response } from "express";
import UserController from "@app/user/http/user.controller";
import AuthMiddleware from "@app/user/http/middleware/auth.middleware";

const userController = container.resolve(UserController)

export default function(app: Application) {
    app.post('/register', userController.register)
    app.post('/login', userController.login)
    app.post('/token', userController.token)
    app.get('/users', (new AuthMiddleware).handle(), userController.getUsers)
}