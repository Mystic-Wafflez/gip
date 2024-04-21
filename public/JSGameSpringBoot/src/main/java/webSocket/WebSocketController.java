package webSocket;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/game")
    @SendTo("/topic/game")
    public String handleGameMessage(String message) {
        // Handle game logic and return response
        return "Response to client";
    }
}
