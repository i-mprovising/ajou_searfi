package Ajou_backend.project.notice.Service;

import Ajou_backend.project.Error.CustomException;
import Ajou_backend.project.Python.Component.PythonComponent;
import Ajou_backend.project.User.Controller.Entity.Link;
import Ajou_backend.project.User.Controller.Entity.User;
import Ajou_backend.project.User.Repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import static Ajou_backend.project.Error.ErrorCode.*;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {

    private final LinkRepository linkRepository;
    private final PythonComponent pythonComponent;


    public List<Object> getNoticeByHash(User user) {
        List<Object> hashTag = new ArrayList<>();
        for (Link link : linkRepository.findByUser(user)) {
            hashTag.add(link.getHashtag().getKeyword());
        }
        hashTag = parseList(pythonComponent.runPython(hashTag.toString(), 1));

        return hashTag;
    }

    public List<Object> getNoticeByAll() {
        List<Object> hashTag = new ArrayList<>();
        hashTag = parseList(pythonComponent.runPython("[]", 1));
        return hashTag;
    }

    public List<Object> getNoticeByKeyword(String keyword) {
        List<Object> hashTag = new ArrayList<>();
        hashTag = parseList(pythonComponent.runPython(keyword, 2));
        return hashTag;
    }

    public JSONObject getNoticeByMonth() {
        JSONObject monthly = new JSONObject();
        monthly = parseMonthList(pythonComponent.runPython("", 3));
        log.info("After parsing = " + monthly);
        return monthly;
    }


    public List<Object> parseList(String jsonStr) {

        List<Object> hashTag = new ArrayList<>();
        if (jsonStr == "") {
//            log.info("python 데이터가 없습니다~");
            return hashTag;
        }
        try { // java.io.exception 발생하는 코드 기입
            JSONParser parser = new JSONParser();
//            log.info("" + parser.parse(jsonStr));
            JSONArray jsonArray = (JSONArray) parser.parse(jsonStr);
            for (Object arr : jsonArray) {
                JSONObject json = (JSONObject) arr;
                hashTag.add(json);
//                log.info("json = " + json.get("date"));
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return hashTag;
    }

    public JSONObject parseMonthList(String jsonStr) {

        JSONObject monthly = new JSONObject();
        if (jsonStr == "") {
//            log.info("python 데이터가 없습니다~");
            return monthly;
        }
        try { // java.io.exception 발생하는 코드 기입
            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(jsonStr);
            monthly = jsonObject;
            for (int i = 1; i < 13; i++) {
                String j = Integer.toString(i);
                List<Object> notice = new ArrayList<>();
                String noticelist = monthly.get(j).toString();
                JSONArray jsonArray = (JSONArray) parser.parse(noticelist);
                if (jsonArray.isEmpty()) {
                    continue;
                }
                else {
                    for (Object arr : jsonArray) {
                        JSONObject json = (JSONObject) arr;
                        notice.add(json);
                    }
                }
                monthly.replace(j, notice);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return monthly;
    }

}


