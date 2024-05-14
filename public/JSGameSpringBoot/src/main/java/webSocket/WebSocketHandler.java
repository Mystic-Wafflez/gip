package webSocket;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebSocketHandler extends TextWebSocketHandler {

    private static final Map<String, Integer> playerMap = new HashMap<>();
    private static final List<GameSession> gameSessions = new ArrayList<>();
    private static final int MAX_PLAYERS_PER_SESSION = 2;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Assign players and add them to game sessions
        if (playerMap.size() % MAX_PLAYERS_PER_SESSION == 0) {
            // Create a new game session if necessary
            gameSessions.add(new GameSession());
            System.out.println(gameSessions);
        }
        int playerNumber = playerMap.size() + 1;
        playerMap.put(session.getId(), playerNumber);

        // Add the player to the last game session
        GameSession currentSession = gameSessions.get(gameSessions.size() - 1);
        currentSession.addPlayer(session);

        System.out.println("New WebSocket connection established: " + session.getId() + " (Player " + playerNumber + ")");
        System.out.println("Total players: " + playerMap.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming text messages from clients
        String payload = message.getPayload();
        System.out.println("Received message from client " + session.getId() + " (Player " + playerMap.get(session.getId()) + "): " + payload);

        // Process the incoming message and send a response back to the client if needed
        String response = processMessage(payload);

        // Send the response back to the client
        session.sendMessage(new TextMessage(response));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Handle when a WebSocket connection is closed
        playerMap.remove(session.getId());

        // Remove the player from any active game sessions
        for (GameSession gameSession : gameSessions) {
            gameSession.removePlayer(session);
        }

        System.out.println("WebSocket connection closed: " + session.getId());
        System.out.println("Total players: " + playerMap.size());
    }

    // Example method to process incoming messages
    private String processMessage(String message) {
        // Implement your message processing logic here
        return "Received: " + message;
    }
}
