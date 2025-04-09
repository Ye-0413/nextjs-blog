import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import slugify from 'slugify';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

// Configuration
const BIBTEX_FILE = process.argv[2] || 'publications.bib';
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'publications');

// Custom BibTeX parser
function simpleParseBibTeX(content) {
  // Match all BibTeX entries
  const entryRegex = /@(\w+)\s*\{\s*([^,]+),\s*([^@]+)/g;
  const fieldRegex = /\s*(\w+)\s*=\s*\{([^{}]*((?:\{[^{}]*\})[^{}]*)*)\}\s*,?\s*/g;
  
  const entries = [];
  let match;
  
  // Find each BibTeX entry
  while ((match = entryRegex.exec(content)) !== null) {
    const type = match[1].toLowerCase();
    const citeKey = match[2].trim();
    const fieldsText = match[3];
    
    const entry = {
      type,
      citeKey,
      fields: {}
    };
    
    // Extract all fields from the entry
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(fieldsText)) !== null) {
      const key = fieldMatch[1].toLowerCase();
      const value = fieldMatch[2].trim();
      
      entry.fields[key] = value;
    }
    
    entries.push(entry);
  }
  
  return entries;
}

// Ensure the publications directory exists
async function ensureDirectoryExists() {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Ensured directory exists: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error(`Failed to create directory: ${error.message}`);
    process.exit(1);
  }
}

// Process authors string into array
function processAuthors(authorString) {
  if (!authorString) return [];
  return authorString.split(/\s+and\s+/).map(name => name.trim());
}

// Process keywords string into array
function processKeywords(keywordsString) {
  if (!keywordsString) return [];
  return keywordsString.split(/[,;]/).map(k => k.trim()).filter(Boolean);
}

// Convert BibTeX entry to markdown frontmatter
function convertEntryToFrontmatter(entry) {
  console.log(`Processing entry: ${entry.citeKey}`);
  
  const { fields } = entry;
  
  // Ensure title is a string
  const titleStr = fields.title || '';
  if (!titleStr) {
    console.error(`Entry has no title: ${entry.citeKey}`);
    return null;
  }

  // Process authors
  const authors = processAuthors(fields.author);
  if (authors.length === 0) {
    console.error(`Entry has no authors: ${entry.citeKey}`);
    return null;
  }
  
  // Process keywords
  const keywordsList = processKeywords(fields.keywords);
  
  // Get year
  const yearStr = fields.year || '0000';
  const yearNum = parseInt(yearStr, 10) || new Date().getFullYear();
  
  // Create slug from title and year
  const slug = `${yearNum}-${slugify(titleStr, { lower: true, strict: true })}`;
  
  // Determine publication venue (journal or conference)
  const journal = fields.journal || fields.booktitle || fields.publisher || '';

  // Create frontmatter content
  const frontmatter = {
    title: titleStr,
    authors,
    year: yearNum,
    journal,
    abstract: fields.abstract || '',
    featured: false,
    keywords: keywordsList,
  };

  // Add optional fields if they exist
  if (fields.doi) frontmatter.doi = fields.doi;
  if (fields.url) frontmatter.url = fields.url;
  if (fields.volume) frontmatter.volume = fields.volume;
  if (fields.number) frontmatter.number = fields.number;
  if (fields.pages) frontmatter.pages = fields.pages;

  return { slug, frontmatter };
}

// Write publication to markdown file
async function writePublicationFile(slug, frontmatter) {
  // Build the frontmatter content with conditional fields
  const lines = [
    '---',
    `title: ${JSON.stringify(frontmatter.title)}`,
    'authors: ['
  ];
  
  // Add authors
  if (frontmatter.authors.length > 0) {
    frontmatter.authors.forEach(author => {
      lines.push(`  ${JSON.stringify(author)},`);
    });
    // Remove the last comma
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
  }
  
  lines.push(']');
  lines.push(`year: ${frontmatter.year}`);
  lines.push(`journal: ${JSON.stringify(frontmatter.journal)}`);

  // Add optional fields only if they exist
  if (frontmatter.abstract) {
    lines.push(`abstract: ${JSON.stringify(frontmatter.abstract)}`);
  }
  
  lines.push(`featured: ${frontmatter.featured}`);

  if (frontmatter.doi) {
    lines.push(`doi: ${JSON.stringify(frontmatter.doi)}`);
  }
  
  if (frontmatter.url) {
    lines.push(`url: ${JSON.stringify(frontmatter.url)}`);
  }
  
  if (frontmatter.volume) {
    lines.push(`volume: ${JSON.stringify(frontmatter.volume)}`);
  }
  
  if (frontmatter.number) {
    lines.push(`number: ${JSON.stringify(frontmatter.number)}`);
  }
  
  if (frontmatter.pages) {
    lines.push(`pages: ${JSON.stringify(frontmatter.pages)}`);
  }

  // Add keywords
  lines.push('keywords: [');
  if (frontmatter.keywords && frontmatter.keywords.length > 0) {
    frontmatter.keywords.forEach((keyword, index) => {
      if (index === frontmatter.keywords.length - 1) {
        lines.push(`  ${JSON.stringify(keyword)}`);
      } else {
        lines.push(`  ${JSON.stringify(keyword)},`);
      }
    });
  }
  lines.push(']');
  lines.push('---');

  const content = lines.join('\n');

  try {
    const filePath = path.join(OUTPUT_DIR, `${slug}.md`);
    await writeFile(filePath, content, 'utf8');
    console.log(`✓ Created file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to write file for ${slug}: ${error.message}`);
    return false;
  }
}

// Main function to process BibTeX file
async function processBibtex() {
  try {
    console.log(`Processing BibTeX file: ${BIBTEX_FILE}`);
    await ensureDirectoryExists();

    // Read BibTeX file
    let bibtexContent;
    try {
      bibtexContent = await readFile(BIBTEX_FILE, 'utf8');
      console.log(`✓ Read BibTeX file`);
    } catch (error) {
      console.error(`Failed to read BibTeX file: ${error.message}`);
      console.error(`Current working directory: ${process.cwd()}`);
      console.error(`Looking for file at: ${path.resolve(BIBTEX_FILE)}`);
      process.exit(1);
    }

    // Parse BibTeX
    let entries;
    try {
      entries = simpleParseBibTeX(bibtexContent);
      
      if (!entries || entries.length === 0) {
        console.error('No entries found in BibTeX file. Check the file format.');
        console.error('File content preview:', bibtexContent.substring(0, 200) + '...');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Failed to parse BibTeX content: ${error.message}`);
      console.error('First 200 characters of file:', bibtexContent.substring(0, 200) + '...');
      process.exit(1);
    }

    console.log(`Found ${entries.length} publications in BibTeX file`);
    
    // Process each entry
    let successCount = 0;
    for (const entry of entries) {
      try {
        // Convert to frontmatter
        const result = convertEntryToFrontmatter(entry);
        if (!result) {
          console.error(`Failed to process entry: ${entry.citeKey}`);
          continue;
        }
        
        const { slug, frontmatter } = result;
        
        // Write to file
        const success = await writePublicationFile(slug, frontmatter);
        if (success) successCount++;
      } catch (error) {
        console.error(`Error processing entry: ${error.message}`);
        console.error('Entry data:', JSON.stringify(entry, null, 2));
      }
    }

    console.log(`\n✓ Successfully processed ${successCount} of ${entries.length} publications`);
  } catch (error) {
    console.error(`Error processing BibTeX: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
processBibtex()
  .catch(error => {
    console.error('Unhandled error in processBibtex:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }); 