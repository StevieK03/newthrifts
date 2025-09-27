# New Thrifts - Shopify Theme

A modern, responsive Shopify theme with premium features and enhanced user experience.

## Features

- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Premium Product Cards** - Enhanced product display with hover effects
- **Interactive Swatches** - Color selection with bubble effects
- **Mobile-First Navigation** - Touch-friendly mobile experience
- **Fast Loading** - Optimized for performance
- **SEO Optimized** - Built with search engine optimization in mind

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- Shopify CLI
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/newthrifts-theme.git
cd newthrifts-theme
```

2. Install Shopify CLI:
```bash
npm install -g @shopify/cli @shopify/theme
```

3. Connect to your Shopify store:
```bash
shopify theme dev --store=your-store-name.myshopify.com
```

### Development Workflow

1. **Make changes** to theme files
2. **Test locally** with `shopify theme dev`
3. **Commit changes** to Git:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```
4. **Deploy to store**:
```bash
shopify theme push --store=your-store-name.myshopify.com
```

## File Structure

```
├── assets/          # CSS, JavaScript, and image files
├── config/          # Theme settings and configuration
├── layout/          # Theme layout templates
├── locales/         # Translation files
├── sections/        # Reusable theme sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates
```

## Key Sections

- `featured-collection.liquid` - Homepage product showcase
- `main-product.liquid` - Individual product pages
- `theme.liquid` - Main layout template

## Customization

The theme includes several customizable sections:
- Hero banners
- Featured collections
- Product grids
- Interactive elements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@newthrifts.com or create an issue in this repository.