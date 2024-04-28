package webSocket;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming text messages from clients
        String payload = message.getPayload();
        System.out.println("Received message from client " + session.getId() + ": " + payload);

        // Process the incoming message and send a response back to the client if needed
        String response = processMessage(payload);

        // Send the response back to the client
        session.sendMessage(new TextMessage(response));
    }

    // Example method to process incoming messages
    private String processMessage(String message) {
        // Implement your message processing logic here
        return "Received: " + message;
    }
}

