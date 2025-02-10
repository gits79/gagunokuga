package com.example.gagunokuga_back.user.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendEmail(String email, String authcode) {
        String subject = "Gagunokuga 이메일 인증번호";
        String htmlContent = String.format("""
                <div>
                    <h2>Gagunokuga 이메일 인증</h2>
                    <br>
                    <p>안녕하세요. 요청하신 인증번호를 안내해드립니다.</p>
                    <p></p>
                    <br>
                    <p><strong style="font-size: 24px; color: #000;">인증번호: %s</strong></p>
                    <br>
                    <p>이 인증번호는 5분 동안 유효합니다.</p>
                    </div>
                """, authcode);

        try {
            //mimemessage 생성
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            //이메일 전송
            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("이메일 전송 실패");

        }

    }

    public void sendTempPwd(String email, String tempPwd) {
        String subject = "Gagunokuga 비밀번호 재설정";
        String htmlContent = String.format("""
                <div>
                    <h2>Gagunokuga 비밀번호 재설정</h2>
                    <br>
                    <p>안녕하세요. 귀하의 임시 비밀번호를 안내해드립니다.</p>
                    <p></p>
                    <br>
                    <p><strong style="font-size: 24px; color: #000;">임시비밀번호: %s</strong></p>
                    <br>
                    <p>임시 비밀번호는 반드시 수정 부탁드립니다.</p>
                    </div>
                """, tempPwd);

        try {
            //mimemessage 생성
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            //이메일 전송
            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("이메일 전송 실패");

        }
    }
}
