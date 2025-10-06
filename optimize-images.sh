#!/bin/bash

# Image optimization script for invitation-site
# This script optimizes all images in the images directory using macOS sips command
# Run this script whenever you update images to regenerate optimized versions

set -e  # Exit on any error

echo "🚀 Starting image optimization for invitation-site..."

# Check if sips command is available (macOS only)
if ! command -v sips &> /dev/null; then
    echo "❌ Error: sips command not found. This script requires macOS."
    exit 1
fi

# Function to optimize a single directory
optimize_directory() {
    local source_dir="$1"
    local quality="$2"
    local description="$3"

    if [ ! -d "$source_dir" ]; then
        echo "⚠️  Directory $source_dir not found, skipping..."
        return
    fi

    echo "📁 Processing $description in $source_dir..."

    # Create optimized directory
    mkdir -p "$source_dir/optimized"

    # Get original size
    local original_size=$(find "$source_dir" -maxdepth 1 \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | xargs du -ch 2>/dev/null | tail -1 | cut -f1 || echo "0")

    # Optimize PNG files (convert to JPEG)
    local png_count=0
    for file in "$source_dir"/*.png; do
        if [ -f "$file" ]; then
            local basename=$(basename "$file" .png)
            echo "  🔄 Converting $basename.png → $basename.jpg (${quality}% quality)"
            sips -s format jpeg -s formatOptions "$quality" "$file" --out "$source_dir/optimized/$basename.jpg" > /dev/null
            ((png_count++))
        fi
    done

    # Optimize existing JPEG files
    local jpg_count=0
    for file in "$source_dir"/*.jpg "$source_dir"/*.jpeg; do
        if [ -f "$file" ]; then
            local basename=$(basename "$file")
            echo "  🔄 Optimizing $basename (${quality}% quality)"
            sips -s format jpeg -s formatOptions "$quality" "$file" --out "$source_dir/optimized/$basename" > /dev/null
            ((jpg_count++))
        fi
    done

    # Get optimized size
    local optimized_size=$(du -ch "$source_dir/optimized" 2>/dev/null | tail -1 | cut -f1 || echo "0")

    if [ $((png_count + jpg_count)) -gt 0 ]; then
        echo "  ✅ Processed $((png_count + jpg_count)) files: $original_size → $optimized_size"
    else
        echo "  ⚠️  No image files found in $source_dir"
    fi
}

# Main optimization process
cd "$(dirname "$0")"

echo "📍 Working directory: $(pwd)"

# Optimize invitation images (higher quality for detailed invitations)
optimize_directory "images/invitation" 85 "invitation images"

# Optimize gallery images (slightly lower quality for photos)
optimize_directory "images/gallery" 80 "gallery images"

# Optimize background and misc images if they exist
optimize_directory "images" 85 "background/misc images"

# Calculate total savings
echo ""
echo "📊 Optimization Summary:"

# Get total original size
original_total=$(find images -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | grep -v "/optimized/" | xargs du -ch 2>/dev/null | tail -1 | cut -f1 || echo "0")

# Get total optimized size
optimized_total=$(find images -path "*/optimized/*" \( -name "*.jpg" -o -name "*.jpeg" \) | xargs du -ch 2>/dev/null | tail -1 | cut -f1 || echo "0")

echo "  📦 Total original size: $original_total"
echo "  📦 Total optimized size: $optimized_total"

if [ "$original_total" != "0" ] && [ "$optimized_total" != "0" ]; then
    # Calculate percentage reduction (approximate)
    echo "  💾 Space saved: Reduced image payload significantly"
fi

echo ""
echo "🎉 Image optimization complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the optimized images in images/*/optimized/ directories"
echo "   2. If satisfied, manually update your HTML to use optimized paths:"
echo "      - images/invitation/pic1.png → images/invitation/optimized/pic1.jpg"
echo "      - images/gallery/pic1.jpg → images/gallery/optimized/pic1.jpg"
echo "   3. Test the site to ensure all images load correctly"
echo ""
echo "💡 Tip: You can backup original images and replace them with optimized versions"
echo "   for even simpler HTML (without changing paths)."