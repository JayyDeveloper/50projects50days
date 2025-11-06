const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
  constructor() {
    this.watermarkPath = path.join(__dirname, '../assets/watermark.png');
    this.outputDir = path.join(__dirname, '../uploads/processed');
  }

  /**
   * Generate thumbnail from original image
   */
  async generateThumbnail(inputPath, outputPath, width = 400, height = 300) {
    try {
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const metadata = await sharp(outputPath).metadata();

      return {
        url: outputPath,
        width: metadata.width,
        height: metadata.height,
        size: stats.size
      };
    } catch (error) {
      throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
  }

  /**
   * Generate preview image with watermark
   */
  async generateWatermarkedPreview(inputPath, outputPath, maxWidth = 1920, maxHeight = 1080) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if needed
      let processedImage = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Add watermark
      const watermarkText = 'AI WALLPAPER PLATFORM';
      const svgWatermark = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <defs>
            <pattern id="watermark" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <text x="50" y="200" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.3)" font-weight="bold">
                ${watermarkText}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#watermark)" />
        </svg>
      `;

      await processedImage
        .composite([{
          input: Buffer.from(svgWatermark),
          gravity: 'center'
        }])
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const resultMetadata = await sharp(outputPath).metadata();

      return {
        url: outputPath,
        width: resultMetadata.width,
        height: resultMetadata.height,
        size: stats.size,
        watermarked: true
      };
    } catch (error) {
      throw new Error(`Failed to generate watermarked preview: ${error.message}`);
    }
  }

  /**
   * Process and optimize original image
   */
  async processOriginal(inputPath, outputPath, format = 'jpeg') {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let processed;
      if (format === 'png') {
        processed = image.png({ quality: 95, compressionLevel: 9 });
      } else if (format === 'webp') {
        processed = image.webp({ quality: 95 });
      } else {
        processed = image.jpeg({ quality: 95 });
      }

      await processed.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const resultMetadata = await sharp(outputPath).metadata();

      return {
        url: outputPath,
        width: resultMetadata.width,
        height: resultMetadata.height,
        size: stats.size,
        format: format
      };
    } catch (error) {
      throw new Error(`Failed to process original: ${error.message}`);
    }
  }

  /**
   * Convert image to different formats for device compatibility
   */
  async convertToMultipleFormats(inputPath, baseName) {
    try {
      const formats = ['jpeg', 'png', 'webp'];
      const results = {};

      for (const format of formats) {
        const outputPath = path.join(this.outputDir, `${baseName}.${format}`);
        results[format] = await this.processOriginal(inputPath, outputPath, format);
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to convert formats: ${error.message}`);
    }
  }

  /**
   * Upscale image using sharp (basic upscaling)
   */
  async upscaleImage(inputPath, outputPath, scaleFactor = 2) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      const newWidth = Math.round(metadata.width * scaleFactor);
      const newHeight = Math.round(metadata.height * scaleFactor);

      await image
        .resize(newWidth, newHeight, {
          kernel: sharp.kernel.lanczos3
        })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const resultMetadata = await sharp(outputPath).metadata();

      return {
        url: outputPath,
        width: resultMetadata.width,
        height: resultMetadata.height,
        size: stats.size
      };
    } catch (error) {
      throw new Error(`Failed to upscale image: ${error.message}`);
    }
  }

  /**
   * Extract EXIF and metadata from image
   */
  async extractMetadata(inputPath) {
    try {
      const metadata = await sharp(inputPath).metadata();

      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        space: metadata.space,
        channels: metadata.channels,
        depth: metadata.depth,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation,
        exif: metadata.exif
      };
    } catch (error) {
      throw new Error(`Failed to extract metadata: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessor();
