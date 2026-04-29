# Design System Kompagnon

## À propos
Kompagnon est une application mobile inclusive d'accompagnement pour personnes à mobilité réduite. Le design met l'accent sur l'accessibilité, la lisibilité et l'ergonomie avec de grandes icônes, des contrastes élevés et des boutons arrondis.

---

## 🎨 Palette de couleurs

### Couleurs principales (basées sur le logo Kompagnon)

```css
--kompagnon-navy: #1E2C38        /* Bleu marine foncé - Texte principal */
--kompagnon-turquoise: #48AFC4   /* Bleu turquoise - Actions principales */
--kompagnon-cream: #F3EDE6       /* Beige crème doux - Fond secondaire */
--kompagnon-aqua: #9ED4D9        /* Bleu aqua clair - Accents */
```

### Déclinaisons de la palette

```css
/* Navy variants */
--kompagnon-navy-light: #2A3A48
--kompagnon-navy-dark: #141F28

/* Turquoise variants */
--kompagnon-turquoise-light: #5BBCCF
--kompagnon-turquoise-dark: #3A9BB0

/* Cream variants */
--kompagnon-cream-light: #F8F2EB   /* Arrière-plans principaux */
--kompagnon-cream-dark: #EDE7DF

/* Aqua variants */
--kompagnon-aqua-light: #B3E0E4
--kompagnon-aqua-dark: #89C8CE
```

### Couleurs de feedback

```css
--kompagnon-success: #48AFC4      /* Succès (turquoise) */
--kompagnon-warning: #D4851F      /* Avertissement */
--kompagnon-error: #DC4444        /* Erreur */
```

### Utilisation des couleurs

- **Arrière-plan principal** : `bg-gradient-to-br from-[var(--kompagnon-cream)] via-[var(--kompagnon-cream-light)] to-[var(--kompagnon-aqua)]/20`
- **Cartes** : `bg-white` avec `border-gray-100`
- **Boutons principaux** : `bg-[var(--kompagnon-turquoise)]` avec `text-white`
- **Texte principal** : `text-[var(--kompagnon-navy)]`
- **Texte secondaire** : `text-[var(--kompagnon-navy-light)]`

---

## 📐 Typographie

### Système de tailles fluides

```css
:root {
  --font-size: 16px;           /* Base (mobile) */
  --text-xs: 0.75rem;          /* 12px */
  --text-sm: 0.875rem;         /* 14px */
  --text-base: 1rem;           /* 16px */
  --text-lg: 1.125rem;         /* 18px */
  --text-xl: 1.25rem;          /* 20px */
  --text-2xl: 1.5rem;          /* 24px */
  --text-3xl: 1.875rem;        /* 30px */
}

/* Optimisation Full HD (1920x1080+) */
@media (min-width: 1920px) {
  :root {
    --font-size: 17px;
    --text-2xl: 1.625rem;
    --text-xl: 1.375rem;
    --text-lg: 1.25rem;
    --text-base: 1.0625rem;
  }
}
```

### Typographie responsive avec clamp()

```css
h1 { font-size: clamp(1.5rem, 4vw, var(--text-2xl)); }
h2 { font-size: clamp(1.25rem, 3.5vw, var(--text-xl)); }
h3 { font-size: clamp(1.125rem, 3vw, var(--text-lg)); }
p  { font-size: clamp(0.875rem, 2.5vw, var(--text-base)); }
```

### Font weights

```css
--font-weight-normal: 400
--font-weight-medium: 500
```

### Famille de police

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

---

## 📱 Breakpoints & Responsive Design

### Breakpoints

```css
/* Mobile first approach */
Mobile:     < 640px   (default)
SM:         640px
MD:         768px
LG:         1024px   (Desktop avec sidebar)
XL:         1536px   (Full HD optimization start)
2XL:        1920px   (Full HD 1920x1080)
```

### Layout Strategy

#### Mobile (< 1024px)
- Conteneur max-width: `448px` (28rem)
- Navigation: Bottom Navigation (4 onglets)
- Padding: `p-6` (1.5rem)
- Grilles: 1-2 colonnes maximum

#### Desktop (≥ 1024px)
- Sidebar fixe: `256px` (lg:w-64)
- Sidebar XL: `288px` (xl:w-72)
- Container principal: `max-w-7xl` → `max-w-[1600px]` sur XL
- Navigation: Desktop Sidebar (navigation verticale)
- Padding: `lg:px-6 xl:px-8`
- Grilles: 2-4 colonnes selon le contenu

