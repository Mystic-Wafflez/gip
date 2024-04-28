package webSocket;



import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

// handles low-level WebSocket events
public class WebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Handle when a new WebSocket connection is established
        System.out.println("New WebSocket connection established: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming text messages from clients
        String payload = message.getPayload();
        System.out.println("Received message from client " + session.getId() + ": " + payload);

        // Process the incoming message and send a response back to the client if needed
        String response = processMessage(payload);

        // Send the response back to the client
        session.sendMessage(new TextMessage(response));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Handle when a WebSocket connection is closed
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    // Example method to process incoming messages
    private String processMessage(String message) {
        // Implement your message processing logic here
        return "Received: " + message;
    }
}

