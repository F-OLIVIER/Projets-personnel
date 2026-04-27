FROM golang:1.24-alpine

ARG GO_MINIKUBE_IP
ENV CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=amd64 \
    GO_MINIKUBE_IP=${GO_MINIKUBE_IP}


WORKDIR /app
RUN apk add --no-cache gcc musl-dev sqlite-dev

COPY go.mod go.sum ./
RUN go mod tidy
COPY . .
RUN go build -o todoapp ./cmd/main.go
EXPOSE 8080

CMD ["./todoapp"]
