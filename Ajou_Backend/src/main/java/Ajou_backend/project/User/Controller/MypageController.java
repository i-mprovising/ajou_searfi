package Ajou_backend.project.User.Controller;

import Ajou_backend.project.Table.DTO.HashtagDto;
import Ajou_backend.project.Table.DTO.UserDto;
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

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> myInfo(@RequestHeader HttpHeaders header) {
        Long userId = userService.loginCheck(header);
        Map<String, Object> map = userService.getUserInfo(userId);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }
    @PatchMapping("/update")
    public ResponseEntity update(@RequestHeader HttpHeaders header, @RequestBody JSONObject object) throws Exception {
        Long userId = userService.loginCheck(header);
        userService.update(object);
        return ResponseEntity.status(HttpStatus.OK).body("Update Success");
    }
}
