package com.biblioteca.authserver.controller;

import com.biblioteca.authserver.dto.EmailOtpDTO;
import com.biblioteca.authserver.dto.UserRegistrationDTO;
import com.biblioteca.authserver.dto.UserRegistrationResponseDTO;
import com.biblioteca.authserver.service.UserRegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Objects;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SignupController {
    private final UserRegistrationService userRegistrationService;
    private final Environment environment;

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
                String emailAddress = "";
                if(user != null && user.get("emailAddress") != null){
                    emailAddress = user.get("emailAddress").toString();
                }
                String otpDate = user.get("otpDate").toString();
                int otpRetryCount = (int) user.get("otpRetryCount");

                int retryLimit = Integer.parseInt(Objects.requireNonNull(environment.getProperty("otp.retry.limit")));
                otpRetryCount = retryLimit - otpRetryCount;
                long remainingTime = getDuration(otpDate);
                model.addAttribute("verifyEmailOtp", new EmailOtpDTO(id, emailAddress, "", Long.toString(remainingTime), otpRetryCount));
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

    private long getDuration(String otpDate) {
        Duration duration = Duration.between(LocalDateTime.parse(otpDate), LocalDateTime.now());
        long seconds = duration.toSeconds();
        seconds = seconds < 0 ? 0 : seconds;
        return (60 - seconds) > 0 ? (60 - seconds) : 0;
    }
}
