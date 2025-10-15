# SeqDiag Syntax Rules

> **Purpose**: Complete syntax reference for SeqDiag diagrams
> **Audience**: Developers and AI systems generating SeqDiag code

---

## Basic Structure

### Diagram Block

```seqdiag
seqdiag {
  // diagram content
}
```

**Rules**:

- Must start with `seqdiag {` keyword
- Must end with closing brace `}`
- Case-insensitive: `seqdiag` or `SEQDIAG` both work
- Braces must be balanced

---

## Elements (Actors/Lifelines)

### Declaration

**Implicit Declaration** (recommended):

```seqdiag
seqdiag {
  A -> B;  // A and B are auto-declared
}
```

**Explicit Declaration** (for ordering):

```seqdiag
seqdiag {
  browser; webserver; database;  // Defines order
  browser -> webserver;
}
```

### Naming Rules

- **Valid Characters**: Letters, numbers, underscores
- **Case-Sensitive**: `Browser` ≠ `browser`
- **No Spaces**: Use underscores instead (`web_server`)
- **Reserved Words**: Avoid `label`, `return`, etc.

**Examples**:

```seqdiag
seqdiag {
  // Valid names
  user; web_server; API; db_1;

  // Invalid names (avoid)
  // web server;  // spaces not allowed
  // user-1;      // hyphens not allowed
}
```

---

## Edges (Interactions)

### Edge Syntax

```
source -> destination [attributes];
source <- destination [attributes];
```

### Edge Types

| Symbol | Type                | Description                |
| ------ | ------------------- | -------------------------- |
| `->`   | Normal              | Solid arrow left-to-right  |
| `<-`   | Return              | Solid arrow right-to-left  |
| `-->`  | Dotted              | Dotted arrow left-to-right |
| `<--`  | Dotted Return       | Dotted arrow right-to-left |
| `->>`  | Async               | Async solid arrow          |
| `<<-`  | Async Return        | Async solid return         |
| `-->>` | Async Dotted        | Async dotted arrow         |
| `<<--` | Async Dotted Return | Async dotted return        |
| `=>`   | Auto-Return         | Auto-generates return edge |

### Self-Reference

```seqdiag
seqdiag {
  A -> A [label = "self call"];
}
```

---

## Edge Attributes

### Basic Attributes

**label** - Edge description:

```seqdiag
seqdiag {
  A -> B [label = "request"];
}
```

**return** - Used with `=>` for auto-return label:

```seqdiag
seqdiag {
  A => B [label = "call", return = "response"];
}
```

### Visual Attributes

**color** - Edge color (since v0.2.2):

```seqdiag
seqdiag {
  A -> B [label = "success", color = green];
  A -> C [label = "error", color = red];
}
```

**Available colors**:

- Named colors: `red`, `green`, `blue`, `orange`, `yellow`, `purple`, `pink`, `brown`, `gray`, `black`, `white`
- Hex colors: `#FF0000`, `#00FF00`, etc.

**diagonal** - Diagonal edge:

```seqdiag
seqdiag {
  A -> B [diagonal, label = "async"];
}
```

**failed** - Error indication (since v0.5.0):

```seqdiag
seqdiag {
  A -> B [label = "timeout", failed];
}
```

### Notes

**note** - Right-side note (since v0.6.0):

```seqdiag
seqdiag {
  A -> B [note = "HTTP GET"];
}
```

**leftnote** - Left-side note:

```seqdiag
seqdiag {
  A -> B [leftnote = "validate"];
}
```

**rightnote** - Right-side note (explicit):

```seqdiag
seqdiag {
  A -> B [rightnote = "cache hit"];
}
```

**Multi-line notes**:

```seqdiag
seqdiag {
  A -> B [note = "Line 1\nLine 2\nLine 3"];
}
```

---

## Nested Sequences

### Syntax

```seqdiag
seqdiag {
  A => B [label = "process"] {
    B => C [label = "step 1"];
    B => D [label = "step 2"];
  }
}
```

**Rules**:

- Only works with auto-return edges (`=>`)
- Maximum one level of nesting
- Inner edges must use same lifeline as outer target

---

## Separators

**Since v0.5.0**

### Standard Separator

```seqdiag
seqdiag {
  A -> B;
  === Section Title ===
  C -> D;
}
```

### Delay Separator

```seqdiag
seqdiag {
  A -> B;
  ... Time passes ...
  C -> D;
}
```

**Rules**:

- Must be on separate line
- Text is optional
- Separators affect all lifelines

---

## Diagram-Level Attributes

### Syntax

```seqdiag
seqdiag {
  attribute = value;
  // edges here
}
```

### Available Attributes

**edge_length** - Horizontal spacing (default: 192):

```seqdiag
seqdiag {
  edge_length = 300;
  A -> B;
}
```

**span_height** - Vertical spacing (default: 40):

```seqdiag
seqdiag {
  span_height = 80;
  A -> B;
}
```

**default_fontsize** - Font size (default: 11):

```seqdiag
seqdiag {
  default_fontsize = 14;
  A -> B [label = "text"];
}
```

