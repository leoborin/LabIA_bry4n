package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"labai-bry4n.local/api/internal/httpapi"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	n, err := strconv.Atoi(port)
	if err != nil || n < 1 || n > 65535 {
		slog.Error("PORT must be a valid TCP port")
		os.Exit(1)
	}
	webDir := os.Getenv("WEB_DIST")
	if webDir == "" {
		webDir = "../../apps/web/dist"
	}
	srv := &http.Server{
		Addr: "0.0.0.0:" + port, Handler: httpapi.New(webDir),
		ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second,
		WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second,
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	shutdownDone := make(chan struct{})
	go func() {
		<-ctx.Done()
		defer close(shutdownDone)
		shutdown, cancel := context.WithTimeout(context.Background(), 8*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdown); err != nil {
			slog.Error("shutdown failed", "error", err)
		}
	}()
	slog.Info("LabAI bry4n shell listening", "port", port, "version", httpapi.Version)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("HTTP server failed", "error", err)
		os.Exit(1)
	}
	// ListenAndServe returns as shutdown starts; wait for in-flight requests to drain.
	<-shutdownDone
}
