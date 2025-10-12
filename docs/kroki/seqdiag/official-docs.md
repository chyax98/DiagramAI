# SeqDiag Official Documentation

> **Last Updated**: 2025-10-13
> **Primary Sources**:
> - [BlockDiag Official Site](http://blockdiag.com/en/seqdiag/)
> - [SeqDiag GitHub Repository](https://github.com/blockdiag/seqdiag)

---

## Overview

SeqDiag is a sequence diagram generator that creates diagram images from simple text specifications. It is part of the BlockDiag family of diagram tools.

**Project Status**: Mature (Last major update: December 2021)

---

## Core Features

### 1. Basic Capabilities

- **Sequence Diagram Generation**: Convert DOT-like text to sequence diagrams
- **Multilingual Support**: UTF-8 encoding for internationalization
- **Output Formats**: PNG, SVG, PDF support
- **Sphinx Integration**: Native sphinxcontrib-seqdiag extension

### 2. Edge Types

```seqdiag
seqdiag {
  // Normal edges
  A -> B [label = "normal edge"];
  B --> C [label = "dotted edge"];

  // Return edges
  B <-- C [label = "return dotted edge"];
  A <- B [label = "return edge"];

  // Asynchronous edges
  A ->> B [label = "asynchronous edge"];
  B -->> C [label = "asynchronous dotted edge"];

  // Return asynchronous edges
  B <<-- C [label = "return async dotted edge"];
  A <<- B [label = "return async edge"];

  // Self-reference
  A -> A [label = "self reference"];
}
```

### 3. Edge Attributes

**Available since v0.2.2 (color), v0.5.0 (failed)**

```seqdiag
seqdiag {
  // Edge labels
  A -> B [label = "call"];
  A <- B [label = "return"];

  // Diagonal edges
  A -> B [diagonal, label = "diagonal edge"];

  // Colored edges
  A -> B [label = "colored", color = red];

  // Failed edges (error indication)
  A -> B [label = "failed", failed];
}
```

### 4. Auto-Return and Nested Sequences

```seqdiag
seqdiag {
  // Auto return edge
  A => B [label = "call", return = "return"];

  // Nested auto return
  A => B => C [label = "call", return = "return"];

  // Nested sequence blocks
  A => B [label = "nested call"] {
    B => C [label = "call 1"];
    B => D [label = "call 2"];
    B => E [label = "call 3"];
  }
}
```

### 5. Separators

**Available since v0.5.0**

```seqdiag
seqdiag {
  A -> B;

  // Standard separator
  === Separator line ===

  A -> B;

  // Delay separator
  ... Delay line ...

  A -> B;
}
```

### 6. Edge Notes

**Available since v0.6.0**

```seqdiag
seqdiag {
  // Right-side note (default)
  browser -> webserver [note = "request\nGET /"];

  // Explicit left/right notes
  browser -> webserver [leftnote = "send request"];
  browser <- webserver [rightnote = "send response"];
}
```

---

## Diagram Attributes

### Global Configuration

**Available since v0.2.0 (basic), v0.5.0 (activation/autonumber), v0.6.0 (default_note_color)**

```seqdiag
seqdiag {
  // Edge metrics
  edge_length = 300;      // default: 192
  span_height = 80;       // default: 40

  // Font settings
  default_fontsize = 16;  // default: 11

  // Activity line control
  activation = none;      // hide activity lines

  // Auto-numbering
  autonumber = True;      // number edges automatically

  // Note styling
  default_note_color = lightblue;

  browser -> webserver [label = "GET /index.html"];
  browser <-- webserver [note = "Apache works!"];
}
```

---

## Element Ordering

**IMPORTANT**: SeqDiag sorts elements by the order they first appear in the diagram definition.

```seqdiag
seqdiag {
  // Define element order explicitly
  browser; database; webserver;

  // Edges will use the defined order
  browser -> webserver [label = "GET /index.html"];
  webserver -> database [label = "SELECT"];
  webserver <- database;
  browser <- webserver;
}
```

---

## Installation & Setup

### Requirements

- Python 3.7 or later
- blockdiag >= 3.0
- funcparserlib >= 0.3.6
- Pillow (for image rendering)
- reportlab (optional, for PDF)
- wand + ImageMagick (optional)

### Installation

```bash
# Using pip
pip install seqdiag

# Using easy_install
easy_install seqdiag
```

### Font Configuration

SeqDiag requires TrueType fonts for text rendering.

**Option 1: Command-line**
```bash
seqdiag -f /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf diagram.diag
```

**Option 2: Configuration file** (`$HOME/.blockdiagrc`)
```ini
[seqdiag]
fontpath = /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf
```

---

## Usage

### Basic Command-Line Usage

```bash
# Generate PNG (default)
seqdiag diagram.diag

# Generate SVG
seqdiag -Tsvg diagram.diag

# Generate PDF
seqdiag -Tpdf diagram.diag

# Specify output file
seqdiag -o output.png diagram.diag
```

### Sphinx Integration

Install the Sphinx extension:
```bash
pip install sphinxcontrib-seqdiag
```

Add to `conf.py`:
```python
extensions = ['sphinxcontrib.seqdiag']
```

Use in reStructuredText:
```rst
.. seqdiag::

   seqdiag {
     browser -> webserver [label = "GET /"];
     browser <- webserver;
   }
```

---

## Complete Example

```seqdiag
seqdiag {
  // Configuration
  edge_length = 300;
  span_height = 80;
  default_fontsize = 14;
  autonumber = True;

  // Define element order
  browser; webserver; database;

  // Request flow
  browser -> webserver [label = "GET /index.html"];
  browser <-- webserver;

  // Comment submission
  === Form Submission ===

  browser -> webserver [label = "POST /comment"];
  webserver -> database [label = "INSERT",
                         leftnote = "validate data"];
  webserver <-- database;
  browser <-- webserver [rightnote = "success response"];

  // Error case
  ... Error Scenario ...

  browser -> webserver [label = "POST /invalid"];
  webserver -> database [label = "INSERT", failed];
  webserver <-- database [failed];
  browser <-- webserver [label = "400 Bad Request",
                         color = red,
                         failed];
}
```

---

## Advanced Features

### 1. Diagonal Edges
```seqdiag
seqdiag {
  A -> B [diagonal, label = "async call"];
}
```

### 2. Edge Colors
```seqdiag
seqdiag {
  A -> B [label = "success", color = green];
  A -> C [label = "error", color = red];
  A -> D [label = "warning", color = orange];
}
```

### 3. Multi-line Labels
```seqdiag
seqdiag {
  A -> B [label = "Line 1\nLine 2\nLine 3"];
}
```

### 4. Complex Notes
```seqdiag
seqdiag {
  A -> B [note = "Multi-line\nnote with\ndetails"];
  A <- B [leftnote = "Left", rightnote = "Right"];
}
```

---

## Kroki Integration

SeqDiag is fully supported by Kroki. Use the `/seqdiag/` endpoint:

```
https://kroki.io/seqdiag/svg/<encoded_diagram>
```

**Encoding**: Deflate + Base64URL encoding

**Example URL Structure**:
```
POST /seqdiag/svg
Content-Type: text/plain

seqdiag {
  browser -> webserver;
  browser <-- webserver;
}
```

---

## Limitations & Considerations

1. **Font Requirement**: Must have TrueType fonts installed
2. **Element Order**: Cannot reorder elements after first appearance
3. **Return Edges**: Auto-return (`=>`) only works with immediate responses
4. **Nested Blocks**: Limited to one level of nesting
5. **Python Version**: Requires Python 3.7+ (older versions no longer supported)

---

## Changelog Highlights

- **v3.0.0** (2021-12): Updated for blockdiag 3.0 compatibility
- **v0.6.0**: Added edge notes (leftnote/rightnote)
- **v0.5.0**: Added separators, activation control, autonumber
- **v0.2.2**: Added edge color attribute
- **v0.2.0**: Added diagram-level attributes

---

## License

Apache License 2.0

---

## References

- [Official Documentation](http://blockdiag.com/en/seqdiag/)
- [GitHub Repository](https://github.com/blockdiag/seqdiag)
- [PyPI Package](https://pypi.org/project/seqdiag/)
- [Sphinx Extension](https://pypi.org/project/sphinxcontrib-seqdiag/)
- [BlockDiag Family](http://blockdiag.com/en/)
