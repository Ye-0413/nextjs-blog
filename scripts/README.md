# Scripts for Edu-metaverse

This directory contains utility scripts for the Edu-metaverse blog.

## BibTeX Publication Import

The `process-bibtex.js` script allows you to batch import academic publications from a BibTeX file into the website's content collection.

### How to Use

1. Create a BibTeX file with your publications (e.g., `publications.bib`) in the root directory of the project
2. Run the import script:

```bash
npm run import-publications
```

Alternatively, you can specify a custom BibTeX file:

```bash
node scripts/process-bibtex.js path/to/your/references.bib
```

### Troubleshooting

If you encounter issues with the BibTeX import:

1. **File not found errors**: Make sure you're running the command from the project root directory, not from inside the scripts directory.

2. **Parsing errors**: The script uses a custom parser that works with standard BibTeX format. Make sure your BibTeX entries follow this format:

```bibtex
@article{citekey,
  title={Title of Publication},
  author={Last, First and Second, Author},
  journal={Journal Name},
  year={2023},
  volume={42},
  number={3},
  pages={100--115},
  doi={10.1000/journal.paper.id},
  abstract={Abstract text goes here...},
  keywords={Keyword 1, Keyword 2, Keyword 3}
}
```

3. **Empty entries**: Check that all required fields (title, author, year, journal/booktitle) are present in your BibTeX entries.

### BibTeX Format Requirements

For best results, your BibTeX entries should include:

- **Required fields**:
  - `title` - Title of the publication
  - `author` - Author names separated by "and"
  - `year` - Publication year
  - Either `journal` or `booktitle` - Publication venue

- **Recommended fields**:
  - `abstract` - Publication abstract
  - `keywords` - Keywords separated by commas
  - `doi` - Digital Object Identifier
  - `url` - URL to the publication
  - `volume`, `number`, `pages` - Additional publication details

### Example BibTeX Entry

```bibtex
@article{jia2024traceable,
  title={Traceable teleportation: Improving spatial learning in virtual locomotion},
  author={Jia, Ye and Sin, Zackary P. T. and Li, Chen and Ng, Peter H. F. and Huang, Xiao and Baciu, George and Cao, Jiannong and Li, Qing},
  journal={International Journal of Human-Computer Studies},
  year={2024},
  volume={185},
  pages={103177},
  doi={10.1016/j.ijhcs.2024.103177},
  publisher={Elsevier},
  keywords={Virtual Reality, Spatial Learning, Teleportation, Virtual Locomotion, Human-Computer Interaction}
}
```

### Adding Images to Imported Publications

After importing publications, you can manually add images by:

1. Adding an image to `/public/images/publications/`
2. Editing the generated markdown file to include:

```yaml
image: "/images/publications/your-image.jpg"
imageCaption: "Figure caption here"
imageWidth: 1280
imageHeight: 720
imageAspectRatio: "16:9"
```

## Other Scripts

- `generate-sitemap.js` - Generates a sitemap for the website
- `generate-rss.js` - Generates RSS feeds for the website 