package com.example.gagunokuga_back.user.email;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthCodeService {

    private final EmailService emailService;
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final Map<String, String> authCodeMap = new HashMap<>(); //이메일& 발급된 인증번호        /*공부*/
    private final Map<String, LocalDateTime> authCodeExpireMap = new HashMap<>(); //발급된 인증번호& 만료시간
    private final Map<String, ScheduledFuture<?>> scheduledTask = new HashMap<>(); //이메일& 만료작업 스케쥴링


    public String sendAuthCode(String email) {

        // 이전 인증번호 만료 작업 취소
        cancelScheduledTask(email);


        String authCode = generateCode();
        LocalDateTime expireTime = LocalDateTime.now().plusMinutes(5); //만료시간 설정
        authCodeMap.put(email, authCode);
        authCodeExpireMap.put(email, expireTime); //맵에 저장

        emailService.sendEmail(email, authCode); //인증번호 발송

        ScheduledFuture<?> scheduled = threadPoolTaskScheduler.schedule(() -> removeAuthCode(email),
                new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5)));

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
            scheduledTask.remove(email);
        }
    }

    //6자리 인증번호 생성
    private String generateCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }


    //인증번호 검증
    public boolean verifyAuthCode(String email, String authCode) {
        if(!authCodeMap.containsKey(email)) { //이메일 없음
            return false;
        }
        if(!authCodeMap.get(email).equals(authCode)) { //인증번호 불일치
            return false;
        }
        if(authCodeExpireMap.get(email).isBefore(LocalDateTime.now())) { //인증번호 만료
            return false;
        }

        removeAuthCode(email);
        return true;
    }
}
