package imgcloud.domain.repository;

import imgcloud.member.MetadataMember;
import imgcloud.member.PeopleImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PeopleMetadataMemberRepository extends JpaRepository<MetadataMember, Long> {
    Optional<MetadataMember> findBypeopleId(PeopleImageMember peopleImageMember);
}