#### Full HD 1920x1080 (≥ 1920px)
- Container max: `1600px`
- Font size de base: `17px`
- Sidebar: `288px` (xl:w-72)
- Padding optimisé: `2-3rem`
- Grilles jusqu'à 4 colonnes
- Spacing accru: `xl:gap-6`, `xl:gap-8`

---

## 🧩 Composants clés

### 1. Desktop Sidebar

**Dimensions:**
- Largeur: `lg:w-64` (256px) / `xl:w-72` (288px)
- Hauteur: `h-screen`
- Background: `bg-white`
- Border: `border-r border-border`

**Structure:**
```tsx
<aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:h-screen">
  {/* Logo et branding - p-6 */}
  {/* Navigation principale */}
  {/* Navigation secondaire */}
  {/* Footer utilisateur */}
</aside>
```

**Boutons de navigation:**
- Active: `bg-[var(--kompagnon-turquoise)] text-white shadow-md`
- Hover: `hover:bg-[var(--kompagnon-cream)] hover:text-[var(--kompagnon-turquoise)]`
- Padding: `px-3 py-3`
- Border radius: `rounded-xl`

### 2. Bottom Navigation (Mobile)

**Caractéristiques:**
- Visible uniquement sur mobile: `lg:hidden`
- Position: Fixed bottom
- Hauteur: `safe-area-inset-bottom`
- Background: `bg-white/95 backdrop-blur-lg`
- 4 onglets: Home, Map, Connect, Profile

### 3. Cards

**Style standard:**
```tsx
<Card className="p-6 bg-white shadow-sm border border-gray-100">
  {/* Contenu */}
</Card>
```

**Variantes:**
- Card avec hover: `hover:shadow-md transition-all duration-300`
- Card interactive: `hover:scale-[1.02] cursor-pointer`
- Border radius: `rounded-2xl` (défini dans theme)

### 4. Boutons

**Tailles tactiles accessibles:**
```css
min-height: 44px;
min-width: 44px;

@media (max-width: 375px) {
  min-height: 48px;
  min-width: 48px;
}
```

**Variantes:**
- Primary: `bg-[var(--kompagnon-turquoise)] text-white`
- Secondary: `bg-[var(--kompagnon-cream)] text-[var(--kompagnon-navy)]`
- Ghost: `bg-transparent hover:bg-[var(--kompagnon-cream)]`
- Border radius: `rounded-3xl` ou `rounded-2xl`

### 5. Badges

```tsx
<Badge variant="secondary" className="bg-green-100 text-green-700">
  En ligne
</Badge>
```

### 6. Input Fields

```css
background: var(--input-background) (#F8F2EB)
border: 1px solid var(--border)
border-radius: 1rem
padding: 0.75rem 1rem
font-size: var(--text-base)
```

---

## 📐 Grilles Responsive

### Home Screen

```tsx
{/* Actions rapides */}
<div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 xl:gap-4">
  {/* 4 actions */}
</div>

{/* Statistiques communauté */}
<div className="grid grid-cols-3 xl:grid-cols-3 gap-3 xl:gap-4">
  {/* 3 stats */}
</div>
```

### Profile Screen

```tsx
{/* Stats */}
<div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-6">
  {/* 4 statistiques */}
</div>

{/* Needs & Reviews */}
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 xl:gap-8">
  {/* 2 sections côte à côte */}
</div>
```

### Connect Screen (Conversations)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3 xl:gap-4">
  {/* Messages - 2 colonnes desktop, 3 sur très grands écrans */}
</div>
```

### Map Screen (Volontaires)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 xl:gap-5">
  {/* Cartes volontaires */}
</div>
```

### Settings Screen

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 xl:gap-8">
  {/* Sections de paramètres */}
</div>
```

---

## 🎭 Animations & Transitions

### Animations CSS optimisées

**Ne PAS utiliser Motion/Framer Motion** - Toutes les animations sont en CSS pur pour éviter les timeouts.

```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-animation {
  animation: scaleIn 1s ease-out forwards;
}

/* Bounce gentle */
@keyframes bounceGentle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-bounce-slow {
  animation: bounceGentle 2s ease-in-out infinite;
}
```

### Transitions standard

```css
* {
  transition: color 0.2s ease-in-out, 
              background-color 0.2s ease-in-out, 
              border-color 0.2s ease-in-out, 
              opacity 0.2s ease-in-out, 
              transform 0.2s ease-in-out;
}
```

### Hover effects

```tsx
{/* Card hover */}
className="hover:scale-[1.02] transition-transform duration-200"

{/* Button active */}
className="active:scale-95 transition-transform"

