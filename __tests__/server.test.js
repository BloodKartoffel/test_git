/**
 * @jest-environment node
 */

//  __tests__/server.test.js
const WebSocket = require('ws');
const server = require('../server/server');
const PORT = 3030;

describe('WebSocket Сервер', () => {
    let wsClient1;
    let wsClient2;

    beforeAll((done) => {
        server.on('listening', () => {
            done();
        });
    });

    afterAll((done) => {
        server.close(() => {
            done();
        });
    });

    test('повинен приймати підключення WebSocket', (done) => {
        wsClient1 = new WebSocket(`ws://localhost:${PORT}`);

        wsClient1.on('open', () => {
            expect(wsClient1.readyState).toBe(WebSocket.OPEN);
            wsClient1.close();
            done();
        });
    });

    test('повинен надсилати init повідомлення при підключенні', (done) => {
        wsClient1 = new WebSocket(`ws://localhost:${PORT}`);

        wsClient1.on('message', (data) => {
            const message = JSON.parse(data);
            expect(message.type).toBe('init');
            expect(message).toHaveProperty('name');
            expect(message).toHaveProperty('color');
            wsClient1.close();
            done();
        });
    });

    test('повинен розсилати сповіщення про підключення іншим клієнтам', (done) => {
        wsClient1 = new WebSocket(`ws://localhost:${PORT}`);

        wsClient1.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'init') {
                wsClient2 = new WebSocket(`ws://localhost:${PORT}`);
            }

            if (message.type === 'notification') {
                expect(message.message).toMatch(/приєднався до чату/);
                wsClient1.close();
                wsClient2.close();
                done();
            }
        });

        wsClient1.on('open', () => {

        });
    });


    test('повинен розсилати повідомлення від одного клієнта іншим', (done) => {
        wsClient1 = new WebSocket(`ws://localhost:${PORT}`);
        wsClient2 = new WebSocket(`ws://localhost:${PORT}`);

        const testMessage = 'Привіт, це тестове повідомлення!';

        wsClient2.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'message') {
                expect(message.message).toBe(testMessage);
                wsClient1.close();
                wsClient2.close();
                done();
            }
        });

        wsClient1.on('open', () => {
            wsClient1.send(JSON.stringify({ type: 'message', message: testMessage }));
        });
    });

    test('повинен обробляти відключення клієнта', (done) => {
        let client1Name;
        let client2Name;

        wsClient1 = new WebSocket(`ws://localhost:${PORT}`);
        wsClient2 = new WebSocket(`ws://localhost:${PORT}`);

        const finishTest = () => {
            wsClient1.close();
            wsClient2.close();
            done();
        };

        wsClient1.once('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'init') {
                client1Name = message.name;
            }
        });

        wsClient2.once('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'init') {
                client2Name = message.name;
                wsClient1.close();
            }
        });

        const handleNotification = (data) => {
            const message = JSON.parse(data);
            if (
                message.type === 'notification' &&
                message.message === `${client1Name} від’єднався від чату`
            ) {
                expect(message.message).toBe(`${client1Name} від’єднався від чату`);
                finishTest();
            }
        };

        wsClient2.once('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'init') {
                wsClient2.on('message', handleNotification);
            }
        });

        wsClient1.on('error', (error) => {
            console.error('wsClient1 Error:', error);
        });

        wsClient2.on('error', (error) => {
            console.error('wsClient2 Error:', error);
        });
    });


});
