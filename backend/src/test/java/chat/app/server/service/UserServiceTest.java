package chat.app.server.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import chat.app.server.exception.UsernameAlreadyUsedException;
import chat.app.server.model.User;
import chat.app.server.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testConnectNewUser_Successful() throws UsernameAlreadyUsedException {
        User user = userService.connect(new User("Tom"));

        assertNotNull(user);
        assertEquals("Tom", user.getUsername());
        assertNotNull(user.getId());
        assertTrue(user.getConnected());
    }

    @Test
    public void testConnectUserWhenUserAlreadyExists_Successful() throws UsernameAlreadyUsedException {
        userRepository.save(new User("Tom"));
        User user = userService.connect(new User("Tom"));

        assertNotNull(user);
        assertEquals("Tom", user.getUsername());
        assertNotNull(user.getId());
        assertTrue(user.getConnected());
    }

    @Test(expected = UsernameAlreadyUsedException.class)
    public void testConnectUser_userAlreadyConnected() throws UsernameAlreadyUsedException {
        userService.connect(new User("Jerry"));

        // Trying to connect the same user
        userService.connect(new User("Jerry"));
    }

    @Test
    public void testDisconnectUser_whenUserIsNull() {
        userService.disconnect(null);
    }

    @Test
    public void testDisconnectUser_whenUserIsNotNullAndDoesNotExist() {
        userService.disconnect(new User("Terry"));
    }

    @Test
    public void testDisconnectUser_whenUserExists() throws UsernameAlreadyUsedException {
        userService.connect(new User("Mickey"));
        userService.disconnect(new User("Mickey"));
    }
}
