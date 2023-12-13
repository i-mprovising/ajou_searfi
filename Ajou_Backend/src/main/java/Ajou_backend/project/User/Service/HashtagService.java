package Ajou_backend.project.User.Service;

import Ajou_backend.project.User.Controller.Entity.Hashtag;
import Ajou_backend.project.User.Repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class HashtagService {

    private final HashtagRepository hashtagRepository;

    public List<String> getHashtagList() {
        List<Hashtag> hashtagList = hashtagRepository.findAll();
        List<String> hashList = new ArrayList<>();
        for (Hashtag hash : hashtagList) {
            hashList.add(hash.getKeyword());
        }
        return hashList;
    }
}


