package Ajou_backend.project.Python.Component;

import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class PythonComponent{

    public String runPython(String str, Integer idx){
        String jsonStr, line;
        jsonStr = "";
        log.info(str);
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (idx == 1) { //키워드 기반
            processBuilder = new ProcessBuilder("python3", "src/main/java/Ajou_backend/project/Python/Code/search.py","-f", "notice_list","-i", str);
        }
        else if (idx == 2) { //검색어
            processBuilder = new ProcessBuilder("python3", "src/main/java/Ajou_backend/project/Python/Code/search.py", "-f", "search_result","-i", str);
        }

        else if (idx == 3) { // 월 별 공지사항
            processBuilder = new ProcessBuilder("python3", "src/main/java/Ajou_backend/project/Python/Code/search.py","-f", "get_repeated");
        }

        try { // java.io.exception 발생하는 코드 기입
            Process process = processBuilder.start();

            InputStream inputStream = process.getInputStream();
//            InputStream inputStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
//            log.info("complete");
            while ((line = reader.readLine()) != null) {
                jsonStr += line;
            }
            log.info("python = "+jsonStr);
            return jsonStr;
        }catch(IOException e) {
            e.printStackTrace();
        }
        return jsonStr;
    }
}
