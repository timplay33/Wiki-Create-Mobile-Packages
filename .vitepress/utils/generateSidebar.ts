import { DefaultTheme } from "vitepress";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

type SidebarItem = DefaultTheme.SidebarItem;

/**
 * Generate sidebar configuration dynamically from directory structure
 */
export function generateSidebar(
  baseDir: string,
  rootPath: string = "",
  options: {
    includeIndex?: boolean;
    collapsed?: boolean;
    sortBy?: "name" | "date" | "title";
    excludeFiles?: string[];
    includeSubfolders?: boolean;
  } = {}
): DefaultTheme.SidebarItem[] {
  const {
    includeIndex = true,
    collapsed = false,
    sortBy = "name",
    excludeFiles = ["README.md"],
    includeSubfolders = true,
  } = options;

  const fullPath = path.resolve(baseDir);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Directory ${fullPath} does not exist`);
    return [];
  }

  const items: SidebarItem[] = [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  // Separate files and directories
  const files = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'));
  const directories = entries.filter(entry => entry.isDirectory());

  // Process files
  const processedFiles = files
    .filter(file => !excludeFiles.includes(file.name))
    .map(file => {
      const filePath = path.join(fullPath, file.name);
      const relativePath = path.join(rootPath, file.name.replace('.md', ''));
      
      let title = file.name.replace('.md', '');
      let date: Date | null = null;

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = matter(content);
        
        // Extract title from frontmatter
        if (frontmatter.data.title) {
          title = frontmatter.data.title;
        }
        
        // Extract date for sorting
        if (frontmatter.data.date) {
          date = new Date(frontmatter.data.date);
        }
      } catch (error) {
        console.warn(`Could not parse frontmatter for ${filePath}:`, error);
      }

      return {
        text: title,
        link: `/${relativePath}`,
        name: file.name,
        date,
        isIndex: file.name === 'index.md'
      };
    });

  // Sort files based on sortBy option
  let sortedFiles = processedFiles;
  switch (sortBy) {
    case "date":
      sortedFiles = processedFiles.sort((a, b) => {
        if (!a.date && !b.date) return a.text.localeCompare(b.text);
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.getTime() - a.date.getTime(); // Latest first
      });
      break;
    case "title":
      sortedFiles = processedFiles.sort((a, b) => a.text.localeCompare(b.text));
      break;
    default: // "name"
      sortedFiles = processedFiles.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Add index file first if it exists and includeIndex is true
  if (includeIndex) {
    const indexFile = sortedFiles.find(file => file.isIndex);
    if (indexFile) {
      items.push({
        text: indexFile.text,
        link: indexFile.link
      });
      sortedFiles = sortedFiles.filter(file => !file.isIndex);
    }
  }

  // Add other files
  sortedFiles.forEach(file => {
    if (!file.isIndex || !includeIndex) {
      items.push({
        text: file.text,
        link: file.link
      });
    }
  });

  // Process subdirectories if enabled
  if (includeSubfolders) {
    directories.forEach(dir => {
      const subDirPath = path.join(fullPath, dir.name);
      const subRootPath = path.join(rootPath, dir.name);
      
      const subItems = generateSidebar(subDirPath, subRootPath, options);
      
      if (subItems.length > 0) {
        // Check if there's an index file in the subdirectory for the folder title
        let folderTitle = dir.name;
        const indexPath = path.join(subDirPath, 'index.md');
        
        if (fs.existsSync(indexPath)) {
          try {
            const content = fs.readFileSync(indexPath, 'utf-8');
            const frontmatter = matter(content);
            if (frontmatter.data.title) {
              folderTitle = frontmatter.data.title;
            }
          } catch (error) {
            console.warn(`Could not parse frontmatter for ${indexPath}:`, error);
          }
        }

        items.push({
          text: folderTitle,
          collapsed,
          items: subItems as DefaultTheme.SidebarItem[]
        });
      }
    });
  }

  return items;
}

/**
 * Generate multiple sidebar configurations for different sections
 */
export function generateMultiSidebar(
  sections: Array<{
    path: string;
    baseDir: string;
    title?: string;
    options?: Parameters<typeof generateSidebar>[2];
  }>
): DefaultTheme.SidebarMulti {
  const sidebar: DefaultTheme.SidebarMulti = {};

  sections.forEach(({ path: sectionPath, baseDir, title, options }) => {
    const items = generateSidebar(baseDir, sectionPath.replace(/^\//, ''), options);
    
    // If items exist, create the sidebar entry
    if (items.length > 0) {
      sidebar[sectionPath] = [
        {
          text: title || sectionPath.replace(/^\//, '').replace(/^\w/, c => c.toUpperCase()),
          link: sectionPath,
          items: items.filter(item => item.link !== sectionPath) // Remove duplicate index link
        }
      ];
    }
  });

  return sidebar;
}

/**
 * Watch for file changes and regenerate sidebar (for development)
 */
export function watchSidebar(
  sections: Parameters<typeof generateMultiSidebar>[0],
  callback: (sidebar: DefaultTheme.SidebarMulti) => void
) {
  const watchedDirs = new Set<string>();
  
  sections.forEach(({ baseDir }) => {
    if (fs.existsSync(baseDir) && !watchedDirs.has(baseDir)) {
      watchedDirs.add(baseDir);
      
      fs.watch(baseDir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
          console.log(`File ${filename} changed, regenerating sidebar...`);
          const newSidebar = generateMultiSidebar(sections);
          callback(newSidebar);
        }
      });
    }
  });
}

export default {
  generateSidebar,
  generateMultiSidebar,
  watchSidebar
};