{/* Shadow transition */}
className="shadow-sm hover:shadow-md transition-all duration-300"
```

---

## ♿ Accessibilité

### Focus visible

```css
:focus-visible {
  outline: 2px solid var(--kompagnon-teal);
  outline-offset: 2px;
  border-radius: 8px;
}
```

### Zones tactiles

```css
button, [role="button"], a, [role="link"] {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

@media (max-width: 375px) {
  button, [role="button"], a, [role="link"] {
    min-height: 48px;
    min-width: 48px;
  }
}
```

### Classes utilitaires

```css
.touch-manipulation { touch-action: manipulation; }
.no-tap-highlight { -webkit-tap-highlight-color: transparent; }
.safe-area-inset-top { padding-top: env(safe-area-inset-top); }
.safe-area-inset-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

---

## 🖼️ Images & Assets

### Logo Kompagnon

```tsx
import kompagnonLogo from 'figma:asset/b39589dd9d6ea059cc85e11eba4dbafd9fe44c89.png';

<img 
  src={kompagnonLogo} 
  alt="Kompagnon Logo" 
  className="w-10 h-10 object-contain"
/>
```

### Images avec fallback

```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback
  src="url"
  alt="Description"
  className="w-16 h-16 rounded-2xl object-cover"
/>
```

### Import d'assets Figma

```tsx
// Images raster (PNG, JPG)
import img from "figma:asset/hash.png"

// SVGs (depuis src/imports)
import svgPaths from "../imports/svg-id"
```

---

## 📦 Structure des écrans

### Layout principal (App.tsx)

```tsx
<div className="min-h-screen h-screen flex lg:flex-row flex-col w-full bg-[var(--kompagnon-cream-light)]">
  {/* Desktop Sidebar */}
  <DesktopSidebar />
  
  {/* Main content area */}
  <div className="flex-1 flex flex-col w-full lg:max-w-none max-w-md lg:mx-0 mx-auto">
    <div className="flex-1 overflow-hidden lg:max-w-7xl xl:max-w-[1600px] lg:mx-auto lg:w-full lg:px-6 xl:px-8">
      {renderCurrentScreen()}
    </div>
    
    {/* Bottom Navigation (mobile only) */}
    <BottomNavigation />
  </div>
</div>
```

### Structure d'écran standard

```tsx
export function ScreenName() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[var(--kompagnon-cream)] via-[var(--kompagnon-cream-light)] to-[var(--kompagnon-aqua)]/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl p-6 border-b border-gray-100/50">
        {/* Navigation et titre */}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Contenu de l'écran */}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Patterns de design spécifiques

### Carte de volontaire

```tsx
<Card className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
  <div className="flex items-start space-x-4">
    {/* Avatar avec badge de confiance */}
    <div className="relative">
      <ImageWithFallback className="w-16 h-16 rounded-2xl" />
      {volunteer.trusted && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full">
          <Shield className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
    
    {/* Infos */}
    <div className="flex-1">
      <h4>{name}</h4>
      <div className="flex items-center">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span>{rating}</span>
      </div>
    </div>
  </div>
</Card>
```

### CTA principal (Hero card)

```tsx
<Card className="p-8 bg-gradient-to-r from-[var(--kompagnon-navy)] via-[var(--kompagnon-turquoise)] to-[var(--kompagnon-aqua)] border-0 shadow-2xl">
  <div className="relative z-10">
    <h2 className="text-white mb-2">Titre de l'action</h2>
    <p className="text-[var(--kompagnon-aqua-light)]">Description</p>
    
    {/* Avatars de volontaires */}
    <div className="flex -space-x-2">
      <ImageWithFallback className="w-8 h-8 rounded-full ring-2 ring-white/30" />
      {/* ... */}
    </div>
    
    <Button className="w-full bg-white text-[var(--kompagnon-turquoise)]">
      Action
    </Button>
  </div>
</Card>
```

### Notification Badge

```tsx
<div className="relative">
  <Bell className="w-6 h-6" />
  {count > 0 && (
    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
      <span className="text-xs text-white">{count}</span>
    </div>
  )}
</div>
```

---

## 🚀 Optimisations 1920x1080

### Container width progression

```
Mobile:     max-w-md (448px)
Desktop:    max-w-7xl (1280px)
XL:         max-w-[1600px]
Full HD:    1600px max avec padding 2-3rem
```

### Spacing scale pour Full HD

```css
gap-3   → xl:gap-4   (0.75rem → 1rem)
gap-4   → xl:gap-5   (1rem → 1.25rem)
gap-6   → xl:gap-8   (1.5rem → 2rem)

p-6     → xl:p-7     (1.5rem → 1.75rem)
p-8     → xl:p-9     (2rem → 2.25rem)
```

### Grids optimization

- 2 colonnes → 2 colonnes (stable)
- 3 colonnes → 3 colonnes (stable)
- 4 colonnes → 4 colonnes (stable)
- 2 colonnes → 3 colonnes sur 2XL+ (conversations, volontaires)

---

## 📝 Conventions de code

### Nommage des classes

```tsx
// ✅ Bon
className="flex items-center gap-3 px-3 py-3 rounded-xl"

// ❌ Éviter les classes Tailwind de taille de police
// (utiliser le système de typographie fluide)
className="text-2xl font-bold"  // ❌
// À la place, laisser h1, h2, h3 gérer la taille
```

### Ordre des classes Tailwind

1. Layout (flex, grid, block)
2. Sizing (w-, h-, min-, max-)
3. Spacing (p-, m-, gap-)
4. Typography (text-, font-, leading-)
5. Colors (bg-, text-, border-)
6. Borders (border, rounded)
7. Effects (shadow, opacity)
8. Transitions (transition, duration, ease)
9. States (hover:, active:, focus:)
10. Responsive (sm:, md:, lg:, xl:, 2xl:)

### Variables CSS vs Tailwind

```tsx
// ✅ Utiliser les variables CSS pour les couleurs Kompagnon
bg-[var(--kompagnon-turquoise)]
text-[var(--kompagnon-navy)]

// ✅ Utiliser Tailwind pour les couleurs standards
bg-white
text-gray-600
border-gray-100
```

---

## 🎨 Exemples de mise en page complète

### Écran avec header + grille + scroll

```tsx
<div className="flex flex-col h-full bg-gradient-to-br from-[var(--kompagnon-cream)] via-[var(--kompagnon-cream-light)] to-[var(--kompagnon-aqua)]/20">
  {/* Header fixe */}
  <div className="bg-white/80 backdrop-blur-xl p-6 pb-4 border-b border-gray-100/50">
    <div className="flex items-center justify-between">
      <h1>Titre de l'écran</h1>
      <button className="w-11 h-11 rounded-3xl bg-gray-100">
        <User className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Contenu scrollable */}
  <div className="flex-1 overflow-y-auto">
    {/* Section 1 */}
    <div className="p-6 pb-4">
      <Card className="p-8 bg-gradient-to-r from-[var(--kompagnon-navy)] to-[var(--kompagnon-turquoise)]">
        {/* Hero content */}
      </Card>
    </div>

    {/* Section 2 - Grille */}
    <div className="px-6 pb-4">
      <h3 className="text-gray-900 mb-4">Section</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 xl:gap-4">
        {items.map(item => (
          <Card key={item.id} className="p-4">
            {/* Item content */}
          </Card>
        ))}
      </div>
    </div>
  </div>
</div>
```

---

## 📚 Ressources & Assets

### Logo
- Fichier: `figma:asset/b39589dd9d6ea059cc85e11eba4dbafd9fe44c89.png`
- Taille d'affichage recommandée: `w-10 h-10` (40x40px)

### Icônes
- Library: `lucide-react`
- Taille standard: `w-5 h-5` (20x20px)
- Taille large: `w-6 h-6` (24x24px)

### Photos (via Unsplash plugin si disponible)
- Portraits de volontaires
- Images d'accompagnement
- Utiliser toujours `ImageWithFallback`

---

## ✅ Checklist de conformité

Avant de valider un nouveau composant ou écran :

- [ ] Respect de la palette de couleurs Kompagnon
- [ ] Zones tactiles ≥ 44x44px (48x48px sur petits écrans)
- [ ] Typographie fluide (pas de classes text-* Tailwind)
- [ ] Responsive mobile-first
- [ ] Border radius cohérent (rounded-2xl, rounded-3xl)
- [ ] Animations CSS uniquement (pas de Motion)
- [ ] Focus visible accessible
- [ ] Grilles optimisées pour 1920x1080
- [ ] Spacing xl: adapté pour grands écrans
- [ ] Safe area insets pour mobile
- [ ] Contrastes suffisants (WCAG AA minimum)

---

## 🔄 Versions & Maintenance

**Version actuelle du design system:** 1.0.0  
**Dernière mise à jour:** Adaptation Full HD 1920x1080  
**Stack technique:** React 18 + Tailwind CSS v4 + TypeScript

---

## 📞 Contact & Support

Pour toute question sur l'implémentation du design system Kompagnon, référez-vous à ce document ou consultez les fichiers sources dans `/src/app/components/` et `/src/styles/globals.css`.
