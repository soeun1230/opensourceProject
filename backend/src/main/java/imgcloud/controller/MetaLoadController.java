package imgcloud.controller;

import imgcloud.domain.dto.PeopleLoadDto;
import imgcloud.domain.dto.PeopleMetadataDto;
import imgcloud.domain.dto.ThingLoadDto;
import imgcloud.domain.dto.ThingMetadataDto;
import imgcloud.domain.repository.PeopleImageMemberRepository;
import imgcloud.domain.repository.PeopleMetadataMemberRepository;
import imgcloud.domain.repository.ThingImageMemberRepository;
import imgcloud.domain.repository.ThingMetadataMemberRepository;
import imgcloud.member.MetadataMember;
import imgcloud.member.PeopleImageMember;
import imgcloud.member.ThingImageMember;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class MetaLoadController {
    private PeopleMetadataDto peopleMetadataDto;
    private ThingMetadataDto thingMetadataDto;

    private final ThingMetadataMemberRepository thingMetadataMemberRepository;
    private final PeopleMetadataMemberRepository peopleMetadataMemberRepository;
    private final ThingImageMemberRepository thingImageMemberRepository;
    private final PeopleImageMemberRepository peopleImageMemberRepository;

    @GetMapping("load/meta/thing")
    public ThingLoadDto getThingMeta(@RequestParam Long thingId){
        ThingImageMember thingImageMember = thingImageMemberRepository.findById(thingId).get();
        MetadataMember thingMetadata = thingMetadataMemberRepository.findBythingId(thingImageMember).get();

        int Iso = -1;
        double f = -1;
        int ex = -1;
        String lati = "";
        String longi = "";
        String res = "";
        String resol = "";
        String white = "";
        String sizee = "";
        int me = -1;

        if (thingMetadata != null) {
            // 기본형(int, double 등)은 null을 가질 수 없으므로, null 체크가 필요 없습니다.
            Iso = thingMetadata.getIso();
            f = thingMetadata.getFStop();
            ex = thingMetadata.getExposureTime();
            lati = thingMetadata.getGpsLatitude();
            longi = thingMetadata.getGpsLongitude();
            res = thingMetadata.getRealResolution();
            resol = thingMetadata.getResolution();
            white = thingMetadata.getWhiteBalance();
            sizee = thingMetadata.getSize();
            me = thingMetadata.getMetaScore();
        }

        return new ThingLoadDto(
            Iso,f,ex,lati,longi,res,resol,white,sizee,me
        );
    }

    @GetMapping("load/meta/people")
    public PeopleLoadDto getPeopleMeta(@RequestParam Long peopleId){
        PeopleImageMember peopleImageMember = peopleImageMemberRepository.findById(peopleId).get();
        MetadataMember peopleMetadata = peopleMetadataMemberRepository.findBypeopleId(peopleImageMember).get();

        int Iso = -1;
        double f = -1;
        int ex = -1;
        String lati = "";
        String longi = "";
        String res = "";
        String resol = "";
        String white = "";
        String sizee = "";
        int me = -1;

        if (peopleMetadata != null) {
            // 기본형(int, double 등)은 null을 가질 수 없으므로, null 체크가 필요 없습니다.
            Iso = peopleMetadata.getIso();
            f = peopleMetadata.getFStop();
            ex = peopleMetadata.getExposureTime();
            lati = peopleMetadata.getGpsLatitude();
            longi = peopleMetadata.getGpsLongitude();
            res = peopleMetadata.getRealResolution();
            resol = peopleMetadata.getResolution();
            white = peopleMetadata.getWhiteBalance();
            sizee = peopleMetadata.getSize();
            me = peopleMetadata.getMetaScore();
        }

        return new PeopleLoadDto(
                Iso,f,ex,lati,longi,res,resol,white,sizee,me
        );

    }
}
