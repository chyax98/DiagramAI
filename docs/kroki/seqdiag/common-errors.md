# SeqDiag Common Errors & Troubleshooting

> **Purpose**: Comprehensive error guide for SeqDiag diagram generation
> **Last Updated**: 2025-10-13

---

## Syntax Errors

### 1. Missing Semicolons

**Error Message**: `Syntax error at line X`

**Problem**:
```seqdiag
seqdiag {
  A -> B [label = "request"]  // ❌ Missing semicolon
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B [label = "request"];  // ✅ Semicolon added
}
```

**Prevention**: Always end edge declarations with semicolons

---

### 2. Unbalanced Braces

**Error Message**: `Unexpected end of file` or `Syntax error`

**Problem**:
```seqdiag
seqdiag {
  A -> B;
  // ❌ Missing closing brace
```

**Solution**:
```seqdiag
seqdiag {
  A -> B;
}  // ✅ Closing brace added
```

**Debug Tip**: Count opening `{` and closing `}` - they must match

---

### 3. Unquoted Strings with Spaces

**Error Message**: `Syntax error at line X`

**Problem**:
```seqdiag
seqdiag {
  A -> B [label = HTTP request];  // ❌ Spaces without quotes
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B [label = "HTTP request"];  // ✅ Quotes added
}
```

**Rule**: Always quote strings containing:
- Spaces
- Special characters
- Newlines (`\n`)

---

### 4. Invalid Attribute Names

**Error Message**: `Unknown attribute: <name>`

**Problem**:
```seqdiag
seqdiag {
  A -> B [text = "message"];      // ❌ 'text' is invalid
  A -> B [description = "info"];  // ❌ 'description' is invalid
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B [label = "message"];     // ✅ Use 'label'
  A -> B [note = "info"];         // ✅ Use 'note'
}
```

**Valid Attributes**:
- `label`, `return`
- `note`, `leftnote`, `rightnote`
- `color`, `diagonal`, `failed`

---

### 5. Invalid Edge Types

**Error Message**: `Syntax error` or unexpected token

**Problem**:
```seqdiag
seqdiag {
  A <-> B;   // ❌ Bidirectional not supported
  A --> B;   // ❌ Wrong arrow direction
  A == B;    // ❌ Invalid operator
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B;    // ✅ Left to right
  A <- B;    // ✅ Right to left (return)
  A --> B;   // ✅ Dotted edge
}
```

**Valid Edge Types**: `->`, `<-`, `-->`, `<--`, `->>`, `<<-`, `-->>`, `<<--`, `=>`

---

## Semantic Errors

### 6. Undefined Elements

**Error Message**: Element ordering issues or missing lifelines

**Problem**:
```seqdiag
seqdiag {
  // Elements used but not defined
  A -> B;
  C -> D;
  // Order is: A, B, C, D (automatic)
}
```

**Solution** (explicit ordering):
```seqdiag
seqdiag {
  // Define order explicitly
  browser; webserver; database;

  browser -> webserver;
  webserver -> database;
}
```

**Best Practice**: Declare all elements at the beginning for predictable layout

---

### 7. Nested Sequence Errors

**Error Message**: Nesting not allowed or syntax error

**Problem**:
```seqdiag
seqdiag {
  // ❌ Wrong: Using -> instead of =>
  A -> B [label = "call"] {
    B -> C;
  }
}
```

**Solution**:
```seqdiag
seqdiag {
  // ✅ Use => for auto-return edges
  A => B [label = "call"] {
    B => C [label = "nested"];
  }
}
```

**Rules**:
- Only `=>` edges can have nested blocks
- Maximum one level of nesting
- Inner edges must involve the target element

---

### 8. Auto-Return Without Label

**Error Message**: May render but look incorrect

**Problem**:
```seqdiag
seqdiag {
  A => B;  // ❌ No return label specified
}
```

**Solution**:
```seqdiag
seqdiag {
  A => B [label = "request", return = "response"];  // ✅ Both labels
}
```

**Tip**: Always provide both `label` and `return` for clarity

---

## Attribute Errors

### 9. Color Not Recognized

**Error Message**: Invalid color or no visible effect

**Problem**:
```seqdiag
seqdiag {
  A -> B [color = "light-green"];  // ❌ Hyphenated not supported
  A -> C [color = "#GGGGGG"];      // ❌ Invalid hex
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B [color = lightgreen];     // ✅ Named color (no quotes)
  A -> C [color = "#00FF00"];      // ✅ Valid hex
}
```

**Valid Colors**:
- Named: `red`, `green`, `blue`, `lightblue`, `orange`, etc.
- Hex: `#RRGGBB` format

---

### 10. Failed Attribute Misuse

**Error Message**: Attribute not supported (pre-v0.5.0)

