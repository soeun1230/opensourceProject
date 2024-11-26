package imgcloud.oauth.kakao;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import imgcloud.member.OauthMember;
import imgcloud.oauth.OauthId;

import java.time.LocalDateTime;

import static imgcloud.oauth.OauthServerType.KAKAO;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record KakaoMemberResponse(
    Long id,
    boolean hasSignedUp,
    LocalDateTime connectedAt,
    KakaoAccount kakaoAccount
){
    public OauthMember toDomain(){
        return OauthMember.builder()
                .oauthId(new OauthId(KAKAO))
                .nickname(kakaoAccount.profile.nickname)
                .email(kakaoAccount.email)
                .profile(kakaoAccount.profile.profileImageUrl)
                .build();
    }
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public record KakaoAccount(
            boolean profileNeedsAgreement,
            boolean profileNicknameNeedsAgreement,
            boolean profileImageNeedsAgreement,
            Profile profile,
            boolean nameNeedsAgreement,
            String name,
            boolean emailNeedsAgreement,
            boolean isEmailValid,
            boolean isEmailVerified,
            String email,
            LocalDateTime ciAuthenticatedAt
    ){
    }
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public record Profile(
            String nickname,
            String thumbnailImageUrl,
            String profileImageUrl,
            boolean isDefaultImage
    ){

    }
}
