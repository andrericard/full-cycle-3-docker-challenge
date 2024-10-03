FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod init fullcycle-go
RUN go build -o main .

FROM scratch
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]
