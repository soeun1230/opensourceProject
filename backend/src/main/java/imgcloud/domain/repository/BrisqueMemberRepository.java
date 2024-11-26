package imgcloud.domain.repository;

import imgcloud.member.BrisqueMember;
import imgcloud.member.PeopleImageMember;
import imgcloud.member.ThingImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrisqueMemberRepository extends JpaRepository<BrisqueMember,Long> {
    Optional<BrisqueMember> findBythingId(ThingImageMember thingImageMember);
    Optional<BrisqueMember> findBypeopleId(PeopleImageMember peopleImageMember);
}