**Problem**:
```seqdiag
seqdiag {
  A -> B [failed = true];  // ❌ Boolean not needed
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B [failed];         // ✅ Flag attribute (no value)
}
```

**Note**: Requires SeqDiag v0.5.0+

---

### 11. Note Position Errors

**Error Message**: Note not displaying correctly

**Problem**:
```seqdiag
seqdiag {
  A -> B [note = "text", leftnote = "other"];  // ❌ Conflicting
}
```

**Solution** (choose one):
```seqdiag
seqdiag {
  // Option 1: Default right-side note
  A -> B [note = "text"];

  // Option 2: Explicit left note
  A -> C [leftnote = "text"];

  // Option 3: Both sides (different edges)
  A -> D [leftnote = "left text"];
  A <- D [rightnote = "right text"];
}
```

---

## Configuration Errors

### 12. Invalid Diagram Attributes

**Error Message**: Unknown attribute or no effect

**Problem**:
```seqdiag
seqdiag {
  edge_width = 300;        // ❌ Wrong attribute name
  default_color = red;     // ❌ Not a diagram attribute
}
```

**Solution**:
```seqdiag
seqdiag {
  edge_length = 300;       // ✅ Correct name
  default_note_color = lightblue;  // ✅ Note-specific
}
```

**Valid Diagram Attributes**:
- `edge_length`, `span_height`
- `default_fontsize`
- `activation`, `autonumber`
- `default_note_color`

---

### 13. Activation Not Hiding

**Error Message**: Activity lines still visible

**Problem**:
```seqdiag
seqdiag {
  activation = false;  // ❌ Wrong value
  A -> B;
}
```

**Solution**:
```seqdiag
seqdiag {
  activation = none;   // ✅ Use 'none'
  A -> B;
}
```

**Note**: Requires SeqDiag v0.5.0+

---

### 14. Autonumber Not Working

**Error Message**: Numbers not appearing

**Problem**:
```seqdiag
seqdiag {
  autonumber = 1;      // ❌ Should be boolean
  A -> B;
}
```

**Solution**:
```seqdiag
seqdiag {
  autonumber = True;   // ✅ Boolean value (capital T)
  A -> B;
  A <- B;
}
```

**Note**: Requires SeqDiag v0.5.0+

---

## Font & Rendering Errors

### 15. Font Not Found

**Error Message**: `Font not found` or text rendering issues

**Problem**: TrueType font not installed or not detected

**Solutions**:

**Option 1: Command-line**
```bash
seqdiag -f /path/to/font.ttf diagram.diag
```

**Option 2: Config file** (`~/.blockdiagrc`)
```ini
[seqdiag]
fontpath = /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf
```

**Option 3: Install fonts**
```bash
# Ubuntu/Debian
sudo apt-get install fonts-dejavu-core

# macOS
# Fonts are usually in /Library/Fonts/
```

---

### 16. Unicode/UTF-8 Issues

**Error Message**: Encoding error or garbled text

**Problem**:
```python
# Wrong: File not saved as UTF-8
```

**Solution**:
```seqdiag
seqdiag {
  // Ensure file is saved as UTF-8
  用户 -> 服务器 [label = "请求"];
  用户 <- 服务器 [label = "响应"];
}
```

**Fix**:
- Save file with UTF-8 encoding
- Specify encoding in Python: `open('file.diag', encoding='utf-8')`

---

### 17. SVG Output Issues

**Error Message**: SVG not rendering correctly

**Problem**: Missing dependencies or unsupported features

**Solution**:
```bash
# Ensure all dependencies installed
pip install seqdiag[svg]

# Generate with explicit format
seqdiag -Tsvg diagram.diag
```

**Note**: Some fonts may not embed correctly in SVG

---

## Separator Errors

### 18. Separator in Nested Block

**Error Message**: Syntax error or unexpected behavior

**Problem**:
```seqdiag
seqdiag {
  A => B {
    === Section ===  // ❌ Not allowed in nested blocks
    B -> C;
  }
}
```

**Solution**:
```seqdiag
seqdiag {
  A => B;

  === Section ===  // ✅ Use at top level only

  C -> D;
}
```

---

### 19. Invalid Separator Syntax

**Error Message**: Syntax error

**Problem**:
```seqdiag
seqdiag {
  A -> B;
  == Title ==      // ❌ Only 2 equals
  === Title =      // ❌ Unbalanced
}
```

**Solution**:
```seqdiag
seqdiag {
  A -> B;
  === Title ===    // ✅ Three equals, balanced
  ... Delay ...    // ✅ Three dots, balanced
}
```

---

## Kroki-Specific Errors

### 20. Encoding Issues

**Error Message**: 400 Bad Request from Kroki

