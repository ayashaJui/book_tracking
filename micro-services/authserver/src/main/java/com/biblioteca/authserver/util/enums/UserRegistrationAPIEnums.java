package com.biblioteca.authserver.util.enums;

public enum UserRegistrationAPIEnums {
    USER_REGISTRATION_API("register"),
    GET_REGISTERED_USER_INFO_API("get_registered_user_info"),
    VERIFY_EMAIL_OTP_API("verify_email_otp"),
    RESEND_EMAIL_OTP_API("resend_email_otp"),;

    public final String value;

    UserRegistrationAPIEnums(String value) {
        this.value = value;
    }
}
