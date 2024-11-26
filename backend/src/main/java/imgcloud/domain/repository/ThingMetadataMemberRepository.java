package imgcloud.domain.repository;

import imgcloud.member.MetadataMember;
import imgcloud.member.ThingImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThingMetadataMemberRepository extends JpaRepository<MetadataMember,Long> {
    Optional<MetadataMember> findBythingId(ThingImageMember thingImageMember);
}
