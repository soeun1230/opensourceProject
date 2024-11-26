package iise_capston.imgcloud.service;

import iise_capston.imgcloud.domain.repository.BrisqueMemberRepository;
import iise_capston.imgcloud.member.BrisqueMember;
import iise_capston.imgcloud.member.PeopleImageMember;
import iise_capston.imgcloud.member.ThingImageMember;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.opencv.opencv_core.Scalar;
import org.bytedeco.opencv.opencv_quality.QualityBRISQUE;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.global.opencv_imgcodecs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.nio.ByteBuffer;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class BrisqueService {
    private final String modelPath = "C:/iise_capston/imgcloud2/backend/src/main/resources/brisque/brisque_model_live.yml";
    private final String rangePath = "C:/iise_capston/imgcloud2/backend/src/main/resources/brisque/brisque_range_live.yml";
    private final BrisqueMemberRepository brisqueMemberRepository;

    private Logger logger = LoggerFactory.getLogger(BrisqueService.class);

    private QualityBRISQUE brisque;

    @PostConstruct
    public void initBrisque(){
        this.brisque = QualityBRISQUE.create(modelPath,rangePath);
    }
    @Async
    public CompletableFuture<Scalar> getBrisqueOne(MultipartFile picture) {     //brisque 점수 계산
        try {
            //multipart -> Mat
            byte[] data = picture.getBytes();
            ByteBuffer dataByte = ByteBuffer.wrap(data);
            Mat pic = opencv_imgcodecs.imdecode(new Mat(new BytePointer(dataByte)), opencv_imgcodecs.IMREAD_ANYCOLOR);

            //brisque 계산
            Scalar brisqueScore = brisque.compute(pic);

            return CompletableFuture.completedFuture(brisqueScore);

        } catch (IOException e) {
            logger.error("Error in processing picture", e);
            return CompletableFuture.failedFuture(new RuntimeException("Error in processing picture", e));
        }
    }

    public List<CompletableFuture<Scalar>> getBrisqueAll(List<MultipartFile> pictures){   //여러 장에 대한 brisque 점수 동시 계산
        List<CompletableFuture<Scalar>> brisqueScores = new ArrayList<>();
        for(MultipartFile picture : pictures){
            brisqueScores.add(getBrisqueOne(picture));  //brisque 점수 계산 함수 호출
        }
        return brisqueScores;
    }


//    @Async
//    @Transactional
//    public CompletableFuture<Scalar> getBrisqueOne(MultipartFile picture) throws IOException {
//
//        long startTime = System.currentTimeMillis(); // 시작 시간 기록
//        byte[]data = picture.getBytes();
//        ByteBuffer dataByte = ByteBuffer.wrap(data);
//
//        Mat pic = opencv_imgcodecs.imdecode(new Mat(new BytePointer(dataByte)),opencv_imgcodecs.IMREAD_ANYCOLOR);
//
//        QualityBRISQUE brisque = QualityBRISQUE.create(modelPath,rangePath);
//        Scalar brisqueScore = brisque.compute(pic);
//
//        long endTime = System.currentTimeMillis(); // 끝나는 시간 기록
//        System.out.println("Execution time: " + (endTime - startTime) + " ms"); // 실행 시간 출력
//
//        return CompletableFuture.completedFuture(brisqueScore);
//    }
//
//    public List<CompletableFuture<Scalar>> getBrisqueAll(List<MultipartFile> pictures) throws IOException{
//        List<CompletableFuture<Scalar>> brisqueScores= new ArrayList<>();
//
//        for(int i=0;i<pictures.size();i++){
//            CompletableFuture<Scalar> score = getBrisqueOne(pictures.get(i));
//            brisqueScores.add(score);
//        }
//
//        return brisqueScores;
//    }

    public void saveThingBrisque(ThingImageMember thingImageMember,Integer brisque){
        BrisqueMember brisqueMember = new BrisqueMember();
        brisqueMember.setThingId(thingImageMember);
        brisqueMember.setBrisqueScore(brisque);
        brisqueMemberRepository.save(brisqueMember);

    }
    public void savePeopleBrisque(PeopleImageMember peopleImageMember, Integer brisque){
        BrisqueMember brisqueMember = new BrisqueMember();
        brisqueMember.setPeopleId(peopleImageMember);
        brisqueMember.setBrisqueScore(brisque);
        brisqueMemberRepository.save(brisqueMember);

    }
    public Optional<BrisqueMember> getBrisqueByPeopleImage(PeopleImageMember peopleImageMember) {
        return brisqueMemberRepository.findBypeopleId(peopleImageMember);
    }

    public Optional<BrisqueMember> getBrisqueByThingImage(ThingImageMember thingImageMember) {
        return brisqueMemberRepository.findBythingId(thingImageMember);
    }
}


