FROM node:22.21.0-alpine@sha256:bd26af08779f746650d95a2e4d653b0fd3c8030c44284b6b98d701c9b5eb66b9 AS web-build
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY apps/web/index.html apps/web/tsconfig.json apps/web/vite.config.ts ./
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/scripts ./scripts
RUN npm run build

FROM golang:1.27.2-alpine@sha256:f92b6ef800e499660581efdabdf25d9d817a9d124eaf900924f0504e7e27e12d AS api-build
WORKDIR /app
COPY services/api-go/go.mod ./
COPY services/api-go/cmd ./cmd
COPY services/api-go/internal ./internal
RUN go test ./... && CGO_ENABLED=0 go build -buildvcs=false -trimpath -ldflags="-s -w" -o /out/labai-bry4n ./cmd/api

FROM scratch
COPY --from=api-build /out/labai-bry4n /labai-bry4n
COPY --from=web-build /app/dist /web
ENV PORT=8080 WEB_DIST=/web
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/labai-bry4n"]
