package Ajou_backend.project.Table.DTO;

import Ajou_backend.project.User.Controller.Entity.Hashtag;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor()
public class HashtagDto {
    private Long hashtagId;
    private String keyword;

    public HashtagDto(Hashtag entity) {
        hashtagId = entity.getHashtagId();
        keyword = entity.getKeyword();
    }
}
