package Ajou_backend.project.User.Repository;

import Ajou_backend.project.User.Controller.Entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Hashtag findByKeyword(String keyword);
    List<Hashtag> findAll();
}