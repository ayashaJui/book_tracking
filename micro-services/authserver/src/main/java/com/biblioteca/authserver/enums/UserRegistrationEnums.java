package com.biblioteca.authserver.enums;

public enum UserRegistrationEnums {
    REGISTER("register"),
    VERIFY_EMAIL("verify_email_otp"),
    RESEND_EMAIL_OTP("resend_email_otp");

    public final String value;

    UserRegistrationEnums(String value) {
        this.value = value;
    }
}
