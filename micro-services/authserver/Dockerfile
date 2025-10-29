FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/authserver-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9072
ENTRYPOINT ["java", "-jar", "app.jar"]