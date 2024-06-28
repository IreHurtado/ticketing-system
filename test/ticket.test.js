jest.setTimeout(90000); // 90 segundos
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import server from "../server.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

describe('Tickets API', () => {
    let token;
    
    beforeAll(async () => {
        await User.deleteMany();
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'User Test 2',
                email: 'usertest@email.com',
                password: '91011127',
                role: 'user',
            });

            token = response.body.token;
    });

    beforeEach(async () => {
        await Ticket.deleteMany();
    });

    afterAll(async () => {
        server.close();
        await mongoose.connection.close();
    });

    test('create a new ticket', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Ticket',
                description: 'Test ticket description',
                priority:'high',
                status: 'open',
            });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('ticket');
    expect(response.body.ticket).toHaveProperty('title', 'Test Ticket');
    });

    test('Get all tickets', async () => {
        const ticket1 = await Ticket.create({
            title: "Ticket 1",
            description: 'Ticket 1 Description',
            priority: 'low',
            status: 'open',
            user: 'test-user-id'
        });
        await ticket1.save();

        const ticket2 = await Ticket.create({
            title: "Ticket 2",
            description: 'Ticket 2 Description',
            priority: 'low',
            status: 'open',
            user: 'test-user-id'
        });
        await ticket2.save();

        const response = await request(app).get("/api/tickets");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("results");
    });
});