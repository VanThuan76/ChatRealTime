import { Request, Response } from "express";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const newUser = async (req:Request, res:Response) => {
    const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password
        }
    });
    res.status(200).json(newUser)
}
export const authenticated = async (req:Request, res:Response) => {
    const {email, password} = req.body
    const user = await prisma.user.findUnique({
        where: { 
            email: email, 
        },
        include:{
            conversations: true,
        }
    });
    if (!user || password !== user.password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    res.status(200).json(user)
}
export const logout = async (req:Request, res:Response) => {
    const {email} = req.body
    const user = await prisma.user.update({
        where: { 
            email: email, 
        },
        data:{
            active: 0
        }
    });
    res.status(200).json(user)
}
export const getListUser = async(req:Request, res:Response) => {
    const listUser = await prisma.user.findMany();
    res.json(listUser)
}
export const getUser = async(req:Request, res:Response) => {
    const listUser = await prisma.user.findMany({
        where:{
            id: req.body.userId
        },
        include: {
            messages: true
        }
    });
    res.json(listUser)
}
export const getInforUser = async(req:Request, res:Response) => {
    const users = await prisma.user.findMany({
        where: {
            username: req.body.username,
        },
        include: {
            conversations: {
                include: {
                    conversation: {
                        include: {
                            participants: true
                        }
                    }
                }
            }
        }
    })
    res.json(users)
}
export const getListConversation = async(req:Request, res:Response) => {
    const listConversation = await prisma.conversation.findMany();
    res.json(listConversation)
}
export const getConversation = async(req:Request, res:Response) => {
    const conversation = await prisma.conversation.findUnique({
        where: { id: req.body.conversationId },
        include: {
            participants: { 
                include: { 
                    user:true
                }
            } 
        },
    });
    res.json(conversation)
}
export const getMessage = async(req:Request, res:Response) => {
    const messages = await prisma.message.findMany({
        where: {
          senderId: req.body.senderId,
        },
        include: {
            sender: true
        }
    })
    res.json(messages)
}
export const newConversation = async(req: Request, res:Response) => {
    try {
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                  create: [
                    { userId: req.body.userSend },
                    { userId: req.body.userGet }
                  ]
                }
              }
          })
        res.json(newConversation)      
    } catch (error) {
        return error
    }
}
export const newMessage = async(req: Request, res:Response) => {
    try {
        const newMessage = await prisma.message.create({
            data: {
              body: `${req.body.newMessage}`,
              conversationId: req.body.conversationId,
              senderId: req.body.senderId
            },
          })
        res.json(newMessage)      
    } catch (error) {
        return error
    }
}
