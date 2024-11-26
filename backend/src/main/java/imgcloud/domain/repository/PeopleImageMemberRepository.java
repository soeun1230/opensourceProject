package imgcloud.domain.repository;

import imgcloud.member.PeopleImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeopleImageMemberRepository extends JpaRepository<PeopleImageMember,Long> {
    Optional<PeopleImageMember> findByimageTitle(String title);

    List<PeopleImageMember> findByUserPeopleId_UserId(Long userId);

    Optional<PeopleImageMember> findByPeopleId(Long peopleId);
}
