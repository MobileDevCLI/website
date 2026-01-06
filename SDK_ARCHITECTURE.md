# MobileCLI Engine SDK Architecture

**Date:** January 6, 2026
**Version:** 1.0
**Author:** TEST CLAUDE + BUILD CLAUDE collaborative design
**Purpose:** Transform MobileCLI from an app into an embeddable SDK

---

## Vision

Turn MobileCLI into a platform that other developers can embed in their apps:

```
┌─────────────────────────────────────────────────────────────┐
│                    PARTNER'S APP                            │
│  (Game, Productivity Tool, Creative App, Enterprise App)    │
├─────────────────────────────────────────────────────────────┤
│                  MobileCLI Engine SDK                       │
│  ┌───────────┬───────────┬───────────┬───────────────────┐  │
│  │    AI     │  Terminal │   Intent  │   Self-Modify     │  │
│  │   Module  │   Module  │   Module  │     Module        │  │
│  └───────────┴───────────┴───────────┴───────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Android OS                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Structure

```
mobilecli-engine-sdk/
├── engine-core/          # Core runtime (required)
├── engine-terminal/      # Terminal/shell execution
├── engine-ai/            # AI integration (Claude, OpenAI, local)
├── engine-intents/       # Intent execution, URL opening
├── engine-packages/      # Package management (pkg install)
├── engine-selfmod/       # APK modification capabilities
├── engine-filesystem/    # File operations
├── engine-network/       # Network utilities
├── engine-security/      # Encryption, keystore, sandbox
├── sample-apps/          # Example implementations
├── docs/                 # API documentation
└── tools/                # apktool, jadx, smali
```

---

## Key Interfaces

### 1. Terminal Bridge
```kotlin
interface TerminalBridge {
    suspend fun execute(command: String): CommandResult
    fun executeStreaming(command: String, onOutput: (String) -> Unit): Job
    suspend fun executeBatch(commands: List<String>): List<CommandResult>
}
```

### 2. AI Bridge
```kotlin
interface AIBridge {
    suspend fun chat(message: String): AIResponse
    suspend fun chatWithTools(message: String, tools: List<Tool>): AIResponse
    suspend fun generateCode(prompt: String, language: String): CodeResult
}
```

### 3. Intent Executor
```kotlin
interface IntentExecutor {
    fun openUrl(url: String): Boolean
    fun shareText(text: String): Boolean
    fun shareFile(filePath: String, mimeType: String): Boolean
    fun openApp(packageName: String): Boolean
}
```

### 4. Self-Modification Module
```kotlin
interface SelfModModule {
    suspend fun decompile(apkPath: String, outputDir: String): DecompileResult
    suspend fun recompile(sourceDir: String, outputApk: String): RecompileResult
    suspend fun sign(apkPath: String, keystorePath: String): SignResult
    suspend fun addClass(sourceCode: String, targetApkDir: String): AddClassResult
}
```

---

## Developer Integration

### Minimal (Terminal + AI)
```kotlin
dependencies {
    implementation("com.mobilecli:engine-core:1.0.0")
    implementation("com.mobilecli:engine-terminal:1.0.0")
    implementation("com.mobilecli:engine-ai:1.0.0")
}

// Initialize
MobileCLIEngine.initialize(this, EngineConfig(
    aiProvider = AIProvider.CLAUDE,
    aiApiKey = "sk-ant-..."
))

// Use
val result = engine.terminal.execute("ls -la")
val response = engine.ai.chat("Write a haiku")
```

### Full Integration
```kotlin
dependencies {
    implementation("com.mobilecli:engine-full:1.0.0")
}

MobileCLIEngine.initialize(this, EngineConfig(
    aiProvider = AIProvider.CLAUDE,
    aiApiKey = BuildConfig.CLAUDE_API_KEY,
    enableSelfModification = true,
    bootstrapPackages = listOf("python", "nodejs", "git")
))
```

---

## Implementation Status

| Module | Status | Notes |
|--------|--------|-------|
| engine-core | 70% | BootstrapInstaller needs extraction |
| engine-terminal | 60% | Session management exists |
| engine-intents | **DONE** | AmSocketServer in v54 |
| engine-ai | 0% | New module needed |
| engine-packages | 30% | Shell scripts exist |
| engine-selfmod | 40% | install-apk-tools in v55 |
| engine-filesystem | 20% | Basic ops exist |
| engine-network | 10% | curl available |
| engine-security | 30% | Keystore setup in v55 |

---

## Critical Challenge: Package Name

Termux binaries have hardcoded RUNPATH:
```
/data/data/com.termux/files/usr/lib
```

**Options:**
1. Partner apps use `com.termux.*` namespace
2. Recompile binaries with configurable RUNPATH
3. Use proot/chroot for filesystem virtualization
4. Runtime patching of library paths

---

## Size Estimates

| Module | Size |
|--------|------|
| engine-core | ~2 MB |
| engine-terminal | ~500 KB |
| engine-ai | ~200 KB |
| engine-intents | ~100 KB |
| engine-packages | ~100 KB |
| engine-selfmod | ~300 KB |
| Bootstrap (compressed) | ~50 MB |
| **Total** | **~55 MB** |

---

## Revenue Model

1. **Free Tier**: engine-core + engine-terminal
2. **Pro Tier** ($99/mo): + engine-ai + engine-packages
3. **Enterprise** (custom): + engine-selfmod + source access

---

## Priority Order

1. engine-core (foundation)
2. engine-terminal (shell execution)
3. engine-intents (URL fix - already done)
4. engine-ai (AI integration)
5. engine-packages (package management)
6. engine-filesystem (file operations)
7. engine-selfmod (advanced)
8. engine-security (hardening)

---

*This document represents the architectural vision for MobileCLI as a platform.*
*© 2026 MobileDevCLI. All rights reserved.*
