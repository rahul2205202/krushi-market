package com.krushimarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.krushimarket.model.User;
import com.krushimarket.repository.UserRepository;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;

@RestController
@RequestMapping("/user")
public class ForgotController {

    private String accountSid = "AC18f01ed1701d0e2d48f5515c9d2b7108";

    private String authToken = "0172654d261581c9125fce378bb2b513";

    private String verifyServiceSid = "VAa95e5aef92acabb17f41401eb24a86b8";
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        String phoneNumber = forgotPasswordRequest.getPhoneNumber();

        User user = userRepository.findByPhone(phoneNumber).orElseThrow();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with this phone number.");
        }

        Twilio.init(accountSid, authToken);

        try {
        	Verification verification = Verification.creator(
                    "VAa95e5aef92acabb17f41401eb24a86b8",
                    "+91"+phoneNumber,
                    "sms")
                .create();

            return ResponseEntity.ok(new VerificationResponse(verification.getSid(), "pending")); // Return verification SID

        } catch (Exception e) {
        	System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error initiating verification.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        String phoneNumber = verifyOtpRequest.getPhoneNumber();
        String otp = verifyOtpRequest.getOtp();

        Twilio.init(accountSid, authToken);

        try {
        	VerificationCheck verificationCheck = VerificationCheck.creator(
                    "VAa95e5aef92acabb17f41401eb24a86b8")
                    .setTo("+91"+phoneNumber)
                    .setCode(otp)
                .create();
        	
            if (verificationCheck.getStatus().equals("approved")) {
            	System.out.println("Approved");
                return ResponseEntity.ok(new VerificationResponse(verificationCheck.getSid(), "approved")); // Verification successful
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying OTP.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String phoneNumber = resetPasswordRequest.getPhoneNumber();
        String newPassword = resetPasswordRequest.getNewPassword();
        System.out.println(phoneNumber);
        System.out.println(newPassword);
        User user = userRepository.findByPhone(phoneNumber).orElseThrow();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with this phone number.");
        }
        
        System.out.println(user.getName());
        String hashedPassword = bCryptPasswordEncoder.encode(newPassword);
        System.out.println(hashedPassword);
        user.setPassword(hashedPassword);
        System.out.println(user.getPassword());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public static class ForgotPasswordRequest {
        private String phoneNumber;
        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }

    public static class VerifyOtpRequest {
        private String phoneNumber;
        private String otp;
        // ... (getters and setters)
        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    public static class ResetPasswordRequest {
        private String phoneNumber;
        private String newPassword;
        // ... (getters and setters)

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class VerificationResponse { // For returning verification status
        private String sid;
        private String status;

        public VerificationResponse(String sid, String status) {
            this.sid = sid;
            this.status = status;
        }

        public String getSid() {
            return sid;
        }

        public void setSid(String sid) {
            this.sid = sid;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}