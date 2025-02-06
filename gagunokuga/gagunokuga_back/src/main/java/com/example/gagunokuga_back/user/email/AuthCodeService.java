package com.example.gagunokuga_back.user.email;

import com.example.gagunokuga_back.user.dto.UserRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
public class AuthCodeService {

    private final EmailService emailService;
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final Map<String, String> authCodeMap = new ConcurrentHashMap<>(); //이메일& 발급된 인증번호        /*공부*/
    private final Map<String, LocalDateTime> authCodeExpireMap = new ConcurrentHashMap<>(); //발급된 인증번호& 만료시간
    private final Map<String, ScheduledFuture<?>> scheduledTask = new ConcurrentHashMap<>(); //이메일& 만료작업 스케쥴링


    public String sendAuthCode(UserRequestDto userRequestDto) {

        String email = userRequestDto.getEmail();
        // 이전 인증번호 만료 작업 취소
        cancelScheduledTask(email);

        String authCode = generateCode();
        LocalDateTime expireTime = LocalDateTime.now().plusMinutes(5); //만료시간 설정

        authCodeMap.put(email, authCode);
        authCodeExpireMap.put(email, expireTime); //맵에 저장

        emailService.sendEmail(email, authCode); //인증번호 발송

        ScheduledFuture<?> scheduled = threadPoolTaskScheduler.schedule(() -> removeAuthCode(email),
                Date.from(expireTime.atZone(ZoneId.systemDefault()).toInstant()));

        scheduledTask.put(email, scheduled);
        return authCode;
    }

    //인증번호 만료되면 삭제시키기
    private void removeAuthCode(String email) {
        authCodeMap.remove(email);
        authCodeExpireMap.remove(email);
        scheduledTask.remove(email);
    }


    //스케쥴러 취소
    private void cancelScheduledTask(String email) {
        ScheduledFuture<?> scheduled = scheduledTask.remove(email);
        if (scheduled != null) {
            scheduled.cancel(true); //기존 예약된 작업 취소
        }
    }

    //6자리 인증번호 생성
    private String generateCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }


    //인증번호 검증
    public boolean verifyAuthCode(UserRequestDto userRequestDto) {
        String email = userRequestDto.getEmail();
        String authCode = userRequestDto.getAuthcode();

        String storedAuthCode = authCodeMap.get(email);
        LocalDateTime expireTime = authCodeExpireMap.get(email);

        if(storedAuthCode ==null || !storedAuthCode.equals(authCode) || expireTime.isBefore(LocalDateTime.now())) {
            return false;
        }

        removeAuthCode(email);
        return true;
    }
}
