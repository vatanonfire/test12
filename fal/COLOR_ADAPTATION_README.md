# Dynamic Color Adaptation System

## Overview

The Dynamic Color Adaptation System automatically adjusts text colors based on background colors to ensure optimal contrast and readability across the application. This system follows accessibility best practices and provides a consistent user experience.

## Features

### 🎨 **Automatic Contrast Detection**
- Automatically detects background colors
- Applies appropriate text colors for optimal readability
- Supports light, dark, and colored backgrounds

### 👤 **Username Highlighting**
- Usernames always appear in a distinct blue color
- Maintains visibility regardless of background
- Consistent branding across the application

### 📱 **Responsive Design**
- Works seamlessly on desktop and mobile
- Maintains readability across all screen sizes
- PWA-optimized for mobile applications

### ♿ **Accessibility Compliance**
- Meets WCAG AA contrast requirements
- Ensures text is readable for all users
- Supports screen readers and assistive technologies

## Components

### 1. AdaptiveText Component

The main component for automatic text color adaptation:

```tsx
import AdaptiveText from './components/AdaptiveText';

// Basic usage
<AdaptiveText backgroundClass="bg-white">
  This text will be dark on white background
</AdaptiveText>

// Username styling
<AdaptiveText backgroundClass="bg-blue-50" isUsername={true}>
  John Doe
</AdaptiveText>

// With variant
<AdaptiveText backgroundClass="bg-gray-100" variant="secondary">
  Secondary text
</AdaptiveText>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Text content to display |
| `className` | string | '' | Additional CSS classes |
| `backgroundClass` | string | '' | Background color class for contrast calculation |
| `isUsername` | boolean | false | Whether this is a username (always blue) |
| `variant` | 'primary' \| 'secondary' \| 'accent' | 'primary' | Text variant for different emphasis levels |

### 2. useAdaptiveTextColor Hook

Custom hook for programmatic color determination:

```tsx
import { useAdaptiveTextColor } from './components/AdaptiveText';

function MyComponent() {
  const textColor = useAdaptiveTextColor('bg-white', false);
  
  return (
    <span className={textColor}>
      Dynamic colored text
    </span>
  );
}
```

### 3. Utility Functions

```tsx
import { getContrastTextColor } from './components/AdaptiveText';

const textColor = getContrastTextColor('bg-yellow-500');
// Returns: 'text-white'
```

## Color Logic

### Background Color Detection

The system automatically detects background colors and applies appropriate text colors:

#### Light Backgrounds → Dark Text
- `bg-white` → `text-gray-800`
- `bg-gray-50` → `text-gray-800`
- `bg-gray-100` → `text-gray-800`
- `bg-yellow-50` → `text-gray-800`

#### Colored Backgrounds → White Text
- `bg-purple-600` → `text-white`
- `bg-blue-600` → `text-white`
- `bg-yellow-500` → `text-white`
- `bg-red-500` → `text-white`

#### Dark Backgrounds → White Text
- `bg-gray-800` → `text-white`
- `bg-gray-900` → `text-white`
- `bg-black` → `text-white`

### Username Styling

Usernames always use a distinct blue color for consistency:

```tsx
// Always renders as blue text
<AdaptiveText backgroundClass="any-background" isUsername={true}>
  {user.name}
</AdaptiveText>
```

## CSS Utilities

### Custom CSS Variables

```css
:root {
  --text-primary: #1f2937;    /* gray-800 */
  --text-secondary: #6b7280;  /* gray-500 */
  --text-accent: #3b82f6;     /* blue-500 */
  --text-white: #ffffff;
  --bg-light: #ffffff;
  --bg-dark: #1f2937;
  --bg-accent: #3b82f6;
}
```

### Utility Classes

```css
.text-adaptive          /* Automatically adapts to background */
.text-adaptive-light   /* Always light text */
.text-adaptive-accent  /* Always accent color */
.username-text         /* Username styling */
.text-high-contrast    /* Enhanced contrast */
.hover-contrast        /* Hover state contrast */
.focus-contrast        /* Focus state for accessibility */
.text-transition       /* Smooth color transitions */
.min-contrast          /* Minimum contrast ratio */
```

## Implementation Examples

### Navigation Component

```tsx
// Desktop username display
<AdaptiveText 
  backgroundClass="transparent" 
  isUsername={true}
  className="text-lg"
>
  {user.name}
</AdaptiveText>

// Coin display with background awareness
<AdaptiveText 
  backgroundClass="bg-yellow-500/20" 
  variant="primary"
  className="font-bold"
>
  {user.coins}
</AdaptiveText>
```

### Mobile Menu

```tsx
// Mobile username in blue background
<AdaptiveText 
  backgroundClass="bg-blue-50" 
  isUsername={true}
  className="text-lg"
>
  {user.name}
</AdaptiveText>
```

## Best Practices

### 1. Always Provide Background Class
```tsx
// ✅ Good
<AdaptiveText backgroundClass="bg-white">
  Text content
</AdaptiveText>

// ❌ Avoid
<AdaptiveText>
  Text content
</AdaptiveText>
```

### 2. Use Username Flag for Names
```tsx
// ✅ Good
<AdaptiveText backgroundClass="bg-gray-100" isUsername={true}>
  {user.name}
</AdaptiveText>

// ❌ Avoid
<AdaptiveText backgroundClass="bg-gray-100">
  {user.name}
</AdaptiveText>
```

### 3. Choose Appropriate Variants
```tsx
// Primary text (main content)
<AdaptiveText backgroundClass="bg-white" variant="primary">
  Main content
</AdaptiveText>

// Secondary text (less important)
<AdaptiveText backgroundClass="bg-white" variant="secondary">
  Supporting text
</AdaptiveText>

// Accent text (highlights)
<AdaptiveText backgroundClass="bg-white" variant="accent">
  Important information
</AdaptiveText>
```

## Testing

### Color Contrast Testing

Use browser dev tools to verify contrast ratios:

1. Inspect element with AdaptiveText
2. Check computed styles for text color
3. Verify contrast ratio meets WCAG AA (4.5:1 for normal text)

### Cross-Browser Testing

Test on multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

### Accessibility Testing

- Screen reader compatibility
- High contrast mode support
- Colorblind-friendly color combinations

## Future Enhancements

### Planned Features

1. **Theme Support**: Dark/light mode switching
2. **Custom Color Schemes**: Brand-specific color palettes
3. **Advanced Contrast**: HSL-based contrast calculations
4. **Animation**: Smooth color transitions
5. **Performance**: Memoized color calculations

### Contributing

To add new background color support:

1. Update the `getTextColorClass` function in `AdaptiveText.tsx`
2. Add corresponding CSS utilities in `globals.css`
3. Update this documentation
4. Test with various background colors

## Troubleshooting

### Common Issues

#### Text Not Visible
- Check if `backgroundClass` is provided
- Verify background color class exists
- Ensure proper contrast ratio

#### Username Not Blue
- Set `isUsername={true}`
- Check for CSS conflicts
- Verify component import

#### Mobile Issues
- Test on actual mobile devices
- Check PWA compatibility
- Verify touch interactions

### Debug Mode

Enable debug logging:

```tsx
// Add to AdaptiveText component
console.log('Background class:', backgroundClass);
console.log('Text color class:', textColorClass);
```

## Support

For issues or questions:
1. Check this documentation
2. Review component source code
3. Test with different background colors
4. Verify accessibility compliance

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
