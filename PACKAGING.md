# Desktop Packaging Guide

This guide explains how to package BeeDoc as a native desktop application for Linux and Windows using Pake.

## Prerequisites

### Install Pake CLI

Pake must be installed globally before building desktop executables:

```bash
# Using npm
npm install -g pake-cli

# Using pnpm
pnpm add -g pake-cli

# Using yarn
yarn global add pake-cli
```

### System Requirements

#### For Linux Builds
- Linux operating system (Ubuntu, Debian, Fedora, etc.)
- Rust toolchain (installed automatically by Pake if needed)
- Build essentials: `build-essential`, `libssl-dev`, `libgtk-3-dev`, `libwebkit2gtk-4.0-dev`

Install dependencies on Ubuntu/Debian:
```bash
sudo apt update
sudo apt install build-essential libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev
```

#### For Windows Builds
- Can be built from Linux using cross-compilation
- Or build on Windows with Rust toolchain installed

## Application Icon

Before building, ensure you have an icon file:

1. Create or obtain a 512x512 PNG icon
2. Save it as `assets/icon.png`
3. The icon should have a transparent background
4. Use a simple, recognizable design (e.g., a bee or document icon)

**Note**: A placeholder icon.png.txt file exists. Replace it with an actual PNG file.

## Building

### Web Version (for testing)

Build the web version to test before packaging:

```bash
pnpm run build:web
```

This creates a `dist/` folder with all files. You can serve this with any web server.

### Linux Desktop Application

Build a Linux executable:

```bash
pnpm run build:linux
```

This creates:
- An AppImage file (portable, runs on most Linux distributions)
- Or a .deb package (for Debian/Ubuntu)

The output will be in the project root directory.

**Output**: `BeeDoc_<version>_amd64.AppImage` or similar

### Windows Desktop Application

Build a Windows executable:

```bash
pnpm run build:windows
```

**Note**: This may require additional setup for cross-compilation from Linux.

The output will be in the project root directory.

**Output**: `BeeDoc_<version>_x64.exe` or similar

## Build Configuration

The build scripts in `package.json` use these Pake options:

- `--name BeeDoc`: Application name
- `--icon assets/icon.png`: Application icon
- `--width 1200`: Default window width
- `--height 800`: Default window height
- `--targets windows`: (Windows build only) Target platform

### Advanced Configuration

You can customize the build by modifying the scripts in `package.json`:

```json
{
  "scripts": {
    "build:linux": "pake src/index.html --name BeeDoc --icon assets/icon.png --width 1200 --height 800 --fullscreen false",
    "build:windows": "pake src/index.html --name BeeDoc --icon assets/icon.png --width 1200 --height 800 --targets windows"
  }
}
```

Additional Pake options:
- `--fullscreen`: Start in fullscreen mode
- `--transparent`: Transparent window
- `--resizable false`: Disable window resizing
- `--always-on-top`: Keep window on top
- `--hide-title-bar`: Hide the title bar

## Testing the Desktop App

### Linux
```bash
# Make executable
chmod +x BeeDoc_*.AppImage

# Run
./BeeDoc_*.AppImage
```

### Windows
Double-click the `.exe` file to run.

## Distribution

### Linux
- **AppImage**: Portable, no installation required
  - Users can download and run directly
  - Recommended for widest compatibility
  
- **DEB Package**: For Debian/Ubuntu users
  - Install with: `sudo dpkg -i BeeDoc_*.deb`

### Windows
- **EXE**: Standalone executable
  - No installation required
  - May trigger Windows SmartScreen (normal for unsigned apps)

## File System Access

The desktop application has full file system access, allowing:
- Native file open/save dialogs
- Direct file system operations
- Better integration with the operating system

## Known Issues

### Linux
- First launch may be slower while Pake initializes
- Some Linux distributions may require additional dependencies

### Windows
- Windows Defender may flag the app (false positive)
- Users may need to click "More info" → "Run anyway"
- Consider code signing for production releases

## Code Signing (Optional)

For production releases, consider code signing:

### Windows
- Obtain a code signing certificate
- Use `signtool` to sign the executable
- Prevents Windows SmartScreen warnings

### macOS (if supporting in future)
- Requires Apple Developer account
- Use `codesign` utility
- Required for distribution outside Mac App Store

## Troubleshooting

### Build Fails
1. Ensure Pake is installed: `pake --version`
2. Check Rust toolchain: `rustc --version`
3. Verify all dependencies are installed
4. Check icon file exists: `ls -la assets/icon.png`

### App Won't Launch
1. Check file permissions (Linux): `chmod +x BeeDoc_*.AppImage`
2. Verify all required libraries are installed
3. Run from terminal to see error messages

### File Operations Don't Work
- Ensure the app has file system permissions
- Check browser console for errors (Pake uses WebView)

## Next Steps

1. Create a proper application icon (512x512 PNG)
2. Test the web version thoroughly
3. Build and test Linux executable
4. Build and test Windows executable
5. Create release notes
6. Distribute via GitHub Releases or other platforms

## Resources

- [Pake Documentation](https://github.com/tw93/pake)
- [Tauri (alternative)](https://tauri.app/)
- [Electron (alternative)](https://www.electronjs.org/)
