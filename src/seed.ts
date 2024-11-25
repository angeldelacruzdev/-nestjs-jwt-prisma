import { PrismaClient } from "@prisma/client";
import cloneDeep from 'lodash/cloneDeep';


export const roles = [
    {
        id: 1,
        name: 'Admin'
    },
    {
        id: 2,
        name: 'User'
    }
];

export const permissions = [
    {
        id: 1,
        role_id: 1,
        action: 'manage',
        subject: 'all'
    },
    {
        id: 2,
        role_id: 2,
        action: 'read',
        subject: 'User'
    },
    {
        id: 3,
        role_id: 2,
        action: 'manage',
        subject: 'User',
        conditions: { created_by: '{{ id }}' }
    }
];


export const users = [
    {
        id: 1,
        name: 'Angel De La Cruz',
        role_id: 1,
        email: 'angel@yopmail.com',
        password: '$2b$10$FpchyidGNMQQ5kMH/OGp4eLa1jEQd52VooZwXdsOsYSf55swam8d2' // Admin@123456
    },
    {
        id: 2,
        name: 'Ale Peralta',
        role_id: 2,
        email: 'ale@yopmail.com',
        password: '$2b$10$FpchyidGNMQQ5kMH/OGp4eLa1jEQd52VooZwXdsOsYSf55swam8d2' // Admin@123456
    }
];




const prisma = new PrismaClient();

async function main() {
    for await (const role of roles) {
        const roleAttrs = cloneDeep(role);
        delete roleAttrs.id;
        await prisma.role.upsert({
            where: {
                id: role.id
            },
            create: roleAttrs,
            update: roleAttrs
        });
    }

    for await (const permission of permissions) {
        const permissionAttrs = cloneDeep(permission);
        delete permissionAttrs.id;
        await prisma.permission.upsert({
            where: {
                id: permission.id
            },
            create: permissionAttrs,
            update: permissionAttrs
        });
    }

    for await (const user of users) {
        const userAttrs = cloneDeep(user);
        delete userAttrs.id;
        await prisma.user.upsert({
            where: {
                id: user.id
            },
            create: userAttrs,
            update: userAttrs
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.log(error);
        await prisma.$disconnect();
    });