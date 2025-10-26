# AI Assistant Features

BeeDoc includes an integrated AI-powered writing assistant using OpenRouter to provide intelligent type-ahead suggestions as you write.

## Setup

### 1. Get an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account
3. Generate an API key
4. Copy the key (you'll need it in the next step)

### 2. Enable AI Assistant in BeeDoc

**Option 1: Via Toolbar**
1. Click the 🤖 (robot) button in the toolbar
2. When prompted, paste your OpenRouter API key
3. The AI Assistant is now enabled!

**Option 2: Via Keyboard**
1. Press `Alt+A`
2. Paste your API key when prompted
3. Start writing!

## How It Works

### Type-Ahead Suggestions

Once enabled, the AI Assistant monitors your typing and provides intelligent suggestions:

1. **Start typing** - Write at least 20 characters
2. **Pause briefly** - Wait 1.5 seconds (the AI needs a moment to think)
3. **See suggestions** - A popup appears with AI-generated continuation
4. **Accept or dismiss**:
   - Press `Tab` to accept the suggestion
   - Press `Esc` to dismiss it
   - Keep typing to ignore it

### Smart Context Awareness

The AI Assistant:
- Analyzes the last 500 characters of your text
- Understands your writing style and tone
- Provides 1-2 sentence continuations
- Only suggests when you've paused at a natural break (not mid-word)

## Features

✅ **Smart Type-Ahead** - Contextual writing suggestions
✅ **Auto-Debouncing** - Waits for you to pause before suggesting
✅ **One-Click Accept** - Press Tab to insert suggestion
✅ **Style Matching** - Adapts to your writing tone
✅ **Privacy First** - API key stored locally in browser
✅ **Fast Model** - Uses Meta Llama 3.1 8B (free tier)
✅ **Toggle On/Off** - Enable/disable anytime with Alt+A

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+A` | Toggle AI Assistant on/off |
| `Tab` | Accept current suggestion |
| `Esc` | Dismiss current suggestion |

## Visual Indicators

- **🤖 Active** - Button highlighted when AI is enabled
- **✨ Sparkle** - Icon animates when AI is active
- **Popup** - Blue gradient popup shows suggestions below cursor

## Model Information

**Default Model:** Meta Llama 3.1 8B Instruct (Free)
- Fast response time (~1-2 seconds)
- Good quality suggestions
- Free tier available on OpenRouter
- Optimized for writing assistance

## Privacy & Security

- **API Key Storage**: Stored locally in browser's localStorage
- **No Server Storage**: Your key never touches our servers
- **OpenRouter Only**: Requests go directly to OpenRouter API
- **Context Limit**: Only last 500 characters sent for suggestions
- **HTTPS**: All API requests encrypted

## Troubleshooting

### "Invalid API key" message
- Check that you copied the complete key from OpenRouter
- Verify the key is active at https://openrouter.ai/keys
- Try toggling AI off and on again (Alt+A twice)

### No suggestions appearing
- Make sure AI is enabled (🤖 button should be highlighted)
- Write at least 20 characters
- Pause for 1.5+ seconds after typing
- Check that you're not in the middle of a word

### Suggestions are slow
- This is normal - AI takes 1-3 seconds to generate
- The free model is optimized for speed
- Check your internet connection

### Wrong suggestions
- The AI learns from context - give it more text to work with
- Dismiss unwanted suggestions with Esc
- Keep your writing style consistent for better matching

## Cost

**Free Tier Available!**
- OpenRouter offers free API access to Llama 3.1 8B
- No credit card required for basic usage
- Check [OpenRouter pricing](https://openrouter.ai/docs#models) for details

## Disable AI Assistant

**Temporary (Current Session)**
- Press `Alt+A` to toggle off
- Click the 🤖 button to toggle off

**Permanent**
- Toggle off with Alt+A
- Clear localStorage: `localStorage.removeItem('beedoc-openrouter-key')`

## Advanced

### Change Model (Future)
Currently uses `meta-llama/llama-3.1-8b-instruct:free`

To use a different model, edit `src/scripts/ai-assistant.js`:
```javascript
this.model = 'your-preferred-model';
```

See [OpenRouter Models](https://openrouter.ai/docs#models) for options.

### Adjust Timing
Edit `src/scripts/ai-assistant.js`:
```javascript
this.debounceDelay = 1500; // Change to your preference (milliseconds)
this.minContextLength = 20; // Minimum chars before suggesting
```

## Support

For issues or questions:
1. Check the keyboard shortcuts panel (press `?`)
2. Review this documentation
3. Check browser console for errors (F12)
4. File an issue on GitHub

---

**Powered by OpenRouter** 🚀
Using state-of-the-art AI models to enhance your writing experience.
