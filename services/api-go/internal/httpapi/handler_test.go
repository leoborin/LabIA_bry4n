package httpapi

import (
	"bytes"
	"compress/gzip"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPublicCatalogContract(t *testing.T) {
	r := httptest.NewRecorder()
	New(t.TempDir()).ServeHTTP(r, httptest.NewRequest("GET", "/v1/labs", nil))
	if r.Code != http.StatusOK {
		t.Fatalf("status %d", r.Code)
	}
	var catalog struct {
		Version string `json:"version"`
		Phase   string `json:"phase"`
		Labs    []struct {
			Slug      string `json:"slug"`
			Status    string `json:"status"`
			Available bool   `json:"available"`
		} `json:"labs"`
	}
	if err := json.Unmarshal(r.Body.Bytes(), &catalog); err != nil {
		t.Fatal(err)
	}
	if catalog.Version != "v1" || catalog.Phase != "shell" {
		t.Fatalf("invalid contract version")
	}
	wanted := map[string]bool{"backend-events": true, "data-platform": true, "credit-risk": true, "documents-finetuning": true, "rag-agents": true, "jev-classification": true, "reliability-platform": true}
	if len(catalog.Labs) != len(wanted) {
		t.Fatalf("expected 7 labs")
	}
	for _, lab := range catalog.Labs {
		if !wanted[lab.Slug] {
			t.Fatalf("unknown or duplicate slug: %s", lab.Slug)
		}
		delete(wanted, lab.Slug)
		if lab.Available || lab.Status != "planned" {
			t.Fatalf("unfinished lab reported executable: %s", lab.Slug)
		}
	}
}

func TestCompressedHTMLNegotiation(t *testing.T) {
	dir := t.TempDir()
	content := []byte("<!doctype html><title>LabAI bry4n</title>")
	if err := os.WriteFile(filepath.Join(dir, "index.html"), content, 0644); err != nil {
		t.Fatal(err)
	}
	var compressed bytes.Buffer
	gz := gzip.NewWriter(&compressed)
	gz.Write(content)
	gz.Close()
	if err := os.WriteFile(filepath.Join(dir, "index.html.gz"), compressed.Bytes(), 0644); err != nil {
		t.Fatal(err)
	}
	for _, encoding := range []string{"gzip", "br, gzip;q=0.8", "gzip;q=0", "gzip;q=0.0000", "identity"} {
		t.Run(encoding, func(t *testing.T) {
			r := httptest.NewRecorder()
			req := httptest.NewRequest("GET", "/labs/backend-events", nil)
			req.Header.Set("Accept-Encoding", encoding)
			New(dir).ServeHTTP(r, req)
			body := r.Body.Bytes()
			if encoding == "gzip" || encoding == "br, gzip;q=0.8" {
				if r.Header().Get("Content-Encoding") != "gzip" {
					t.Fatal("gzip was not negotiated")
				}
				reader, err := gzip.NewReader(bytes.NewReader(body))
				if err != nil {
					t.Fatal(err)
				}
				defer reader.Close()
				body, err = io.ReadAll(reader)
				if err != nil {
					t.Fatal(err)
				}
			} else if r.Header().Get("Content-Encoding") != "" {
				t.Fatal("sent unacceptable encoding")
			}
			if !bytes.Equal(body, content) || r.Header().Get("Vary") != "Accept-Encoding" || !strings.HasPrefix(r.Header().Get("Content-Type"), "text/html") {
				t.Fatal("incorrect fallback content or headers")
			}
		})
	}
}

func TestShellRoutingAndCacheIsolation(t *testing.T) {
	dir := t.TempDir()
	if err := os.Mkdir(filepath.Join(dir, "assets"), 0755); err != nil {
		t.Fatal(err)
	}
	for path, content := range map[string]string{"index.html": "<!doctype html><title>LabAI bry4n</title>", "assets/app-123.js": "console.log('shell')"} {
		if err := os.WriteFile(filepath.Join(dir, path), []byte(content), 0644); err != nil {
			t.Fatal(err)
		}
	}
	h := New(dir)
	for _, test := range []struct {
		method, path string
		status       int
		cache        string
	}{
		{"GET", "/healthz", 200, "no-store"},
		{"GET", "/v1/labs", 200, "no-store"},
		{"GET", "/labs/backend-events", 200, "no-cache"},
		{"GET", "/assets/app-123.js", 200, "public, max-age=31536000, immutable"},
		{"GET", "/assets/missing.js", 404, ""},
		{"POST", "/v1/labs/backend-events/runs", 404, "no-store"},
		{"GET", "/v1/runs/private-id", 404, "no-store"},
		{"POST", "/labs", 405, "no-store"},
	} {
		t.Run(test.method+test.path, func(t *testing.T) {
			r := httptest.NewRecorder()
			h.ServeHTTP(r, httptest.NewRequest(test.method, test.path, nil))
			if r.Code != test.status {
				t.Fatalf("status %d, want %d", r.Code, test.status)
			}
			if test.cache != "" && r.Header().Get("Cache-Control") != test.cache {
				t.Fatalf("cache policy mismatch")
			}
			if r.Header().Get("X-Content-Type-Options") != "nosniff" {
				t.Fatal("missing nosniff")
			}
			if strings.HasPrefix(test.path, "/v1/") && !strings.Contains(r.Header().Get("Content-Type"), "application/json") {
				t.Fatal("API returned SPA HTML")
			}
		})
	}
}

func TestMissingFrontendIsUnavailable(t *testing.T) {
	r := httptest.NewRecorder()
	New(t.TempDir()).ServeHTTP(r, httptest.NewRequest("GET", "/labs", nil))
	if r.Code != http.StatusServiceUnavailable {
		t.Fatalf("status %d", r.Code)
	}
}
