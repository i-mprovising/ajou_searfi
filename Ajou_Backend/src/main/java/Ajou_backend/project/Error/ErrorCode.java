package Ajou_backend.project.Error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    // 400 BAD_REQUEST : 잘못된 요청
    ERR_BAD_REQUEST(HttpStatus.BAD_REQUEST, "bad request"),

    // 401 UNAUTHORIZED : 인증되지 않은 사용자
    ERR_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "not logged in"),
    ERR_AUTHORIZED(HttpStatus.UNAUTHORIZED, "login fail"),

    // 404 NOT_FOUND : Resource를 찾을 수 없음
    ERR_NOT_FOUND(HttpStatus.NOT_FOUND, "not found"),
    ERR_USER_NOT_EXIST(HttpStatus.NOT_FOUND, "user not exist"),

    // 409 CONFLICT : Resource의 현재 상태와 충돌. 보통 중복된 데이터 존재
    ERR_DUPLICATE_ID(HttpStatus.CONFLICT, "duplicate id"),
    ;

    private final HttpStatus httpStatus;
    private final String message;
}