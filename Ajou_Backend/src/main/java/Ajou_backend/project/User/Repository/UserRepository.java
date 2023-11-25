package Ajou_backend.project.User.Repository;

import Ajou_backend.project.Table.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUserId(Long userId);
    void deleteByUserId(Long userId);
}