**activation** - Activity line display (since v0.5.0):

```seqdiag
seqdiag {
  activation = none;  // hide activity lines
  A -> B;
}
```

**autonumber** - Auto-number edges (since v0.5.0):

```seqdiag
seqdiag {
  autonumber = True;
  A -> B [label = "first"];
  B -> C [label = "second"];
}
```

**default_note_color** - Default note background (since v0.6.0):

```seqdiag
seqdiag {
  default_note_color = lightblue;
  A -> B [note = "info"];
}
```

---

## Comments

### Single-Line Comments

```seqdiag
seqdiag {
  // This is a comment
  A -> B;  // End-of-line comment
}
```

### Multi-Line Comments

```seqdiag
seqdiag {
  /*
   * Multi-line
   * comment block
   */
  A -> B;
}
```

---

## String Literals

### Quoting Rules

**Optional quotes** (no spaces):

```seqdiag
seqdiag {
  A -> B [label = request];  // OK
}
```

**Required quotes** (with spaces):

```seqdiag
seqdiag {
  A -> B [label = "HTTP request"];  // Required
}
```

**Escape sequences**:

```seqdiag
seqdiag {
  A -> B [label = "Line 1\nLine 2"];      // Newline
  A -> B [label = "Quote: \"text\""];     // Escaped quote
  A -> B [label = "Path: C:\\Users"];     // Backslash
}
```

---

## Complete Syntax Examples

### Minimal Diagram

```seqdiag
seqdiag {
  A -> B;
}
```

### Full-Featured Diagram

```seqdiag
seqdiag {
  // Global settings
  edge_length = 300;
  span_height = 80;
  default_fontsize = 14;
  activation = none;
  autonumber = True;
  default_note_color = lightyellow;

  // Element order
  client; server; database; cache;

  // Interactions
  client -> server [label = "GET /api/users"];
  server -> cache [label = "check cache",
                   leftnote = "cache key: users"];
  server <- cache [label = "miss", failed];

  === Database Query ===

  server -> database [label = "SELECT * FROM users"];
  server <- database [rightnote = "200 rows"];

  ... Process Results ...

  server -> cache [label = "store result",
                   color = green];
  server <- cache;

  client <- server [label = "200 OK",
                    note = "JSON response\n{users: [...]}"];
}
```

---

## Syntax Errors to Avoid

### Common Mistakes

**1. Missing braces**:

```seqdiag
// ❌ Wrong
seqdiag
  A -> B;

// ✅ Correct
seqdiag {
  A -> B;
}
```

**2. Semicolon placement**:

```seqdiag
// ❌ Wrong
seqdiag {
  A -> B
}

// ✅ Correct
seqdiag {
  A -> B;
}
```

**3. Unquoted strings with spaces**:

```seqdiag
// ❌ Wrong
A -> B [label = HTTP request];

// ✅ Correct
A -> B [label = "HTTP request"];
```

**4. Invalid attribute names**:

```seqdiag
// ❌ Wrong
A -> B [text = "message"];  // 'text' not valid

// ✅ Correct
A -> B [label = "message"];
```

**5. Nested separators**:

```seqdiag
seqdiag {
  A => B {
    // ❌ Wrong - separator inside nested block
    === Title ===
    B -> C;
  }
}
```

**6. Multiple auto-return paths**:

```seqdiag
// ❌ Wrong - confusing
A => B => C => D;

// ✅ Correct - explicit nesting
A => B [label = "outer"] {
  B => C [label = "inner"];
}
```

---

## Best Practices

1. **Always use semicolons** after edge declarations
2. **Quote labels with spaces** to avoid parsing errors
3. **Declare element order explicitly** for consistent layout
4. **Use meaningful names** for lifelines and labels
5. **Comment complex interactions** for maintainability
6. **Limit nesting depth** to one level
7. **Use separators** to group related interactions
8. **Choose appropriate edge types** (solid vs dotted, sync vs async)
9. **Apply colors consistently** for error/success states
10. **Test with minimal examples** before adding complexity

---

## Grammar Reference (EBNF-style)

```
diagram        ::= "seqdiag" "{" diagram_body "}"
diagram_body   ::= (attribute | element | edge | separator | comment)*

element        ::= IDENTIFIER ";"
attribute      ::= IDENTIFIER "=" value ";"
edge           ::= IDENTIFIER edge_type IDENTIFIER ("[" attrs "]")? ("{"
 edge_list "}")? ";"

edge_type      ::= "->" | "<-" | "-->" | "<--" | "->>" | "<<-" | "-->>" | "<<--" | "=>"
separator      ::= "===" STRING "===" | "..." STRING "..."

attrs          ::= attr ("," attr)*
attr           ::= IDENTIFIER ("=" value)?
value          ::= STRING | NUMBER | BOOLEAN | COLOR
```

---

## Reference Links

- [BlockDiag Official Examples](http://blockdiag.com/en/seqdiag/examples.html)
- [SeqDiag GitHub](https://github.com/blockdiag/seqdiag)
- [Kroki SeqDiag Support](https://kroki.io/#support)
