package com.biblioteca.authserver.controller;

import com.biblioteca.authserver.dto.*;
import com.biblioteca.authserver.service.UserRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.HashMap;
import java.util.Objects;
import java.util.Optional;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SignupController {
    private final UserRegistrationService userRegistrationService;
    private final Environment environment;

    private static final DateTimeFormatter FLEXIBLE_FORMATTER =
            new DateTimeFormatterBuilder()
                    .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
                    .optionalStart()
                    .appendFraction(ChronoField.NANO_OF_SECOND, 1, 9, false)
                    .optionalEnd()
                    .toFormatter();

    @GetMapping("/signup")
    public String signup(Model model) {
        model.addAttribute("userRegistrationDTO", new UserRegistrationDTO());
        return "signup";
    }

    @PostMapping("/signup")
    public String registerUser(UserRegistrationDTO userRegistrationDTO, Model model, RedirectAttributes redirectAttributes) {
        log.info("SignupController UserRegistrationDTO is called with: {}", userRegistrationDTO.toString());

        try{
            UserRegistrationResponseDTO responseDTO = userRegistrationService.registerUser(userRegistrationDTO).block();

            if(responseDTO == null){
                model.addAttribute("userRegistrationDTO", userRegistrationDTO);
                model.addAttribute("error", "Registration failed. Please try again.");
                return "signup";
            }

            if (responseDTO.getCode() == 201){
                HashMap<String, Object> user = (HashMap<String, Object>) responseDTO.getData();
                String authUserId = "";
                if(user != null && user.get("id") != null){
                    authUserId = user.get("id").toString();
                }

                Integer.parseInt(authUserId);

                redirectAttributes.addAttribute("id", authUserId);
                return "redirect:/otp-page";
            }else{
                model.addAttribute("userRegistrationDTO", userRegistrationDTO);
                model.addAttribute("error", responseDTO.getMessage());
                return "signup";
            }

        }catch(Exception e){
            log.error("Error during user registration: {}", e.getMessage());
            model.addAttribute("userRegistrationDTO", userRegistrationDTO);
            model.addAttribute("error", "Registration failed. Please try again.");
            return "signup";
        }
    }

    @GetMapping("/otp-page")
    public String otpPage(@RequestParam int id, Model model) {
        log.info("SignupController OTP Page is called with id: {}", id);

        if(id <= 0){
            model.addAttribute("emailOtpDTO", new EmailOtpDTO());
            model.addAttribute("errorMessage", "Invalid user ID. Please register again.");
            return "signup";
        }

        try{
            UserRegistrationResponseDTO responseDTO = userRegistrationService.getRegisteredUserInfo(id).block();



            if(responseDTO == null ){
                model.addAttribute("emailOtpDTO", new EmailOtpDTO());
                model.addAttribute("error", "Failed to fetch user details. Please register again.");
                return "signup";
            }

            if(responseDTO.getCode() == 200){
                HashMap<String, Object> user = (HashMap<String, Object>) responseDTO.getData();
                log.info("Response from getRegisteredUserInfo: {}", user);
                String emailAddress = "";
                if(user != null && user.get("emailAddress") != null){
                    emailAddress = user.get("emailAddress").toString();
                }
                String otpDate = user.get("otpDate").toString();
                int otpRetryCount = (int) user.get("otpRetryCount");

                int retryLimit = Integer.parseInt(Objects.requireNonNull(environment.getProperty("otp.retry.limit")));
                otpRetryCount = retryLimit - otpRetryCount;

                long remainingTime = getDuration(otpDate);

                model.addAttribute("emailOtpDTO", new EmailOtpDTO(id, emailAddress, "", Long.toString(remainingTime), otpRetryCount));
            }else{
                model.addAttribute("emailOtpDTO", new EmailOtpDTO());
                model.addAttribute("error", responseDTO.getMessage());
            }
            return "otp-page";
        }catch(Exception e){
            log.error("Error during fetching incomplete user details: {}", e.getMessage());
            model.addAttribute("emailOtpDTO", new EmailOtpDTO());
            model.addAttribute("errorMessage", "Something went wrong. Please try again.");
            return "otp-page";
        }
    }

    @PostMapping("/otp-page")
    public String verifyOtp(@ModelAttribute @Valid EmailOtpDTO verifyEmailOTPDTO, Model model, RedirectAttributes redirectAttributes) {
        log.info("SignupController verifyOtp is called with: {}", verifyEmailOTPDTO.getAuthUserId());

        try{
            UserRegistrationResponseDTO responseDTO = userRegistrationService.verifyEmailOtp(verifyEmailOTPDTO).block();

            if(responseDTO != null){
                if(responseDTO.getCode() == 200){
                    HashMap<String, Object> user = (HashMap<String, Object>) responseDTO.getData();
                    int authUserId = (Integer) user.get("id");
                    redirectAttributes.addAttribute("id", authUserId);
                    return "redirect:/status";
                }else {
                    model.addAttribute("emailOtpDTO", verifyEmailOTPDTO);
                    model.addAttribute("error", responseDTO.getMessage());
                    return "otp-page";
                }
            }else{
                model.addAttribute("emailOtpDTO", verifyEmailOTPDTO);
                model.addAttribute("error", "OTP verification failed. Please try again.");
                return "otp-page";
            }

        }catch(Exception e){
            log.error("Error during OTP verification: {}", e.getMessage());
            model.addAttribute("emailOtpDTO", verifyEmailOTPDTO);
            model.addAttribute("error", "OTP verification failed. Please try again.");
            return "otp-page";
        }
    }

    @PostMapping("/resend_email_otp")
    public ResponseEntity<ResponseDTO<String>> resendOtp(@RequestBody @Valid ResendOTPRequestDTO resendOTPRequestDTO) {
        log.info("SignupController resendOtp is called with: {}", resendOTPRequestDTO.toString());

        try{
            UserRegistrationResponseDTO responseDTO = userRegistrationService.resendEmailOtp(resendOTPRequestDTO).block();

            if(Optional.ofNullable(responseDTO).isEmpty()){
                log.error("Empty Response for email resend otp request");
                return new ResponseEntity<>(new ResponseDTO<>(null, "Failed", HttpStatus.INTERNAL_SERVER_ERROR.value()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }else{
                return new ResponseEntity<>(new ResponseDTO<>("OTP resent", "Success", HttpStatus.OK.value()), HttpStatus.OK);
            }

        }catch(Exception e){
            log.error("Error during resending OTP: {}", e.getMessage());
            return new ResponseEntity<>(new ResponseDTO<>("error", "Failed", HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status")
    public String status(@ModelAttribute("message") String message, @ModelAttribute("action")  String action, Model model){
        model.addAttribute("status", message);
        model.addAttribute("action", action);
        return "status";
    }

    private long getDuration(String otpDate) {
//        Duration duration = Duration.between(LocalDateTime.parse(otpDate), LocalDateTime.now());
//        log.info("Duration: {}", duration);
//        long seconds = duration.toSeconds();
//        log.info("Seconds: {}", seconds);
//        seconds = seconds < 0 ? 0 : seconds;
//        log.info("Seconds: {}", seconds);
//        return (60 - seconds) > 0 ? (60 - seconds) : 0;
        DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
                .appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true) // allow 0–9 fraction digits
                .toFormatter();

        LocalDateTime createdAt = LocalDateTime.parse(otpDate, formatter);

        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long elapsedSeconds = duration.toSeconds();

        long validityPeriod = 120; // 2 minutes
        long remaining = validityPeriod - elapsedSeconds;

        return remaining > 0 ? remaining : 0;

    }
}
