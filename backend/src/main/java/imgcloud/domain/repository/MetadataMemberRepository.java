package imgcloud.domain.repository;

import imgcloud.member.MetadataMember;
import imgcloud.member.PeopleImageMember;
import imgcloud.member.ThingImageMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetadataMemberRepository extends JpaRepository<MetadataMember,Long> {
    void deleteByPeopleId(PeopleImageMember peopleId);

    void deleteByThingId(ThingImageMember thingId);
}
