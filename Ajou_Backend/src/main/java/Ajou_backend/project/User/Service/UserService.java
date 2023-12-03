package Ajou_backend.project.User.Service;

import Ajou_backend.project.Error.CustomException;
import Ajou_backend.project.JWT.JwtProvider;
import Ajou_backend.project.Table.DTO.UserDto;
import Ajou_backend.project.User.Controller.Entity.Hashtag;
import Ajou_backend.project.User.Controller.Entity.Link;
import Ajou_backend.project.User.Controller.Entity.User;
import Ajou_backend.project.User.Repository.HashtagRepository;
import Ajou_backend.project.User.Repository.LinkRepository;
import Ajou_backend.project.User.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

import static Ajou_backend.project.Error.ErrorCode.*;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;
    private final HashtagRepository hashtagRepository;
    private final JwtProvider jwtProvider;

    public void saveHash(User user, List<Hashtag> hashtagList) {
        for (Hashtag hash : hashtagList) {
            Link link = new Link();
            link.setUser(user);
            link.setHashtag(hash);
            linkRepository.save(link);
        }
    }

    public UserDto getjsonUser(JSONObject object) throws CustomException {
        JSONParser jsonParser = new JSONParser();
        ObjectMapper mapper = new ObjectMapper();
        try {
            String jsonStr = mapper.writeValueAsString(object.get("user"));
            JSONObject jsonUser = (JSONObject) jsonParser.parse(jsonStr);
            UserDto userDto = new UserDto();
            userDto.setGrade(Long.valueOf((String) jsonUser.get("grade")));
            userDto.setEmail((String) jsonUser.get("email"));
            userDto.setMajor((String) jsonUser.get("major"));
            userDto.setPassword((String) jsonUser.get("password"));
            return userDto ;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Hashtag> getHashtagList(JSONObject object) throws CustomException {

        List<Hashtag> hashtagList = new ArrayList<>();
        for (Object keyword : (List) object.get("keyword")) {
//            log.info("keyword = " + keyword);
            hashtagList.add(hashtagRepository.findByKeyword((String)keyword));

        }
        return hashtagList;
    }

    //회원 가입
    public Long join(JSONObject object) throws CustomException {
        UserDto userDto = getjsonUser(object);
        User user = userRepository.findByEmail(userDto.getEmail());
        if (user != null) {
            throw new CustomException(ERR_DUPLICATE_ID);
        }
        log.info("user = "+ user);
        user = new User(userDto);
        userRepository.save(user);
        List<Hashtag> hashtagList = getHashtagList(object);
        saveHash(user, hashtagList);
        return user.getUserId();
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

    public JSONObject getUserInfo(Long userId) {
        JSONObject jsonObject = new JSONObject();
        List<Link> linkList = linkRepository.findByUser(getUser(userId));
        jsonObject.put("user", getUser(userId));
        List<String> linkArr = new ArrayList<>();
        for (Link link : linkList) {
            linkArr.add(link.getHashtag().getKeyword());
        }
        jsonObject.put("keyword", linkArr);
        return jsonObject;
    }

    public void deleteUser(Long userId) {
        linkRepository.deleteByUser_UserId(userId);
        userRepository.deleteByUserId(userId);
    }

    public Long getLoginId(HttpHeaders header) throws CustomException {
        String token = header.getFirst("Authorization");
        log.info("token="+token);
        try {
            Claims claims = jwtProvider.parseJwtToken(token);
            User user = userRepository.findByUserId(Long.parseLong(claims.getSubject()));
            return user.getUserId();
        } catch (Exception e) {
            return Long.valueOf(-1);
        }
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


//    public Link getLink(Long userId, Hashtag hashtag) {
//        Link link = linkRepository.findByUser_UserIdAndHashtag_HashtagId(userId, hashtag.getHashtagId());
//        if (link == null) {
//            link = new Link();
//            link.setUser(getUser(userId));
//            link.setHashtag(hashtag);
//            linkRepository.save(link);
//        }
//        return link;
//    }

    @Transactional
    public void update(JSONObject object) {
        UserDto userDto = getjsonUser(object);
        User user = userRepository.findByEmail(userDto.getEmail());
        user.setEmail(userDto.getEmail());
        user.setMajor(userDto.getMajor());
        user.setGrade(userDto.getGrade());
        user.setPassword(userDto.getPassword());
        List<Hashtag> hashtagList = getHashtagList(object);
        linkRepository.deleteByUser_UserId(user.getUserId());
        saveHash(user, hashtagList);
    }
}


