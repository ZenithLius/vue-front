# How to Add New Menus & Demos

This guide explains how to add new technology demos to your Retro Portfolio.

## 1. Create the Demo Page
Create a new Vue file in `src/pages/demos/`. For example, `src/pages/demos/my-new-demo.vue`.

```vue
<template>
  <div>
    <h2>MY_NEW_DEMO</h2>
    <!-- Your content here -->
  </div>
</template>
```

The route `/demos/my-new-demo` will be automatically created.

## 2. Add to Category Menu
Decide which category your demo belongs to:
- **Vue**: `src/pages/skills/vue.vue`
- **Web**: `src/pages/skills/web.vue`
- **Flutter**: `src/pages/skills/flutter.vue`
- **Security**: `src/pages/skills/security.vue`

Open the corresponding file and add your demo to the `demos` array:

```typescript
const demos = [
  // ... existing demos
  {
    id: 'new-demo',
    name: 'MY_NEW_DEMO',
    desc: 'Description of what this demo does',
    path: '/demos/my-new-demo' // Must match filename in step 1
  }
]
```

## 3. (Optional) Create New Category
If you need a completely new category (e.g., "Backend"):

1. Create `src/pages/skills/backend.vue` (copy structure from `vue.vue`).
2. Open `src/pages/skills.vue`.
3. Add the new category to the `categories` array:

```typescript
const categories = [
  // ...
  { 
    id: 'backend', 
    name: 'BACKEND_OPS', 
    desc: 'Node.js, Python, Databases',
    path: '/skills/backend',
    color: 'text-purple-500 border-purple-500' // Add color to tailwind config if needed
  }
]
```
