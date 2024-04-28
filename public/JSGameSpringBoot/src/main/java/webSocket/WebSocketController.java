package webSocket;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// handles higher-level application logic related to WebSocket messages

@Controller
@RequestMapping("/websocket")
public class WebSocketController {

    @MessageMapping("/game")
    @SendTo("/topic/game")
    public String handleGameMessage(String message) {
        // Handle game logic and return response
    	String response = processGameMessage(message);
        return response;
    }
    private String processGameMessage(String message) {
        // Implement game logic based on the incoming message
        // Example: Check if the message is a player's move, update game state, etc.
        // Return a response based on the game logic
        return "Processed message: " + message;
    }
}
