package chat.app.server.model;

public class ReadReceiptRequest {

    private String channel;
    private String username;

    public ReadReceiptRequest() {
        super();
    }
    public String getChannel() {
        return channel;
    }
    public void setChannel(String channel) {
        this.channel = channel;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
