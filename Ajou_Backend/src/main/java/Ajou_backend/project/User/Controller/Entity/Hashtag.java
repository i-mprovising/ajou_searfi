package Ajou_backend.project.User.Controller.Entity;

import Ajou_backend.project.Table.DTO.HashtagDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor()
@Table(name= "Hashtag")
public class Hashtag {
    @Id
    @GeneratedValue
    private Long hashtagId;
    @Column(length = 10)
    private String keyword;

    public Hashtag(HashtagDto dto) {
        hashtagId = dto.getHashtagId();
        keyword = dto.getKeyword();
    }
}