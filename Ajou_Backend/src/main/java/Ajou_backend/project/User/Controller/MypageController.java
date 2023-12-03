package Ajou_backend.project.User.Controller;

import Ajou_backend.project.Table.DTO.HashtagDto;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.User.Service.HashtagService;
import Ajou_backend.project.User.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/mypage")
public class MypageController {

    private final UserService userService;
    private final HashtagService hashtagService;

    @GetMapping("")
    public ResponseEntity<JSONObject> myInfo(@RequestHeader HttpHeaders header) {
        Long userId = userService.loginCheck(header);
        JSONObject jsonObject = userService.getUserInfo(userId);
        log.info("json = " + jsonObject);
        return ResponseEntity.status(HttpStatus.OK).body(jsonObject);
    }
    @PatchMapping("/update")
    public ResponseEntity update(@RequestHeader HttpHeaders header, @RequestBody JSONObject object) throws Exception {
        Long userId = userService.loginCheck(header);
        userService.update(object);
        return ResponseEntity.status(HttpStatus.OK).body("Update Success");
    }
    @GetMapping("/hashtag")
    public ResponseEntity<JSONObject> myInfo() {
        List<String> hashtagList = hashtagService.getHashtagList();
        log.info("list = " + hashtagList);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("keyword", hashtagList);
        return ResponseEntity.status(HttpStatus.OK).body(jsonObject);
    }
}
