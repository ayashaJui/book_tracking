FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/serviceregistry-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9071
ENTRYPOINT ["java", "-jar", "app.jar"]
