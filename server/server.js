const WebSocket = require('ws');
const serverPort = 3030;

const server = new WebSocket.Server({ port: serverPort });

const clients = new Map();

const firstNames = [
    'John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah',
    'David', 'Laura', 'Robert', 'Linda', 'James', 'Karen',
    'William', 'Barbara', 'Richard', 'Susan', 'Thomas', 'Jessica'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
    'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez',
    'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor'
];

function generateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateRandomBrightColor() {
    const allowedColors = [
        '#9F8CEF',
        '#692A54',
        '#543029',
        '#2B5C1F',
        '#69622E',
        '#4A90E2',
        '#50E3C2',
        '#F5A623',
        '#D0021B',
        '#8B572A',
        '#417505',
        '#BD10E0',
        '#9013FE',
        '#F8E71C',
        '#B8E986',
        '#50E3C2',
        '#7ED321',
        '#417505',
        '#F5A623',
        '#D0021B',
        '#8B572A',
        '#F8E71C',
        '#B8E986',
        '#7ED321',
        '#417505'
    ];
    return allowedColors[Math.floor(Math.random() * allowedColors.length)];
}

function broadcast(data, sender) {
    for (let client of clients.keys()) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

server.on('connection', (ws) => {
    const userName = generateRandomName();
    const userColor = generateRandomBrightColor();

    clients.set(ws, { name: userName, color: userColor });

    console.log(`${userName} приєднався до чату`);

    const initData = {
        type: 'init',
        name: userName,
        color: userColor
    };
    ws.send(JSON.stringify(initData));

    const joinMessage = {
        type: 'notification',
        message: `${userName} приєднався до чату`
    };
    broadcast(JSON.stringify(joinMessage), ws);

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === 'message') {
                console.log(`Отримане повідомлення від ${userName}: ${parsedMessage.message}`);

                const chatMessage = {
                    type: 'message',
                    name: userName,
                    color: userColor,
                    message: parsedMessage.message
                };

                broadcast(JSON.stringify(chatMessage), ws);
            }
        } catch (error) {
            console.error(`Не вдалося обробити повідомлення від ${userName}:`, error);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`${userName} від’єднався від чату`);

        const leaveMessage = {
            type: 'notification',
            message: `${userName} від’єднався від чату`
        };
        broadcast(JSON.stringify(leaveMessage), ws);
    });

    ws.on('error', (error) => {
        console.error(`Помилка з ${userName}:`, error);
    });
});

console.log(`Сервер чату запущено на ws://localhost:${serverPort}`);
