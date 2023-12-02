package Ajou_backend.project.notice.Controller;

import Ajou_backend.project.JWT.AuthRequest;
import Ajou_backend.project.JWT.JwtProvider;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.Table.Entity.Hashtag;
import Ajou_backend.project.User.Service.UserService;
import Ajou_backend.project.notice.Service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;
    private final UserService userService;

    @GetMapping("/list")
    public ResponseEntity<?> noticeList(@RequestHeader HttpHeaders header) {
        Long userId = userService.loginCheck(header);
        List<Object> hashTag = noticeService.getNoticeByHash(userService.getUser(userId));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(hashTag);
    }

    @PostMapping("/search")
    public ResponseEntity<?> noticeSearch(@RequestHeader HttpHeaders header, @RequestBody String keyword) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(keyword);
    }

}
