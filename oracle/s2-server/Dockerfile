FROM openjdk:8-jdk as builder
COPY . /project
WORKDIR /project
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

FROM openjdk:8-jre-alpine
COPY --from=builder /project/build/libs/*.jar s2-server.jar
ENTRYPOINT java -jar s2-server.jar
EXPOSE 8180