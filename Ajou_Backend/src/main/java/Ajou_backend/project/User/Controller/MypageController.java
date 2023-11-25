package Ajou_backend.project.User.Controller;

import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.User.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/mypage")
public class MypageController {

    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<UserDto> myInfo(@RequestHeader HttpHeaders header) {
        Long userId = userService.loginCheck(header);
        UserDto user = userService.getUserInfo(userId);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
    @PatchMapping("/update")
    public ResponseEntity update(@RequestHeader HttpHeaders header, @RequestBody UserDto userDto) throws Exception {
        Long userId = userService.loginCheck(header);

        userService.update(userId, userDto);
        return ResponseEntity.status(HttpStatus.OK).body("Update Success");
    }
}