**Problem**: Incorrect encoding of diagram text

**Solution**:
```python
import pako  # JavaScript compression library
import base64

# Correct encoding:
# 1. Deflate compression (level 9)
# 2. Base64 URL-safe encoding
compressed = pako.deflate(diagram_text, level=9)
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')
```

**Kroki URL Format**:
```
https://kroki.io/seqdiag/svg/<base64url_encoded>
```

---

### 21. CORS Errors in Browser

**Error Message**: CORS policy blocked

**Problem**: Direct browser access to Kroki

**Solution**: Use server-side proxy
```javascript
// ❌ Wrong: Direct browser call
fetch('https://kroki.io/seqdiag/svg/...')

// ✅ Correct: Use proxy
fetch('/api/kroki/seqdiag/svg/...')
```

---

## Debugging Strategies

### General Approach

1. **Start Minimal**: Begin with simplest working diagram
2. **Add Incrementally**: Add one feature at a time
3. **Check Syntax**: Verify braces, semicolons, quotes
4. **Test Locally**: Use command-line before integrating
5. **Check Version**: Ensure SeqDiag version supports features

### Validation Checklist

```bash
# 1. Syntax validation
seqdiag --validate diagram.diag

# 2. Generate with verbose output
seqdiag -v diagram.diag

# 3. Try different formats
seqdiag -Tpng diagram.diag
seqdiag -Tsvg diagram.diag

# 4. Check with minimal example
echo 'seqdiag { A -> B; }' | seqdiag -Tsvg -o test.svg -
```

### Common Fixes

**Reset to basics**:
```seqdiag
seqdiag {
  A -> B;  // If this works, problem is elsewhere
}
```

**Isolate features**:
```seqdiag
seqdiag {
  // Test one feature at a time
  default_fontsize = 14;  // Does this work?
  A -> B [color = red];   // Does this work?
}
```

**Check dependencies**:
```bash
pip show seqdiag
pip show blockdiag
pip show funcparserlib
```

---

## Error Recovery Patterns

### Pattern 1: Syntax Error Recovery

```seqdiag
seqdiag {
  // If you get syntax error:
  // 1. Check last line edited
  // 2. Verify semicolons
  // 3. Check brace balance
  // 4. Quote all strings with spaces

  A -> B [label = "test"];  // Working baseline
}
```

### Pattern 2: Visual Error Recovery

```seqdiag
seqdiag {
  // If diagram renders but looks wrong:
  // 1. Check element order declaration
  // 2. Verify edge directions
  // 3. Test with activation = none
  // 4. Adjust spacing attributes

  browser; webserver; database;  // Explicit order
  edge_length = 200;             // Adjust spacing
}
```

### Pattern 3: Feature Not Working

```seqdiag
seqdiag {
  // If feature doesn't work:
  // 1. Check SeqDiag version (seqdiag --version)
  // 2. Review feature introduction version
  // 3. Try equivalent older syntax
  // 4. Upgrade if needed

  // Example: autonumber requires v0.5.0+
  autonumber = True;
}
```

---

## Prevention Best Practices

1. **Use a linter** or syntax highlighter if available
2. **Test incrementally** - don't write entire diagram at once
3. **Keep examples** of working patterns
4. **Document versions** used in production
5. **Validate before deploying** to avoid runtime errors
6. **Use comments** to mark complex sections
7. **Follow naming conventions** consistently
8. **Quote by default** when in doubt
9. **Check compatibility** with target renderer (Kroki, etc.)
10. **Maintain fallback diagrams** for critical documentation

---

## Quick Reference Card

### Syntax Checklist

- [ ] Diagram starts with `seqdiag {`
- [ ] Diagram ends with `}`
- [ ] All edges end with `;`
- [ ] Strings with spaces are quoted
- [ ] Braces are balanced
- [ ] Valid attribute names used
- [ ] Valid edge types used
- [ ] Element order declared if important
- [ ] Color values are valid
- [ ] Version compatibility checked

### When to Use What

| Feature | Use Case | Syntax |
|---------|----------|--------|
| Basic edge | Simple interaction | `A -> B;` |
| Return edge | Response | `A <- B;` |
| Dotted edge | Optional/async | `A --> B;` |
| Auto-return | Request-response pair | `A => B [label="x", return="y"];` |
| Note | Additional info | `[note="text"]` |
| Separator | Section break | `=== Title ===` |
| Color | Highlight state | `[color=red]` |
| Failed | Error indication | `[failed]` |

---

## External Resources

- [BlockDiag Issues](https://github.com/blockdiag/seqdiag/issues)
- [Kroki Troubleshooting](https://docs.kroki.io/)
- [Stack Overflow: seqdiag tag](https://stackoverflow.com/questions/tagged/seqdiag)
