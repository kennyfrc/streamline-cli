# Streamline CLI

Command-line interface for the Streamline Icons API. Search, download, and manage icons directly from your terminal.

## What is this?

A TypeScript CLI tool that integrates with the Streamline Icons API, allowing you to search for icons across families, download SVG/PNG files, and get detailed icon information.

## Quick Start

### 1. Install

```bash
npm install -g @kennyfrc/streamline-cli
```

### 2. Configure

```bash
streamline init
```

Edit `~/.config/streamline/config.toml` and add your API key:

```toml
[auth]
apiKey = "your-api-key-here"
```

### 3. Search & Download

```bash
# Find icons
streamline search global "home" --free-only

# Download as SVG
streamline download svg ico_hash --name my-icon

# Download as PNG
streamline download png ico_hash --size 256
```

## Common Usage

### Search Icons

**Global search** (all families):
```bash
streamline search global "user profile"
streamline search global "home" --limit 10 --free-only
```

**Family search** (specific family):
```bash
streamline search family "material-pro-sharp-line" "button"
streamline search family "font-awesome-regular" --limit 5
```

### Download Icons

**SVG format**:
```bash
streamline download svg ico_CVtS8rNWud0BTWe2
streamline download svg ico_hash --name custom-name --responsive
```

**PNG format**:
```bash
streamline download png ico_hash --size 128
streamline download png ico_hash --size 512 --name high-res
```

### Get Icon Details

```bash
streamline get icon ico_CVtS8rNWud0BTWe2
```

## Command Reference

### search

**Global search:**
```bash
streamline search global <query> [options]

Options:
  --limit <n>       Results per page (default: 50, max: 100)
  --offset <n>      Pagination offset (default: 0)
  --free-only       Show only free icons
  --style <name>    Filter by family/style
  --category <name> Filter by category
```

**Family search:**
```bash
streamline search family <familySlug> [query] [options]

Options:
  --limit <n>       Results per page (default: 50, max: 100)
  --offset <n>      Pagination offset (default: 0)
  --free-only       Show only free icons
  --category <name> Filter by category
```

### download

**SVG download:**
```bash
streamline download svg <hash> [options]

Options:
  --output <path>   Output directory (default: current)
  --name <name>     Custom filename (without .svg)
  --responsive      Make SVG responsive
```

**PNG download:**
```bash
streamline download png <hash> [options]

Options:
  --output <path>   Output directory (default: current)
  --name <name>     Custom filename (without .png)
  --size <n>        Size in pixels (default: 512)
```

### get

**Get icon details:**
```bash
streamline get icon <hash>
```

### Other Commands

```bash
streamline init              # Create config file
streamline --help            # Show help
streamline --version         # Show version
```

## Configuration

**Default location:** `~/.config/streamline/config.toml`

**Priority order:**
1. `--api-key` option (highest priority)
2. `STREAMLINE_API_KEY` environment variable
3. Configuration file (default)

**Get API key:** https://www.streamlinehq.com/profile?tab=api_keys

## Requirements

- Node.js 16+
- Streamline Icons API key

## Publishing

Scoped packages publish as private by default on npm. When releasing a new version, run:

```bash
npm publish --access public
```

The package also declares `publishConfig.access = "public"` to guard against the `E402 Payment Required` error.
