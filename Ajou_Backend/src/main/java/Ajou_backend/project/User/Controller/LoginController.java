package Ajou_backend.project.User.Controller;

import Ajou_backend.project.Error.CustomException;
import Ajou_backend.project.JWT.AuthRequest;
import Ajou_backend.project.JWT.JwtProvider;
import Ajou_backend.project.JWT.TokenResponse;
import Ajou_backend.project.Table.DTO.HashtagDto;
import Ajou_backend.project.Table.DTO.LinkDto;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.Table.Entity.Hashtag;
import Ajou_backend.project.User.Service.UserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static Ajou_backend.project.Error.ErrorCode.ERR_AUTHORIZED;


@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class LoginController {

    private final UserService userService;
    private final JwtProvider jwtProvider;

    @PostMapping("/join")
    public ResponseEntity<?> userJoin(@RequestBody JSONObject object) {
        log.info("user = " + object.get("user"));
        log.info("user = " + object.get("keyword"));
        userService.join(object);
        return ResponseEntity.status(HttpStatus.CREATED).body("Join success");
    }



    @PostMapping("/login")
    public  ResponseEntity<TokenResponse> login(@RequestBody AuthRequest authRequest) throws Exception {
        log.info("id="+authRequest.getEmail()+" pw="+authRequest.getPassword());
        UserDto user = userService.login(authRequest.getEmail(), authRequest.getPassword());
        try {
            log.info("user="+user);
            String token = jwtProvider.createToken(user.getUserId().toString()); // 토큰 생성
            log.info("token="+token);
            Claims claims = jwtProvider.parseJwtToken("Bearer " + token); // 토큰 검증
            TokenResponse tokenResponse = new TokenResponse(token,
                    "Bearer",
                    claims.getIssuedAt().toString(),
                    claims.getExpiration().toString(),
                    user.getEmail(),
                    user.getGrade(),
                    user.getMajor());
            return ResponseEntity.ok().body(tokenResponse);
        } catch(Exception e) {
            throw new CustomException(ERR_AUTHORIZED);
        }
     }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader HttpHeaders header) {
        //session.invalidate();
        log.info("logout");
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestHeader HttpHeaders header){
        Long userId = userService.loginCheck(header);
        userService.deleteUser(userId);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Success");
    }
}
