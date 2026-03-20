FROM eclipse-temurin:21-jre-alpine AS base
WORKDIR /app
EXPOSE 4000

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY backend/gradle/wrapper ./gradle/wrapper
COPY backend/gradlew ./
RUN chmod +x gradlew
RUN ./gradlew --version --no-daemon

COPY backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src
RUN ./gradlew build -x test -x check --no-daemon

FROM base AS final
COPY --from=build /app/build/libs/test-backend.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
