package Ajou_backend.project.notice.Repository;

import Ajou_backend.project.User.Controller.Entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Hashtag, Long> {
//    List<Hashtag> findByHashtagId(Long hashtagId);
}