# ⚡ Quick Reference: Professional Customizations

## 📱 Mobile Hamburger Menu

### Button Styling
```javascript
style={{
  background: 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)',
  borderRadius: '8px',
  padding: 'clamp(0.4rem, 1vw, 0.6rem)',
  boxShadow: menuOpen ? '0 4px 12px rgba(0, 102, 204, 0.4)' : '0 2px 8px rgba(0, 102, 204, 0.2)',
  transform: menuOpen ? 'scale(1.08)' : 'scale(1)',
}}
```

### Line Animation
```javascript
// Each line uses different transforms
transform: menuOpen ? 'rotate(45deg) translate(10px, 10px)' : 'rotate(0)',
transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
```

### Menu Overlay
```javascript
{menuOpen && (
  <>
    <div style={{background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(3px)', zIndex: 999}} />
    <div style={{animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1000}} />
  </>
)}
```

---

## 🎨 Responsive Typography

### Heading Sizes
```javascript
h1: clamp(1.8rem, 6vw, 4rem)      // Main heading
h2: clamp(1.5rem, 4vw, 2.2rem)    // Section headings
h3: clamp(1.1rem, 2.5vw, 1.3rem)  // Card titles
h4: clamp(1rem, 2vw, 1.2rem)      // Sub-titles
```

### Body Text Sizes
```javascript
p:     clamp(0.85rem, 2vw, 1rem)     // Body text
label: clamp(0.75rem, 1.5vw, 0.85rem) // Small text
```

### Button Text Sizes
```javascript
btn: clamp(0.85rem, 2vw, 1.05rem)  // Button text
```

---

## 📐 Responsive Spacing

### Padding
```javascript
padding: clamp(1rem, 4vw, 2rem)              // Standard
padding: clamp(1.5rem, 3vw, 2rem)            // Large
padding: clamp(0.75rem, 1.5vw, 1rem)         // Small
padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2vw, 1.25rem)' // Responsive
```

### Margins & Gaps
```javascript
gap: clamp(1.5rem, 3vw, 2rem)                // Card gaps
marginBottom: clamp(1rem, 2vw, 1.5rem)       // Section spacing
```

### Grid
```javascript
gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 90vw, 340px), 1fr))'
// Mobile: 1 column | Tablet: 2 columns | Desktop: 3+ columns
```

---

## 🎬 Animation Keyframes

### Slide Down
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Slide In Left
```css
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### Usage with Stagger
```javascript
animation: `slideInLeft 0.4s ease ${index * 0.05}s both`
// Item 0: 0s delay
// Item 1: 0.05s delay
// Item 2: 0.10s delay
```

---

## 🎨 Color Palette

```javascript
// Primary Colors
const primaryBlue = '#0066cc'
const accentCyan = '#00b4d8'
const primaryGradient = 'linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)'

// Text Colors
const textPrimary = '#1f2937'
const textSecondary = '#666'
const textLight = '#6b7280'

// Hover & Interactive
const hoverBackground = 'rgba(0, 102, 204, 0.08)'
const hoverBorder = '#00b4d8'

// System Colors
const dangerRed = '#dc2626'
const successGreen = '#10b981'
const warningOrange = '#f59e0b'

// Other
const white = '#ffffff'
const lightGray = '#f8f9fa'
const borderGray = '#e5e7eb'
const overlayDark = 'rgba(0, 0, 0, 0.3)'
```

---

## 🎯 Hover Effects Pattern

```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.background = 'rgba(0, 102, 204, 0.08)'
  e.currentTarget.style.borderLeftColor = '#0066cc'
  e.currentTarget.style.transform = 'translateX(8px)'
  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.3)'
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = 'transparent'
  e.currentTarget.style.borderLeftColor = 'transparent'
  e.currentTarget.style.transform = 'translateX(0)'
  e.currentTarget.style.boxShadow = 'none'
}}
```

---

## 📱 Media Query

```javascript
<style>{`
  @media (max-width: 768px) {
    nav ul {
      display: none !important;  // Hide desktop menu
    }
    nav button {
      display: flex !important;  // Show hamburger
    }
  }
`}</style>
```

---

## 🎪 Staggered Animation

```javascript
{items.map((item, index) => (
  <div
    key={item.name}
    style={{
      animation: `slideInLeft 0.4s ease ${index * 0.05}s both`
    }}
  >
    {/* Content */}
  </div>
))}
```

---

## 💡 Professional Easing

```javascript
// Always use this easing for smooth professional animations
transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

// Faster for subtle effects
transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'

// Slower for dramatic effects
transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
```

---

## 📊 Responsive Pattern Template

```javascript
// Use this pattern for responsive spacing
style={{
  padding: 'clamp(1rem, 4vw, 2rem)',           // Responsive padding
  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',      // Responsive font
  gap: 'clamp(1.5rem, 3vw, 2rem)',             // Responsive gap
  borderRadius: 'clamp(8px, 2vw, 12px)',       // Responsive radius
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
}}
```

---

## 🎯 Icon Sizing Pattern

```javascript
// Icons scale with viewport
<span style={{ 
  fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)' 
}}>
  {emoji}
</span>
```

---

## 🎬 Menu Item Pattern

```javascript
{items.map((item, index) => (
  <Link
    key={item.name}
    to={item.path}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(0.75rem, 2vw, 1rem)',
      padding: 'clamp(0.85rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem)',
      fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
      borderRadius: '10px',
      animation: `slideInLeft 0.4s ease ${index * 0.05}s both`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(0, 102, 204, 0.08)'
      e.currentTarget.style.borderLeftColor = '#0066cc'
      e.currentTarget.style.transform = 'translateX(8px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent'
      e.currentTarget.style.borderLeftColor = 'transparent'
      e.currentTarget.style.transform = 'translateX(0)'
    }}
  >
    <span>{item.icon}</span>
    {item.name}
  </Link>
))}
```

---

## ⚡ Quick Customization Guide

### Change Primary Color
```javascript
// Find all instances of #0066cc and replace with your color
const newColor = '#YourColor'
```

### Adjust Menu Animation Speed
```javascript
// Change 0.4s to faster (0.3s) or slower (0.5s)
animation: `slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)`
```

### Modify Stagger Delay
```javascript
// Change 0.05s to larger (0.1s) or smaller (0.03s)
animation: `slideInLeft 0.4s ease ${index * 0.05}s both`
```

### Adjust Font Scale
```javascript
// Change the vw percentage for different scaling
fontSize: `clamp(0.9rem, 2.5vw, 1.1rem)` // 2.5vw is the scaling factor
```

---

**This is your complete reference guide for all professional customizations!**
