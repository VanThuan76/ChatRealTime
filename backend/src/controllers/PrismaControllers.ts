import { Request, Response } from "express";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const authenticated = async (req:Request, res:Response) => {
    const {email, password} = req.body
    const user = await prisma.user.findUnique({
        where: { 
            email: email, 
        }
    });
    if (!user || password !== user.password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    res.status(200).json(user)
}
export const getListUser = async(req:Request, res:Response) => {
    const listUser = await prisma.user.findMany();
    res.json(listUser)
}