package imgcloud.domain.repository;

import imgcloud.member.ThingImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ThingImageMemberRepository extends JpaRepository<ThingImageMember,Long> {
    Optional<ThingImageMember> findByimageTitle(String title);
    List<ThingImageMember> findByUserThingId_UserId(Long userId);

}
