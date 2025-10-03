#!/usr/bin/env python3
"""Generate all format conversion entries for toolsConfig.ts"""

# Supported input formats (can be converted FROM these)
input_formats = ['ai', 'psd', 'eps', 'cdr', 'obj', 'fbx', 'stl', 'gltf', 'xcf']

# Supported output formats (can be converted TO these)
output_formats = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg', 'avif', 'heic', 'pcx', 'pdf']

# Generate entries
entries = []

for input_fmt in input_formats:
    for output_fmt in output_formats:
        entry = f"""  '{input_fmt}-to-{output_fmt}': {{
    component: 'SEOOptimizedImageConverter',
    props: {{ sourceFormat: '{input_fmt}', targetFormat: '{output_fmt}' }},
    type: 'image'
  }},"""
        entries.append(entry)

# Print all entries
print("\n  // Additional format conversions (AI, PSD, EPS, CDR, 3D formats)")
for entry in entries:
    print(entry)
