package Ajou_backend.project.Table.DTO;

import Ajou_backend.project.User.Controller.Entity.Link;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor()
public class LinkDto {
    private Long linkId;
    private Long userId;
    private Long hashtagId;

    public LinkDto(Link entity) {
        linkId = entity.getLinkId();
        userId = entity.getUser().getUserId();
        hashtagId = entity.getHashtag().getHashtagId();
    }
}