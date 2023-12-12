package Ajou_backend.project.User.Service;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import Ajou_backend.project.User.Controller.Entity.User;
import Ajou_backend.project.User.Repository.HashtagRepository;
import Ajou_backend.project.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SaveJSON {
    private final HashtagRepository hashtagRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public void saveForSendMail() {

        List<User> userList = userRepository.findAll();
        List<JSONObject> jsonList = new JSONArray();

        for (User user : userList) {
            JSONObject jsonUser = userService.getUserInfo(user.getUserId());
            JSONObject jsonKeyword = new JSONObject();
            jsonKeyword.put("email", jsonUser.get("email"));
            jsonKeyword.put("keyword", jsonUser.get("keyword"));
            jsonList.add(jsonKeyword);
        }

        try {
            FileWriter file = new FileWriter("./");
            file.write(jsonList.toString());
            file.flush();
            file.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.print(jsonList);

    }

}