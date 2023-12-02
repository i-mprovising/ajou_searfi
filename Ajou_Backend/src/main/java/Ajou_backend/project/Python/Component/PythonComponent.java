package Ajou_backend.project.Python.Component;

import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class PythonComponent{

    public String runPython(String str){
        ProcessBuilder processBuilder = new ProcessBuilder("python3", "src/main/java/Ajou_backend/project/Python/Code/search.py", "--func", "notice_list","--input", "[]");
//        ProcessBuilder processBuilder = new ProcessBuilder("python3", "src/main/java/Ajou_backend/project/Python/Code/test.py", "str");
        try { // java.io.exception 발생하는 코드 기입
            Process process = processBuilder.start();

            InputStream inputStream = process.getInputStream();
//            InputStream inputStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            log.info("complete");
            String jsonStr, line;
            jsonStr = "";
            while ((line = reader.readLine()) != null) {
                jsonStr += line;
            }
            log.info("python = "+jsonStr);
            return jsonStr;
        }catch(IOException e) {
            e.printStackTrace();
        }
        return str;
    }
}
