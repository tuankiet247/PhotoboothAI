# Changelog

All notable changes to AI Photobooth - Thiên Mã Nghinh Xuân will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-30

### Added
- ✨ **Initial Release** - First version of AI Photobooth
- 📸 **Camera Capture** - Capture photos directly from webcam
- 📤 **Image Upload** - Upload images from device
- 🤖 **AI Processing** - Transform images to Vietnamese ink painting style using OpenRouter API
- 📱 **QR Code Generation** - Generate QR codes for easy download on mobile devices
- 🖼️ **Gallery** - View all processed images in a grid layout
- 🌸 **Falling Petals Animation** - Decorative cherry/peach blossom petals falling effect
- 🐎 **Floating Horse Animation** - Animated Thiên Mã (Heavenly Horse) mascot
- 🎨 **Tet Theme UI** - Red and gold color scheme with traditional Vietnamese aesthetics
- 📊 **Loading States** - Beautiful loading animations during AI processing
- ⚠️ **Error Handling** - User-friendly error messages
- 🎯 **Responsive Design** - Works on desktop and mobile devices
- 🔧 **Backend API** - FastAPI backend with image processing services
- 📝 **System Prompt** - Customizable AI behavior through system_prompt.txt
- 🚀 **Setup Scripts** - Batch files for easy setup on Windows
- 📖 **Documentation** - Comprehensive README, QUICKSTART, FEATURES guides

### Backend Features
- FastAPI REST API
- Image upload and processing
- OpenRouter API integration
- QR code generation
- File storage system
- CORS middleware
- Error handling
- Image compression and optimization

### Frontend Features
- React 18 with hooks
- Vite build tool
- TailwindCSS styling
- Lucide React icons
- Axios for API calls
- Camera access via getUserMedia
- File upload with validation
- Real-time preview
- Animated transitions
- Gallery view
- Download functionality

### Developer Experience
- Environment variables configuration
- Separate dev/prod configs
- Hot reload for development
- API documentation (FastAPI Swagger)
- Type hints in Python
- Component-based architecture
- Utility functions
- Constants management

### Documentation
- README.md - Main documentation
- QUICKSTART.md - Quick start guide
- FEATURES.md - Detailed features list
- OPENROUTER_GUIDE.md - How to get API key
- CHANGELOG.md - This file

### Configuration
- .env.example with detailed comments
- Configurable AI models
- Adjustable image quality settings
- CORS configuration
- Server host/port settings

---

## [Unreleased]

### Planned for v1.1
- 🔄 Camera flip (front/back)
- 🎨 Multiple AI models selection
- 🖼️ Custom filters/effects
- 📱 Direct social media sharing
- 🗑️ Delete images from gallery
- 📦 Batch download
- 🌐 Multi-language support (EN/VI)

### Planned for v1.2
- 👤 User authentication
- ☁️ Cloud storage integration
- 💾 Database integration (PostgreSQL)
- 📊 Admin dashboard
- 📈 Usage analytics
- 🔔 Notifications
- 💬 Comments on images

### Planned for v2.0
- 🎭 Advanced image effects
- 🖨️ Print integration
- 📱 PWA (Progressive Web App)
- 🌍 CDN integration
- 🔒 Enhanced security
- 💳 Payment integration
- 🏢 Multi-tenant support
- 📧 Email delivery
- 🎁 Templates library

---

## Version History

### Format
```
## [Version] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

---

**Note**: Dates are in ISO 8601 format (YYYY-MM-DD)
