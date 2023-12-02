package Ajou_backend.project.User.Repository;

import Ajou_backend.project.Table.Entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Hashtag findByKeyword(String keyword);
}