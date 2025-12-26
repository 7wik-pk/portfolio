---
description: How to add a new icon to the macOS dock
---

To add a new icon and ensure it looks consistent with the existing ones, follow these steps:

1. **Place the icon**: Save your new icon (PNG or WebP) into `src/assets/icons/`.

2. **Normalize the asset**:
Run the following command to trim transparent margins (requires ImageMagick):
// turbo
```bash
mogrify -trim +repage src/assets/icons/YOUR_NEW_ICON_NAME.ext
```

3. **Update Dock.vue**:
   - Add the import at the top of the `<script setup>` block:
     `import MyIcon from '../assets/icons/YOUR_NEW_ICON_NAME.ext'`
   - Add a new object to the `dockApps` array:
     ```javascript
     { 
       name: 'Display Name', 
       image: MyIcon, 
       action: () => { /* function here */ } 
     }
     ```

4. **Verify**: Check the dev server to ensure the icon is sized correctly and the tooltip is working.
