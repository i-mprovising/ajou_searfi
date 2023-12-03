package Ajou_backend.project.notice.Controller;

import Ajou_backend.project.User.Service.UserService;
import Ajou_backend.project.notice.Service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
        Long userId = userService.getLoginId(header);
        List<Object> notice = new ArrayList<>();
        if (userId >= 0) {
            notice = noticeService.getNoticeByHash(userService.getUser(userId));
        } else {
            notice = noticeService.getNoticeByAll();
        }
        log.info("list = " + notice);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(notice);
    }

    @GetMapping("/search")
    public ResponseEntity<?> noticeSearch(@RequestHeader HttpHeaders header, @RequestBody String keyword) {
        List<Object> notice = new ArrayList<>();
        notice = noticeService.getNoticeByKeyword(keyword);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(notice);
    }

}
