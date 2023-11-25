package Ajou_backend.project.Table.Entity;

import Ajou_backend.project.Table.DTO.UserDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor()
@Table(name= "User")
public class User {
    @Id@GeneratedValue
    private Long userId;
    @Column(length = 50)
    private String email;
    @Column(length = 50)
    private String password;
    @Column
    private Long grade;
    @Column(length = 50)
    private String major;

    public User(UserDto dto) {
        userId = dto.getUserId();
        email = dto.getEmail();
        password = dto.getPassword();
        grade = dto.getGrade();
        major = dto.getMajor();
    }

}
