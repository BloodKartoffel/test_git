/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('../src/index');

describe('Чат Віджет', () => {
    let mockWebSocketInstance;

    beforeEach(() => {
        document.body.innerHTML = '';

        mockWebSocketInstance = {
            send: jest.fn(),
            close: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            readyState: WebSocket.OPEN,
        };

        global.WebSocket = jest.fn(() => mockWebSocketInstance);

        window.ChatWidget.init();
    });

    test('повинен створювати контейнер чату в DOM', () => {
        const chatContainer = document.querySelector('.chat-container');
        expect(chatContainer).toBeInTheDocument();
    });

    test('повинен підключатися до WebSocket серверу при ініціалізації', () => {
        expect(WebSocket).toHaveBeenCalledWith('ws://localhost:3030');
    });

    test('повинен відображати повідомлення при отриманні notification', () => {
        const data = JSON.stringify({
            type: 'notification',
            message: 'Тестове повідомлення',
        });

        const messageCallback = mockWebSocketInstance.addEventListener.mock.calls.find(
            (call) => call[0] === 'message'
        )?.[1];

        expect(messageCallback).toBeDefined();

        if (messageCallback) {
            messageCallback({ data });
        }

        const notification = document.querySelector('.message-text.text-gray-600');
        expect(notification).toBeInTheDocument();
        expect(notification.textContent.trim()).toBe('Тестове повідомлення');
    });

    test('повинен надсилати повідомлення при кліку на кнопку відправки', () => {
        const sendButton = document.getElementById('chat-widget-send-button');
        const input = document.getElementById('chat-widget-input');
        const testMessage = 'Тестове повідомлення';

        fireEvent.input(input, { target: { value: testMessage } });

        fireEvent.click(sendButton);

        expect(mockWebSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({
            type: 'message',
            message: testMessage
        }));

        expect(input.value).toBe('');
    });

    test('повинен відображати надіслане повідомлення в чаті', () => {
        const sendButton = document.getElementById('chat-widget-send-button');
        const input = document.getElementById('chat-widget-input');
        const testMessage = 'Тестове повідомлення';

        const expandButton = document.getElementById('chat-widget-expand-button');
        fireEvent.click(expandButton);

        fireEvent.input(input, { target: { value: testMessage } });

        fireEvent.click(sendButton);
        const sentMessage = document.querySelector('.sent-message-container .message-text');
        expect(sentMessage).toBeInTheDocument();
        expect(sentMessage.textContent).toBe(testMessage);
    });

});
