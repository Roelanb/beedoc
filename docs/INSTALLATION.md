# BeeDoc Installation Guide

Complete installation instructions for all platforms.

---

## Table of Contents

1. [Web Version](#web-version)
2. [Linux Installation](#linux-installation)
3. [Windows Installation](#windows-installation)
4. [Building from Source](#building-from-source)
5. [Troubleshooting](#troubleshooting)

---

## Web Version

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)

### Access
1. Open your browser
2. Navigate to the BeeDoc URL
3. Start using immediately - no installation needed!

### Advantages
- No installation required
- Always up-to-date
- Works on any platform
- No disk space used

### Limitations
- Requires internet connection
- File operations use browser APIs
- May have storage limitations

---

## Linux Installation

### Supported Distributions
- Ubuntu 20.04+
- Debian 10+
- Linux Mint 20+
- Other Debian-based distributions

### Prerequisites
None! The .deb package includes all dependencies.

### Installation Steps

#### Method 1: Using dpkg (Recommended)

```bash
# Download the package
wget https://github.com/yourusername/beedoc/releases/download/v0.1.0/beedoc_1.0.0_amd64.deb

# Install
sudo dpkg -i beedoc_1.0.0_amd64.deb

# If dependencies are missing, fix with:
sudo apt-get install -f
```

#### Method 2: Using apt

```bash
# If you have a local .deb file
sudo apt install ./beedoc_1.0.0_amd64.deb
```

#### Method 3: Using GDebi (GUI)

```bash
# Install GDebi if not present
sudo apt install gdebi

# Install BeeDoc
sudo gdebi beedoc_1.0.0_amd64.deb
```

Or use the GUI:
1. Double-click the .deb file
2. Software Center opens
3. Click "Install"
4. Enter password
5. Wait for installation

### Launching BeeDoc

#### From Terminal
```bash
pake-beedoc
```

**Note**: The executable is named `pake-beedoc` (not just `beedoc`)

#### From Application Menu
1. Open application menu
2. Search for "BeeDoc"
3. Click to launch

#### Create Desktop Shortcut
```bash
# Copy desktop file
cp /usr/share/applications/beedoc.desktop ~/Desktop/

# Make executable
chmod +x ~/Desktop/beedoc.desktop
```

### Uninstallation

```bash
# Remove BeeDoc
sudo apt remove beedoc

# Remove configuration files too
sudo apt purge beedoc
```

### File Locations

- **Executable**: `/usr/bin/pake-beedoc`
- **Application Files**: `/usr/share/beedoc/`
- **Desktop Entry**: `/usr/share/applications/beedoc.desktop`
- **Icon**: `/usr/share/icons/hicolor/*/apps/beedoc.png`

---

## Windows Installation

### Requirements
- Windows 10 or Windows 11
- 64-bit system
- 100MB free disk space

### Installation Steps

#### Method 1: Installer (Recommended)

1. Download `BeeDoc-Setup-0.1.0.exe`
2. Double-click to run
3. If Windows SmartScreen appears:
   - Click "More info"
   - Click "Run anyway"
4. Follow installation wizard
5. Click "Finish"

#### Method 2: Portable Version

1. Download `BeeDoc-0.1.0-portable.zip`
2. Extract to desired location
3. Run `BeeDoc.exe`
4. No installation needed!

### Launching BeeDoc

#### From Start Menu
1. Click Start
2. Type "BeeDoc"
3. Click to launch

#### From Desktop
Double-click the BeeDoc icon

#### From File Explorer
Navigate to installation folder and run `BeeDoc.exe`

### Uninstallation

#### Using Control Panel
1. Open Control Panel
2. Programs → Uninstall a program
3. Find "BeeDoc"
4. Click "Uninstall"
5. Follow prompts

#### Using Settings
1. Open Settings
2. Apps → Apps & features
3. Find "BeeDoc"
4. Click "Uninstall"

### File Locations

- **Program Files**: `C:\Program Files\BeeDoc\`
- **User Data**: `C:\Users\YourName\AppData\Local\BeeDoc\`
- **Desktop Shortcut**: `C:\Users\YourName\Desktop\BeeDoc.lnk`

---

## Building from Source

### Prerequisites

#### All Platforms
- Node.js 16+ and npm/pnpm
- Git

#### Linux Build Requirements
```bash
sudo apt install build-essential libssl-dev libgtk-3-dev \
  libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev
```

#### Windows Build Requirements
- Rust toolchain
- Visual Studio Build Tools

### Build Steps

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/beedoc.git
cd beedoc
```

#### 2. Install Dependencies
```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

#### 3. Install Pake CLI
```bash
# Using npm
npm install -g pake-cli

# Using pnpm
pnpm add -g pake-cli
```

#### 4. Build Web Version
```bash
npm run build:web
# Output in dist/ folder
```

#### 5. Build Linux Desktop
```bash
npm run build:linux
# Output: beedoc_1.0.0_amd64.deb
```

#### 6. Build Windows Desktop
```bash
npm run build:windows
# Output: BeeDoc.exe
```

### Development Mode

```bash
# Start development server
npm run dev

# Open browser to http://localhost:8080
```

---

## Troubleshooting

### Linux Issues

#### "Package architecture doesn't match system"
**Problem**: Trying to install 32-bit on 64-bit or vice versa

**Solution**: Download the correct architecture:
- `amd64` for 64-bit systems
- `i386` for 32-bit systems (if available)

#### "Dependency is not satisfiable"
**Problem**: Missing system dependencies

**Solution**:
```bash
sudo apt-get update
sudo apt-get install -f
```

#### "Permission denied" when launching
**Problem**: Executable doesn't have execute permission

**Solution**:
```bash
chmod +x /usr/bin/beedoc
```

#### Application doesn't start
**Problem**: Missing libraries

**Solution**:
```bash
# Check for missing libraries
ldd /usr/bin/beedoc

# Install missing dependencies
sudo apt install libwebkit2gtk-4.1-0
```

### Windows Issues

#### "Windows protected your PC"
**Problem**: SmartScreen warning for unsigned app

**Solution**:
1. Click "More info"
2. Click "Run anyway"
3. This is normal for unsigned applications

**Note**: For production, consider code signing

#### "Application failed to start"
**Problem**: Missing Visual C++ Redistributable

**Solution**:
Download and install:
- Visual C++ Redistributable 2015-2022
- Available from Microsoft website

#### "Can't save files"
**Problem**: Permission issues

**Solution**:
1. Run as Administrator (right-click → Run as administrator)
2. Or save to Documents folder instead of Program Files

### General Issues

#### Application is slow
**Solutions**:
- Disable animations (✨ button)
- Close other applications
- Check system resources
- Update graphics drivers

#### Files won't open
**Solutions**:
- Check file extension (.md or .markdown)
- Verify file isn't corrupted
- Try opening in text editor first
- Check file permissions

#### Can't export HTML/PDF
**Solutions**:
- Check browser permissions
- Ensure popup blocker isn't blocking download
- Try different browser
- Check available disk space

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10 / Ubuntu 20.04 / macOS 10.15
- **RAM**: 2GB
- **Disk**: 100MB free space
- **Display**: 1024x768

### Recommended Requirements
- **OS**: Windows 11 / Ubuntu 22.04 / macOS 12+
- **RAM**: 4GB+
- **Disk**: 500MB free space
- **Display**: 1920x1080 or higher

---

## Updates

### Checking for Updates

#### Linux
```bash
# Check current version
beedoc --version

# Update via package manager
sudo apt update
sudo apt upgrade beedoc
```

#### Windows
- Check for updates in the application
- Or download latest installer from website

### Automatic Updates
Currently not supported. Check GitHub releases for new versions.

---

## Getting Help

### Documentation
- [User Guide](USER_GUIDE.md)
- [Quick Start](QUICK_START.md)
- [README](../README.md)

### Support
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Email: support@beedoc.example.com

---

## License

BeeDoc is released under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Last Updated**: October 25, 2024  
**Version**: 0.1.0
