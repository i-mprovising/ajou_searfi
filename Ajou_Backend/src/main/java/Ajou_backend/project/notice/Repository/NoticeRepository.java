package Ajou_backend.project.notice.Repository;

import Ajou_backend.project.Table.Entity.Hashtag;
import Ajou_backend.project.Table.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Hashtag, Long> {
//    List<Hashtag> findByHashtagId(Long hashtagId);
}