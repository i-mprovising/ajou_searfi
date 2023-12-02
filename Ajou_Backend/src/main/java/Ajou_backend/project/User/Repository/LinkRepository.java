package Ajou_backend.project.User.Repository;

import Ajou_backend.project.Table.Entity.Link;
import Ajou_backend.project.Table.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findByUser(User user);
    Link findByUser_UserIdAndHashtag_HashtagId(Long userId, Long hashtagId);
    void deleteByUser_UserId(Long UserId);
}