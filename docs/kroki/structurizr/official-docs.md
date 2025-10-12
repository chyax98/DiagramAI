# Structurizr DSL Official Documentation

> **Last Updated**: 2025-10-13
> **Primary Sources**:
> - [Structurizr DSL Documentation](https://docs.structurizr.com/dsl)
> - [Structurizr Official Site](https://structurizr.com/)

---

## Overview

Structurizr DSL is a text-based domain-specific language for creating software architecture diagrams based on the C4 model. It provides "diagrams as code" capabilities with a focus on architecture documentation.

**Key Features**:
- C4 model native support (System Context, Container, Component, Deployment)
- Single model, multiple views
- Workspace extension and composition
- Integration with documentation and ADRs
- Export to PlantUML, Mermaid, D2, DOT

---

## Core Concepts

### 1. Workspace Structure

```structurizr
workspace "Name" "Description" {

  model {
    // Define elements and relationships
  }

  views {
    // Define diagrams
  }

  configuration {
    // Optional settings
  }
}
```

**Key Components**:
- **model**: Elements (people, systems, containers, components) and relationships
- **views**: Diagrams created from the model
- **configuration**: Workspace-level settings

---

## Model Definition

### 2. Elements

#### Person

```structurizr
model {
  user = person "User" "A user of the system" {
    -> softwareSystem "Uses"
  }
}
```

#### Software System

```structurizr
model {
  softwareSystem = softwareSystem "Software System" "Description" {
    webapp = container "Web Application" "Description" "Technology"
    database = container "Database" "Description" "PostgreSQL"
  }
}
```

#### Container

```structurizr
model {
  mySystem = softwareSystem "My System" {
    webApp = container "Web Application" {
      description "Serves HTTP requests"
      technology "Spring Boot"
    }

    api = container "API" "REST API" "Node.js"
    db = container "Database" "Stores data" "PostgreSQL" {
      tags "Database"
    }
  }
}
```

#### Component

```structurizr
model {
  mySystem = softwareSystem "My System" {
    api = container "API" {
      controller = component "Controller" "Handles HTTP" "Spring MVC"
      service = component "Service" "Business logic" "Spring Bean"
      repository = component "Repository" "Data access" "JPA"
    }
  }
}
```

---

### 3. Relationships

#### Basic Syntax

```structurizr
// Explicit relationships
user -> softwareSystem "Uses"
user -> webapp "Interacts with" "HTTPS"

// Implicit relationships (within element block)
person "User" {
  -> softwareSystem "Uses"
}
```

#### Relationship Attributes

```structurizr
user -> system "Uses" "HTTPS" {
  tags "Synchronous"
  url "https://docs.example.com"
  properties {
    "protocol" "HTTPS"
  }
}
```

---

## Views

### 4. System Landscape View

Shows all people and software systems.

```structurizr
views {
  systemLandscape "SystemLandscape" {
    include *
    autoLayout lr
  }
}
```

### 5. System Context View

Shows a specific system and its relationships.

```structurizr
views {
  systemContext softwareSystem "Diagram1" {
    include *
    autoLayout lr
  }
}
```

### 6. Container View

Shows containers within a system.

```structurizr
views {
  container softwareSystem "Diagram2" {
    include *
    autoLayout lr
  }
}
```

### 7. Component View

Shows components within a container.

```structurizr
views {
  component container "Diagram3" {
    include *
    autoLayout lr
  }
}
```

### 8. Deployment View

Shows deployment architecture.

```structurizr
model {
  deploymentEnvironment "Production" {
    deploymentNode "AWS" {
      deploymentNode "EC2" {
        containerInstance webapp
      }

      deploymentNode "RDS" {
        containerInstance database
      }
    }
  }
}

views {
  deployment * "Production" "DeploymentDiagram" {
    include *
    autoLayout lr
  }
}
```

### 9. Dynamic View

Shows runtime behavior and sequence of interactions.

```structurizr
views {
  dynamic softwareSystem "SignIn" "User sign-in flow" {
    user -> webapp "Submits credentials"
    webapp -> database "Validates user"
    database -> webapp "Returns user data"
    webapp -> user "Shows dashboard"

    autoLayout lr
  }
}
```

---

## Advanced Features

### 10. Identifiers

**Flat (default)**:
```structurizr
model {
  user = person "User"
  system = softwareSystem "System"
}
```

**Hierarchical**:
```structurizr
workspace {
  !identifiers hierarchical

  model {
    user = person "User"
    system = softwareSystem "System" {
      webapp = container "Web App"
    }
  }

  views {
    container system {
      include *
    }
  }
}
```

Access: `system.webapp`

---

### 11. Workspace Extension

Extend existing workspaces:

```structurizr
workspace extends "base-workspace.dsl" {
  model {
    !element existingSystem {
      newContainer = container "New Container"
    }
  }

  views {
    container existingSystem "ExtendedView" {
      include *
    }
  }
}
```

---

### 12. Groups

Logical grouping of elements:

```structurizr
model {
  group "Frontend" {
    webApp = softwareSystem "Web Application"
    mobileApp = softwareSystem "Mobile App"
  }

  group "Backend" {
    api = softwareSystem "API"
    database = softwareSystem "Database"
  }
}
```

Groups appear as visual boundaries in diagrams.

---

### 13. Includes

Modular DSL files:

```structurizr
workspace {
  !include model.dsl
  !include views.dsl
  !include styles.dsl
}
```

**model.dsl**:
```structurizr
model {
  user = person "User"
  system = softwareSystem "System"
}
```

---

### 14. Documentation

Attach Markdown/AsciiDoc docs:

```structurizr
workspace {
  model {
    softwareSystem = softwareSystem "System" {
      !docs docs/system
    }
  }
}
```

**Directory structure**:
```
docs/
└── system/
    ├── 01-introduction.md
    ├── 02-architecture.md
    └── 03-deployment.md
```

---

### 15. Architecture Decision Records (ADRs)

```structurizr
workspace {
  model {
    softwareSystem = softwareSystem "System" {
      !adrs adrs/system
    }
  }
}
```

**ADR format** (adr-001-use-microservices.md):
```markdown
# 1. Use Microservices Architecture

Date: 2025-01-15

## Status

Accepted

## Context

We need to scale independently...

## Decision

We will use microservices...

## Consequences

Positive:
- Independent scaling
- Technology diversity

Negative:
- Increased complexity
- Distributed system challenges
```

---

## Styling & Themes

### 16. Element Styles

```structurizr
views {
  styles {
    element "Person" {
      shape Person
      background #08427b
      color #ffffff
    }

    element "Software System" {
      background #1168bd
      color #ffffff
    }

    element "Container" {
      background #438dd5
      color #ffffff
    }

    element "Database" {
      shape Cylinder
    }
  }
}
```

**Available shapes**: `Box`, `RoundedBox`, `Circle`, `Ellipse`, `Hexagon`, `Cylinder`, `Component`, `Person`, `Robot`, `Folder`, `WebBrowser`, `MobileDevicePortrait`, `MobileDeviceLandscape`, `Pipe`

---

### 17. Relationship Styles

```structurizr
views {
  styles {
    relationship "Relationship" {
      thickness 2
      color #707070
      dashed false
    }

    relationship "Asynchronous" {
      dashed true
    }
  }
}
```

---

### 18. Themes

Pre-built styling:

```structurizr
views {
  themes https://static.structurizr.com/themes/amazon-web-services-2023.04.30/theme.json
  themes https://static.structurizr.com/themes/microsoft-azure-2023.01.24/theme.json
}
```

**Popular themes**:
- Amazon Web Services
- Microsoft Azure
- Google Cloud Platform
- Kubernetes

---

## Configuration

### 19. Auto-Layout

```structurizr
views {
  systemContext system {
    include *
    autoLayout lr 200 100
  }
}
```

**Parameters**:
- Direction: `lr` (left-right), `rl`, `tb` (top-bottom), `bt`
- Rank separation: pixels between ranks (default: 300)
- Node separation: pixels between nodes (default: 300)

---

### 20. View Filtering

```structurizr
views {
  // Include specific elements
  systemContext system "Filtered" {
    include user system
    exclude system.internalComponent
  }

  // Filter by expression
  container system "ApiOnly" {
    include "->system.api->"
    autoLayout
  }
}
```

---

### 21. Animation

```structurizr
views {
  systemContext system {
    include *

    animation {
      user
      system
      system.database
    }

    autoLayout
  }
}
```

Creates step-by-step reveal of elements.

---

## Deployment Models

### 22. Deployment Environments

```structurizr
model {
  softwareSystem = softwareSystem "System" {
    webapp = container "Web App"
    database = container "Database"
  }

  deploymentEnvironment "Development" {
    deploymentNode "Developer Laptop" {
      containerInstance webapp
      containerInstance database
    }
  }

  deploymentEnvironment "Production" {
    deploymentNode "AWS" {
      deploymentNode "ECS Cluster" {
        containerInstance webapp
      }

      deploymentNode "RDS" {
        containerInstance database
      }
    }
  }
}
```

---

### 23. Infrastructure Nodes

```structurizr
deploymentEnvironment "Production" {
  deploymentNode "AWS Region" {
    infrastructureNode "Load Balancer" "ALB"
    infrastructureNode "DNS" "Route 53"

    deploymentNode "EC2" {
      containerInstance webapp
    }
  }
}
```

---

## Advanced Modeling

### 24. Implied Relationships

```structurizr
workspace {
  !impliedRelationships true

  model {
    user = person "User"
    system = softwareSystem "System" {
      webapp = container "Web App"
      database = container "Database"
    }

    user -> webapp "Uses"
    webapp -> database "Reads/Writes"
    // user -> system is implied automatically
  }
}
```

---

### 25. Perspectives

Multi-dimensional views:

```structurizr
model {
  system = softwareSystem "System" {
    perspectives {
      "Security" "ISO 27001 compliant"
      "Performance" "< 200ms response time"
    }
  }
}
```

---

### 26. Custom Elements

```structurizr
model {
  customElement = element "External API" {
    description "Third-party service"
    tags "External"
  }

  system -> customElement "Calls"
}

views {
  custom "CustomView" {
    include *
    autoLayout
  }
}
```

---

## Tooling Integration

### 27. Structurizr Lite

Local rendering:

```bash
# Run Structurizr Lite
docker run -it --rm -p 8080:8080 -v $(pwd):/usr/local/structurizr structurizr/lite

# Access at http://localhost:8080
```

---

### 28. Structurizr CLI

```bash
# Validate DSL
structurizr-cli validate -workspace workspace.dsl

# Export to PlantUML
structurizr-cli export -workspace workspace.dsl -format plantuml

# Export to Mermaid
structurizr-cli export -workspace workspace.dsl -format mermaid

# Push to Structurizr cloud
structurizr-cli push -id 123 -key xxx -secret yyy -workspace workspace.dsl
```

---

### 29. Kroki Integration

Structurizr diagrams via Kroki:

```
POST https://kroki.io/structurizr/svg
Content-Type: text/plain

workspace {
  model {
    user = person "User"
    system = softwareSystem "System"
    user -> system "Uses"
  }
  views {
    systemContext system {
      include *
      autoLayout
    }
  }
}
```

---

## Complete Examples

### 30. Full E-commerce System

```structurizr
workspace "E-commerce Platform" {
  !identifiers hierarchical

  model {
    customer = person "Customer"
    admin = person "Administrator"

    ecommerce = softwareSystem "E-commerce System" {
      spa = container "Single-Page App" "React"
      api = container "API" "Node.js + Express"
      db = container "Database" "PostgreSQL" {
        tags "Database"
      }
      cache = container "Cache" "Redis"
    }

    payment = softwareSystem "Payment Gateway" "External" {
      tags "External"
    }

    customer -> ecommerce.spa "Browses products"
    ecommerce.spa -> ecommerce.api "API calls" "HTTPS/JSON"
    ecommerce.api -> ecommerce.db "Reads/Writes"
    ecommerce.api -> ecommerce.cache "Caches"
    ecommerce.api -> payment "Processes payments" "HTTPS"

    deploymentEnvironment "Production" {
      deploymentNode "AWS Cloud" {
        deploymentNode "CloudFront" {
          containerInstance spa
        }

        deploymentNode "ECS Cluster" {
          containerInstance api
        }

        deploymentNode "ElastiCache" {
          containerInstance cache
        }

        deploymentNode "RDS" {
          containerInstance db
        }
      }
    }
  }

  views {
    systemLandscape "Landscape" {
      include *
      autoLayout tb
    }

    systemContext ecommerce "Context" {
      include *
      autoLayout lr
    }

    container ecommerce "Containers" {
      include *
      autoLayout tb
    }

    deployment * "Production" "Deployment" {
      include *
      autoLayout tb
    }

    dynamic ecommerce "Checkout" "Checkout flow" {
      customer -> ecommerce.spa "1. Add to cart"
      ecommerce.spa -> ecommerce.api "2. Create order"
      ecommerce.api -> ecommerce.db "3. Store order"
      ecommerce.api -> payment "4. Process payment"
      ecommerce.api <- payment "5. Confirm"
      ecommerce.api -> ecommerce.db "6. Update status"
      customer <- ecommerce.spa "7. Show confirmation"

      autoLayout lr
    }

    styles {
      element "Person" {
        shape Person
        background #08427b
        color #ffffff
      }

      element "Software System" {
        background #1168bd
        color #ffffff
      }

      element "Container" {
        background #438dd5
        color #ffffff
      }

      element "Database" {
        shape Cylinder
      }

      element "External" {
        background #999999
        color #ffffff
      }
    }

    themes https://static.structurizr.com/themes/amazon-web-services-2023.04.30/theme.json
  }
}
```

---

## Best Practices

1. **Use hierarchical identifiers** for complex models
2. **Define element order explicitly** for consistent layout
3. **Leverage includes** for modular organization
4. **Apply themes** for professional appearance
5. **Document with ADRs** for architectural decisions
6. **Use groups** for logical organization
7. **Create multiple views** from single model
8. **Test with Structurizr Lite** before deploying
9. **Version control DSL files** like code
10. **Export to multiple formats** for flexibility

---

## Resources

- **Official Docs**: https://docs.structurizr.com/dsl
- **Tutorial**: https://docs.structurizr.com/dsl/tutorial
- **Language Reference**: https://docs.structurizr.com/dsl/language
- **Cookbook**: https://docs.structurizr.com/dsl/cookbook
- **CLI**: https://docs.structurizr.com/cli
- **Lite**: https://docs.structurizr.com/lite

---

## License & Support

- **License**: Apache 2.0
- **GitHub**: https://github.com/structurizr
- **Discussions**: https://github.com/structurizr/dsl/discussions
- **Support**: https://docs.structurizr.com/support
