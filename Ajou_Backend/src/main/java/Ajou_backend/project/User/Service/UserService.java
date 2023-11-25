package Ajou_backend.project.User.Service;

import Ajou_backend.project.Error.CustomException;
import Ajou_backend.project.JWT.JwtProvider;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.Table.Entity.User;
import Ajou_backend.project.User.Repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;

import static Ajou_backend.project.Error.ErrorCode.*;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    //회원 가입
    public Long join(UserDto userDto) throws CustomException {
        User user = userRepository.findByUserId(userDto.getUserId());
        if (user != null) {
            throw new CustomException(ERR_DUPLICATE_ID);
        }
        user = new User(userDto);
        userRepository.save(user);
        Long userId = user.getUserId();
        return userId;
    }


    public UserDto login(String email, String password){
        User user = userRepository.findByEmail(email);
        if (user == null)  return null;
        if (user.getPassword().equals(password)) {
            return (new UserDto(user));
        }
        return null;
    }

    public User getUser(Long userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new CustomException(ERR_USER_NOT_EXIST);
        }
        return user;
    }

    public UserDto getUserInfo(Long userId) {
        return new UserDto(getUser(userId));
    }
    public void deleteUser(Long userId) {
        userRepository.deleteByUserId(userId);
    }

    public Long loginCheck(HttpHeaders header) throws CustomException {
        String token = header.getFirst("Authorization");
        log.info("token="+token);
        try {
            Claims claims = jwtProvider.parseJwtToken(token);
            User user = userRepository.findByUserId(Long.parseLong(claims.getSubject()));
            return user.getUserId();
        } catch (Exception e) {
            log.info(ERR_UNAUTHORIZED.getMessage());
            throw new CustomException(ERR_UNAUTHORIZED);
        }
    }


    @Transactional
    public void update(Long userId, UserDto userDto) {
        User user = getUser(userId);
        user.setEmail(userDto.getEmail());
        user.setMajor(userDto.getMajor());
        user.setGrade(userDto.getGrade());
        user.setPassword(userDto.getPassword());
    }
}


