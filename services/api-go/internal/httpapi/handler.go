package httpapi

import (
	"encoding/json"
	"io/fs"
	"mime"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"labia.local/api/internal/labs"
)

const Version = "0.1.0-shell"

func New(webDir string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{
			"status": "ok", "service": "labia-api", "version": Version, "phase": "shell",
		})
	})
	mux.HandleFunc("GET /v1/labs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.Write(labs.Catalog)
	})
	mux.HandleFunc("/v1/", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"code": "not_implemented", "message": "Este recurso ainda não está disponível nesta primeira versão.",
		})
	})
	mux.Handle("/", spa(webDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
		mux.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func spa(webDir string) http.Handler {
	files := http.FileServer(http.Dir(webDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"code": "method_not_allowed"})
			return
		}
		clean := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		if clean == "." {
			clean = ""
		}
		if clean != "" && fs.ValidPath(filepath.ToSlash(clean)) {
			if info, err := os.Stat(filepath.Join(webDir, clean)); err == nil && !info.IsDir() {
				if strings.HasPrefix(r.URL.Path, "/assets/") {
					w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
				} else {
					w.Header().Set("Cache-Control", "no-cache")
				}
				if !serveCompressed(w, r, filepath.Join(webDir, clean), info) {
					files.ServeHTTP(w, r)
				}
				return
			}
		}
		// Asset/API typos must not receive a successful HTML fallback.
		if strings.HasPrefix(r.URL.Path, "/assets/") || strings.HasPrefix(r.URL.Path, "/healthz/") || filepath.Ext(r.URL.Path) != "" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Cache-Control", "no-cache")
		if _, err := os.Stat(filepath.Join(webDir, "index.html")); err != nil {
			writeJSON(w, http.StatusServiceUnavailable, map[string]string{"code": "web_not_built", "message": "Frontend ainda não compilado."})
			return
		}
		index := filepath.Join(webDir, "index.html")
		info, _ := os.Stat(index)
		if !serveCompressed(w, r, index, info) {
			http.ServeFile(w, r, index)
		}
	})
}

func serveCompressed(w http.ResponseWriter, r *http.Request, filename string, info os.FileInfo) bool {
	ext := filepath.Ext(filename)
	if ext != ".js" && ext != ".css" && ext != ".html" {
		return false
	}
	w.Header().Add("Vary", "Accept-Encoding")
	accepted := false
	for _, part := range strings.Split(r.Header.Get("Accept-Encoding"), ",") {
		value, params, err := mime.ParseMediaType(strings.TrimSpace(part))
		quality := 1.0
		if q, ok := params["q"]; ok {
			quality, err = strconv.ParseFloat(q, 64)
		}
		if err == nil && value == "gzip" && quality > 0 && quality <= 1 {
			accepted = true
		}
	}
	if !accepted || info == nil {
		return false
	}
	compressed, err := os.Open(filename + ".gz")
	if err != nil {
		return false
	}
	defer compressed.Close()
	w.Header().Set("Content-Encoding", "gzip")
	w.Header().Set("Content-Type", mime.TypeByExtension(ext))
	http.ServeContent(w, r, filepath.Base(filename), info.ModTime(), compressed)
	return true
}
