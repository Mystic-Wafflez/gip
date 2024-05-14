package webSocket;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.socket.WebSocketSession;

public class GameSession {

    private final List<WebSocketSession> players;

    public GameSession() {
        this.players = new ArrayList<>();
    }

    public void addPlayer(WebSocketSession player) {
        players.add(player);
    }

    public void removePlayer(WebSocketSession player) {
        players.remove(player);
    }

    public boolean isFull() {
        return players.size() >= 2;
    }

   
}
