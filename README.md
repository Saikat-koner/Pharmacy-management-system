# Pharmacy Management System (Frontend)
## CSE326: Web Technologies — First Year Project

A clean, accessible, light-themed Pharmacy Management System built strictly adhering to the first-year curriculum: **Unit I (HTML Fundamentals)**, **Unit II (Semantic HTML & Forms)**, and **Unit III (Cascading Style Sheets)**.

---

## 📚 Exact Syllabus Mapping

### 1. Unit I: HTML Fundamentals
- **Introduction to Internet and Web Technologies**: Explains web clients, servers, and HTTP/HTTPS communications.
- **Client-Server Architecture**: Dedicated visual flow showing browser client requests, HTTP methods (GET/POST), DNS lookup, and server response.
- **HTML5 Fundamentals & Document Structure**: Accessible `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`.
- **HTML Elements and Attributes**: Proper attribute usage (`id`, `class`, `src`, `href`, `target`, `alt`, `lang`, `loading="lazy"`).
- **Text Formatting**: Chemical nomenclature using `<sub>` (e.g. C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>), `<sup>` (10<sup>-3</sup>), plus `<mark>`, `<del>`, `<ins>`, `<small>`, and `<abbr>`.
- **Lists**: Ordered lists (`<ol>`) for Standard Operating Procedures, Unordered lists (`<ul>`) for safety checklists, and Description lists (`<dl>`, `<dt>`, `<dd>`) for medical terminology.
- **Hyperlinks and Images**: Anchor tags with `href`, `target="_blank"`, `rel="noopener noreferrer"`, `tel:`, `mailto:`, and internal section links.
- **SVG Graphics**: Inline vector SVG icons (`<rect>`, `<circle>`, `<path>`) for cross, capsule, and pulse symbols.
- **Multimedia Elements (Audio, Video, Iframes)**: Native `<audio controls>`, `<video controls>` with `<figure>` and `<figcaption>`, and OpenStreetMap `<iframe loading="lazy">`.
- **SEO Fundamentals & Best Practices**: Semantic heading hierarchy (`h1` → `h2` → `h3`), descriptive meta tags, lowercase tags, and quoted attributes.

---

### 2. Unit II: Semantic HTML and Forms
- **Semantic HTML Elements**: Structured layout using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>`.
- **Page Structure and Layout**: Organized sections for Inventory, Registration, Multimedia, and Point of Sale.
- **Accessibility Fundamentals**: ARIA roles, `aria-label`, `aria-describedby`, `<label for="...">`, and high-contrast color choices.
- **Forms and Form Controls**: Grouped into 3 `<fieldset>` containers with `<legend>` captions.
- **Input Types and Attributes**: Uses `text`, `number`, `date`, `time`, `range`, `color`, `radio`, `checkbox`, and `file`, with attributes `required`, `pattern`, `min`, `max`, `step`, and `maxlength`.
- **Form Validation Basics**: Native HTML5 constraint validation with pattern matching and required fields.
- **Tables and Data Representation**: Accessible tabular records with `<table>`, `<caption>`, `<colgroup>`, `<col>`, `<thead>`, `<tbody>`, `<tfoot>`, and headers using `scope="col"` and `scope="row"`.

---

### 3. Unit III: Cascading Style Sheets (CSS)
- **Introduction to CSS & Syntax**: Modular CSS rules with structured styling.
- **CSS Selectors and Specificity**: Element, class, ID, child, descendant, and attribute selectors (`input[type="text"]`).
- **Colors and Backgrounds**: Light healthcare color scheme using pastel greens (`#059669`), teals (`#0d9488`), and soft slate neutrals.
- **Units and Measurements**: Scalable units (`rem`, `px`, `%`, `vh`, `vw`, `ch`).
- **Typography & Text Styling**: Font pairings (*Outfit* for headers, *Plus Jakarta Sans* for UI, *JetBrains Mono* for codes).
- **CSS Box Model**: Consistent padding, margins, borders, and global `box-sizing: border-box`.
- **Positioning Techniques**: `static`, `relative`, `absolute`, and `sticky` top navigation with `z-index`.
- **Flexbox & CSS Grid Layout**: CSS Grid for 4-column KPI cards and 12-column billing layout; Flexbox for responsive navigation.
- **Pseudo Classes**: `:hover`, `:focus`, `:active`, `:valid`, `:invalid`, `:nth-child(even)` for table zebra-striping.
- **Pseudo Elements**: `::before`, `::after`, `::placeholder`, and `::selection`.
- **CSS Variables**: Declared in `:root` (`--primary-color`, `--secondary-color`, `--bg-light`).
- **Responsive Web Design**: Mobile-friendly responsive breakpoints (`sm:`, `md:`, `lg:`).
- **CSS Animations & Transitions**: `@keyframes softPulse`, `@keyframes gentleSlideDown`, and `transition: all 0.2s ease`.
- **Print Stylesheet**: Dedicated `@media print` rules for generating physical receipts and PDF documents.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

---

## 🐙 Git & GitHub Push Commands

```bash
git init
git add .
git commit -m "feat: Pharmacy Management System based strictly on CSE326 Units I, II, and III"
git branch -M main
git remote add origin https://github.com/saikatkoner4/pharmacy-management-system.git
git push -u origin main
```
