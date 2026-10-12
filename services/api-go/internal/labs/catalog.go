package labs

import _ "embed"

// Catalog is public planning metadata, not evidence of completed labs.
//
//go:embed catalog.json
var Catalog []byte
