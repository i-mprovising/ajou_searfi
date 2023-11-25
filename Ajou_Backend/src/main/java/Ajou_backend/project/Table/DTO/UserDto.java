package Ajou_backend.project.Table.DTO;

import Ajou_backend.project.Table.Entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor()
public class UserDto {
    private Long userId;
    private String email;
    private String password;
    private Long grade;
    private String major;
    public UserDto(User entity) {
        userId = entity.getUserId();
        email = entity.getEmail();
        password = entity.getPassword();
        grade = entity.getGrade();
        major = entity.getMajor();
    }
}
