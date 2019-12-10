package chat.app.server.controller;

import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import chat.app.server.model.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ConnectionControllerTest {

    private final ObjectMapper jsonMapper = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @Before
    public void preSetup() throws Exception {
        String jsonData = jsonMapper.writeValueAsString(new User("Jason"));
        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonData))
                .andReturn();
    }

    @Test
    public void testLoginSuccessful() throws Exception {
        String jsonData = jsonMapper.writeValueAsString(new User("Chuck"));
        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonData))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginWhenUserIsAlreadyConnected() throws Exception {
        String jsonData = jsonMapper.writeValueAsString(new User("Jason"));
        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonData))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testLogoutSuccessful() throws Exception {
        String jsonData = jsonMapper.writeValueAsString(new User("Jason"));
        mockMvc.perform(post("/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonData))
                .andReturn();
    }

    @Test
    public void testFindConnectedUsers() throws Exception {
        mockMvc.perform(get("/listUsers"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("Jason")))
                .andExpect(status().isOk());
    }
}
