"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.paginate = paginate;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAll() {
    try {
        return await prisma.article.findMany();
    }
    catch (err) {
        throw new Error(`Failed to fetch all articles: ${err}`);
    }
}
async function getById(id) {
    try {
        return await prisma.article.findUnique({ where: { id } });
    }
    catch (err) {
        throw new Error(`Failed to fetch article ${id}: ${err}`);
    }
}
async function create(title, content, completed = false) {
    try {
        return await prisma.article.create({
            data: { title, content, completed }
        });
    }
    catch (err) {
        throw new Error(`Failed to create article: ${err}`);
    }
}
async function paginate(page, pageSize) {
    const skip = (page - 1) * pageSize;
    try {
        const [data, total] = await Promise.all([
            prisma.article.findMany({ skip, take: pageSize }),
            prisma.article.count()
        ]);
        return { data, total, page, pageSize };
    }
    catch (err) {
        throw new Error(`Failed to paginate articles: ${err}`);
    }
}
