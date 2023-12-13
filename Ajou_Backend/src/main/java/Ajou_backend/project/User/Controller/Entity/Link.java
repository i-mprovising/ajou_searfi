package Ajou_backend.project.User.Controller.Entity;

import Ajou_backend.project.Table.DTO.LinkDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor()
@Table(name= "Link")
public class Link {
    @Id@GeneratedValue
    private Long linkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="hashtagId")
    private Hashtag hashtag;

    public Link(LinkDto dto) {

        if (dto.getUserId() != null) { // userId가 null이 아닌 경우에만 userId를 설정
            user = new User();
            user.setUserId(dto.getUserId());
        }

        if (dto.getHashtagId() != null) {
            hashtag = new Hashtag();
            hashtag.setHashtagId(dto.getHashtagId());
        }

        linkId = dto.getLinkId();
    }

}