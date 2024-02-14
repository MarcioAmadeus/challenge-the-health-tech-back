import { Router} from "express";
import { UpdatePassword, UpdateInfo, Logout, AuthenticatedUser, Login, Register } from "./controller/auth.controller";
import { DeleteUser, UpdateUser, GetUser, Create, Users } from "./controller/user.controller";

import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {

    //auth.controller
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user',AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout',AuthMiddleware, Logout);
    router.put('/api/users/info',AuthMiddleware, UpdateInfo);
    router.put('/api/users/password',AuthMiddleware, UpdatePassword);

    //user.controller
    router.get('/api/users',AuthMiddleware, Users);
    router.post('/api/users',AuthMiddleware, Create);
    router.get('/api/users/:id',AuthMiddleware, GetUser);
    router.put('/api/users/:id',AuthMiddleware, UpdateUser);
    router.delete('/api/users/:id',AuthMiddleware, DeleteUser);
} 