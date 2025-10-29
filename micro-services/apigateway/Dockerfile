FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/apigateway-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9073
ENTRYPOINT ["java", "-jar", "app.jar"]