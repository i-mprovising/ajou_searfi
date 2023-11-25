package Ajou_backend.project.User.Service;

import Ajou_backend.project.Error.CustomException;
import Ajou_backend.project.JWT.JwtProvider;
import Ajou_backend.project.Table.DTO.HashtagDto;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.Table.Entity.Hashtag;
import Ajou_backend.project.Table.Entity.Link;
import Ajou_backend.project.Table.Entity.User;
import Ajou_backend.project.User.Repository.LinkRepository;
import Ajou_backend.project.User.Repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static Ajou_backend.project.Error.ErrorCode.*;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;
    private final JwtProvider jwtProvider;

    public void saveHash(User user, List<HashtagDto> hashtagDtoList) {
        Hashtag hash;
        for (HashtagDto ele : hashtagDtoList) {
            hash = new Hashtag(ele);
            Link link = new Link();
            link.setUser(user);
            link.setHashtag(hash);
            linkRepository.save(link);
        }
    }


    //회원 가입
    public Long join(UserDto userDto, List<HashtagDto> hashtagDtoList) throws CustomException {
        User user = userRepository.findByUserId(userDto.getUserId());
        if (user != null) {
            throw new CustomException(ERR_DUPLICATE_ID);
        }
        user = new User(userDto);
        userRepository.save(user);
        Long userId = user.getUserId();
        saveHash(user, hashtagDtoList);

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

    public Map<String, Object> getUserInfo(Long userId) {
        Map<String, Object> ret = new HashMap<>();
        List<Link> linkList = linkRepository.findByUser(getUser(userId));
        ret.put("user", new UserDto(getUser(userId)));
        List<String> linkArr = new ArrayList<>();
        for (Link link : linkList) {
            linkArr.add(link.getHashtag().getKeyword());
        }
        ret.put("hashtag", linkArr);
        return ret;
    }
    public void deleteUser(Long userId) {
        linkRepository.deleteByUser_UserId(userId);
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


    public Link getLink(Long userId, Hashtag hashtag) {
        Link link = linkRepository.findByUser_UserIdAndHashtag_HashtagId(userId, hashtag.getHashtagId());
        if (link == null) {
            link = new Link();
            link.setUser(getUser(userId));
            link.setHashtag(hashtag);
            linkRepository.save(link);
        }
        return link;
    }

    @Transactional
    public void update(Long userId, UserDto userDto, List<HashtagDto> hashtagDtoList) {
        User user = getUser(userId);
        user.setEmail(userDto.getEmail());
        user.setMajor(userDto.getMajor());
        user.setGrade(userDto.getGrade());
        user.setPassword(userDto.getPassword());

        linkRepository.deleteByUser_UserId(userId);
        saveHash(user, hashtagDtoList);
    }
}


