# Dynamic Sidebar Generation for VitePress

This system automatically generates sidebars for your VitePress documentation based on your file structure and frontmatter data.

## How It Works

The dynamic sidebar system scans your directories and creates navigation structures automatically. It supports:

- **Automatic file discovery**: Scans directories for `.md` files
- **Frontmatter parsing**: Extracts titles and metadata from file headers
- **Flexible sorting**: Sort by name, title, or date
- **Nested folders**: Supports subdirectories with collapsible sections
- **Custom exclusions**: Exclude specific files from navigation

## Configuration

### Basic Setup

Your sidebar configuration is defined in `.vitepress/config/sidebar.config.ts`:

```typescript
export const sidebarConfigs: SidebarConfig[] = [
  {
    path: '/users',           // URL path prefix
    baseDir: './users',       // Directory to scan
    title: 'For Users',       // Section title
    options: {
      includeIndex: true,     // Include index.md files
      collapsed: false,       // Expand/collapse folders
      sortBy: 'title',        // Sort method
      excludeFiles: ['README.md', 'test.md'], // Files to exclude
      includeSubfolders: true // Include subdirectories
    }
  }
];
```

### Options Explained

- **`includeIndex`**: Whether to include `index.md` files in navigation
- **`collapsed`**: Whether folder sections should be collapsed by default
- **`sortBy`**: How to sort files (`'name'`, `'title'`, or `'date'`)
- **`excludeFiles`**: Array of filenames to exclude from navigation
- **`includeSubfolders`**: Whether to process subdirectories recursively

## File Structure Support

### Basic Structure
```
users/
├── index.md          # Section landing page
├── getting-started.md # Regular page
└── advanced.md        # Regular page
```

### With Subfolders
```
users/
├── index.md
├── guides/
│   ├── index.md       # Subfolder landing page
│   ├── basic.md
│   └── advanced.md
└── tutorials/
    ├── tutorial-1.md
    └── tutorial-2.md
```

## Frontmatter Support

Add metadata to your markdown files to control how they appear:

```markdown
---
title: "Custom Page Title"
date: 2025-01-15T10:00:00Z
---

# Your content here
```

### Supported Frontmatter Fields

- **`title`**: Custom title for navigation (overrides filename)
- **`date`**: Date for sorting when `sortBy: 'date'` is used

## Usage Examples

### 1. Simple Blog-Style Sidebar (Date Sorted)
```typescript
{
  path: '/blog',
  baseDir: './blog',
  title: 'Blog Posts',
  options: {
    sortBy: 'date',
    includeIndex: false
  }
}
```

### 2. Documentation with Sections
```typescript
{
  path: '/docs',
  baseDir: './docs',
  title: 'Documentation',
  options: {
    includeSubfolders: true,
    collapsed: true,
    sortBy: 'title'
  }
}
```

### 3. Simple File List
```typescript
{
  path: '/examples',
  baseDir: './examples',
  title: 'Examples',
  options: {
    includeSubfolders: false,
    sortBy: 'name',
    excludeFiles: ['README.md']
  }
}
```

## Advanced Features

### Custom Sorting by Date

Files with `date` frontmatter will be sorted by date (newest first) when using `sortBy: 'date'`:

```markdown
---
title: "Latest Update"
date: 2025-01-15T10:00:00Z
---
```

### Folder Titles from Index Files

When a subfolder contains an `index.md` with a `title` in frontmatter, that title will be used for the folder name in navigation.

### Development Mode File Watching

The system includes a file watcher for development (not currently enabled by default):

```typescript
import { watchSidebar } from './utils/generateSidebar';

// Watch for changes and regenerate sidebar
watchSidebar(sidebarConfigs, (newSidebar) => {
  console.log('Sidebar updated:', newSidebar);
});
```

## Troubleshooting

### Common Issues

1. **Files not appearing**: Check `excludeFiles` configuration
2. **Wrong sorting**: Verify `sortBy` option and frontmatter data
3. **Missing titles**: Add `title` field to frontmatter
4. **Nested folders not showing**: Ensure `includeSubfolders: true`

### Debug Information

The system logs warnings for:
- Missing directories
- Unparseable frontmatter
- Other configuration issues

Check your terminal output during build for any warnings.

## Migration from Static Sidebars

If you're migrating from static sidebar files:

1. Keep your existing static files as backup
2. Update `.vitepress/config.mts` to use `generateMultiSidebar()`
3. Configure sections in `sidebar.config.ts`
4. Test thoroughly before removing static files

## Performance

The sidebar generation happens at build time, so there's no runtime performance impact. For large documentation sites with hundreds of files, the generation is still very fast (typically under 100ms).
