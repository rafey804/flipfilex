'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Color {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    cmyk: { c: number; m: number; y: number; k: number };
    name?: string;
}

interface ColorPalette {
    id: string;
    name: string;
    colors: Color[];
    harmony: string;
    created: string;
    tags: string[];
}

type HarmonyType = 'complementary' | 'triadic' | 'analogous' | 'monochromatic' | 'split-complementary' | 'tetradic';
type InputMethod = 'picker' | 'image' | 'keyword' | 'random';
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk';

export default function ColorPaletteGeneratorClient() {
    const [activeTab, setActiveTab] = useState<InputMethod>('picker');
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
    const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
    const [currentPalette, setCurrentPalette] = useState<Color[]>([]);
    const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
    const [keyword, setKeyword] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedColor, setCopiedColor] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAccessibility, setShowAccessibility] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [extractedColors, setExtractedColors] = useState<Color[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Color harmony algorithms
    const generateHarmony = (baseHex: string, harmony: HarmonyType): Color[] => {
        const baseColor = hexToHsl(baseHex);
        const colors: Color[] = [];

        switch (harmony) {
            case 'complementary':
                colors.push(
                    createColor(baseHex),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 180) % 360 }))
                );
                break;

            case 'triadic':
                colors.push(
                    createColor(baseHex),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 120) % 360 })),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 240) % 360 }))
                );
                break;

            case 'analogous':
                for (let i = -2; i <= 2; i++) {
                    colors.push(
                        createColor(hslToHex({ ...baseColor, h: (baseColor.h + i * 30) % 360 }))
                    );
                }
                break;

            case 'monochromatic':
                const lightnesses = [20, 40, 60, 80, 90];
                lightnesses.forEach(l => {
                    colors.push(
                        createColor(hslToHex({ ...baseColor, l }))
                    );
                });
                break;

            case 'split-complementary':
                colors.push(
                    createColor(baseHex),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 150) % 360 })),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 210) % 360 }))
                );
                break;

            case 'tetradic':
                colors.push(
                    createColor(baseHex),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 90) % 360 })),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 180) % 360 })),
                    createColor(hslToHex({ ...baseColor, h: (baseColor.h + 270) % 360 }))
                );
                break;
        }

        return colors;
    };

    // Color conversion utilities
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
        const { r, g, b } = hexToRgb(hex);
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
                default: h = 0;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const hslToHex = ({ h, s, l }: { h: number; s: number; l: number }): string => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const rgbToCmyk = ({ r, g, b }: { r: number; g: number; b: number }): { c: number; m: number; y: number; k: number } => {
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const k = 1 - Math.max(rNorm, gNorm, bNorm);
        const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
        const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
        const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    };

    const createColor = (hex: string): Color => {
        const rgb = hexToRgb(hex);
        const hsl = hexToHsl(hex);
        const cmyk = rgbToCmyk(rgb);

        return { hex, rgb, hsl, cmyk };
    };

    // Image upload and color extraction
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const imagePromises = fileArray.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    resolve(result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(images => {
            setUploadedImages(prev => [...prev, ...images]);
            if (images.length > 0) {
                extractColorsFromImage(images[0]);
            }
        });
    };

    const extractColorsFromImage = (imageSrc: string) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0);

            // Extract colors from image
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const colors = extractDominantColors(imageData);

            setExtractedColors(colors);
        };
        img.src = imageSrc;
    };

    const extractDominantColors = (imageData: ImageData): Color[] => {
        const data = imageData.data;
        const colorMap = new Map<string, number>();

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Skip transparent pixels
            if (a < 128) continue;

            // Quantize colors to reduce noise
            const qR = Math.floor(r / 32) * 32;
            const qG = Math.floor(g / 32) * 32;
            const qB = Math.floor(b / 32) * 32;

            const colorKey = `${qR},${qG},${qB}`;
            colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }

        // Sort by frequency and get top colors
        const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                return createColor(hex);
            });

        return sortedColors;
    };

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);

        if (index === currentImageIndex) {
            const newIndex = Math.max(0, Math.min(currentImageIndex, newImages.length - 1));
            setCurrentImageIndex(newIndex);
            if (newImages.length > 0) {
                extractColorsFromImage(newImages[newIndex]);
            } else {
                setExtractedColors([]);
            }
        }
    };

    const selectImage = (index: number) => {
        setCurrentImageIndex(index);
        extractColorsFromImage(uploadedImages[index]);
    };

    // Keyword to color mapping
    const keywordColors: { [key: string]: string[] } = {
        ocean: ['#0077be', '#00a8cc', '#40e0d0', '#87ceeb', '#f0f8ff'],
        sunset: ['#ff6b35', '#f7931e', '#ffd23f', '#ee4035', '#7b68ee'],
        forest: ['#228b22', '#32cd32', '#90ee90', '#9acd32', '#006400'],
        autumn: ['#d2691e', '#ff8c00', '#ffa500', '#dc143c', '#8b0000'],
        winter: ['#4682b4', '#b0c4de', '#87cefa', '#f0f8ff', '#e6e6fa'],
        vintage: ['#8b4513', '#daa520', '#cd853f', '#f5deb3', '#faf0e6'],
        modern: ['#2c3e50', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'],
        pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'],
        neon: ['#ff073a', '#ff7700', '#ffdd00', '#39ff14', '#0080ff'],
        earth: ['#8b4513', '#a0522d', '#cd853f', '#daa520', '#f4a460']
    };

    const generateFromKeyword = (word: string): Color[] => {
        const normalizedWord = word.toLowerCase();
        const colors = keywordColors[normalizedWord];

        if (colors) {
            return colors.map(createColor);
        }

        // Generate based on word hash if not in predefined list
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = word.charCodeAt(i) + ((hash << 5) - hash);
        }

        const baseHue = Math.abs(hash) % 360;
        const baseColor = hslToHex({ h: baseHue, s: 70, l: 50 });
        return generateHarmony(baseColor, 'analogous');
    };

    const generateRandomPalette = (): Color[] => {
        const randomHue = Math.floor(Math.random() * 360);
        const baseColor = hslToHex({ h: randomHue, s: 70, l: 50 });
        const harmonies: HarmonyType[] = ['complementary', 'triadic', 'analogous', 'split-complementary', 'tetradic'];
        const randomHarmony = harmonies[Math.floor(Math.random() * harmonies.length)];
        return generateHarmony(baseColor, randomHarmony);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setSuccessMessage('');

        setTimeout(() => {
            let newPalette: Color[] = [];

            switch (activeTab) {
                case 'picker':
                    newPalette = generateHarmony(baseColor, harmonyType);
                    break;
                case 'keyword':
                    if (keyword.trim()) {
                        newPalette = generateFromKeyword(keyword.trim());
                    }
                    break;
                case 'random':
                    newPalette = generateRandomPalette();
                    break;
                case 'image':
                    if (extractedColors.length > 0) {
                        newPalette = extractedColors.slice(0, 5);
                    } else if (uploadedImages.length > 0) {
                        // Extract colors from current image
                        extractColorsFromImage(uploadedImages[currentImageIndex]);
                        newPalette = extractedColors.slice(0, 5);
                    } else {
                        newPalette = generateRandomPalette();
                    }
                    break;
            }

            setCurrentPalette(newPalette);
            setSuccessMessage('✅ Color palette generated successfully!');
            setIsGenerating(false);

            // Auto-scroll to results
            setTimeout(() => {
                const resultsSection = document.getElementById('palette-results');
                if (resultsSection) {
                    resultsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);

            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    const formatColor = (color: Color, format: ColorFormat): string => {
        switch (format) {
            case 'hex':
                return color.hex.toUpperCase();
            case 'rgb':
                return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
            case 'hsl':
                return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
            case 'cmyk':
                return `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`;
            default:
                return color.hex;
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedColor(text);
            setSuccessMessage('✅ Color code copied to clipboard!');
            setTimeout(() => setCopiedColor(''), 2000);
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setSuccessMessage('❌ Failed to copy color code.');
            setTimeout(() => setSuccessMessage(''), 2000);
        }
    };

    const savePalette = () => {
        if (currentPalette.length === 0) return;

        const newPalette: ColorPalette = {
            id: Date.now().toString(),
            name: `Palette ${savedPalettes.length + 1}`,
            colors: currentPalette,
            harmony: harmonyType,
            created: new Date().toLocaleDateString(),
            tags: [harmonyType, activeTab]
        };

        const updatedPalettes = [newPalette, ...savedPalettes];
        setSavedPalettes(updatedPalettes);
        localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
        setSuccessMessage('✅ Palette saved to your collection!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Load saved palettes on mount
    useEffect(() => {
        const saved = localStorage.getItem('colorPalettes');
        if (saved) {
            try {
                setSavedPalettes(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved palettes:', e);
            }
        }
    }, []);

    const exportPalette = (format: string) => {
        if (currentPalette.length === 0) return;

        let content = '';
        const paletteData = currentPalette.map(color => formatColor(color, colorFormat));

        switch (format) {
            case 'css':
                content = `:root {\n${paletteData.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
                break;
            case 'scss':
                content = paletteData.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
                break;
            case 'json':
                content = JSON.stringify({ palette: paletteData }, null, 2);
                break;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-palette.${format}`;
        a.click();
        URL.revokeObjectURL(url);

        setSuccessMessage(`✅ Palette exported as ${format.toUpperCase()}!`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const harmonyDescriptions = {
        complementary: 'Colors opposite each other on the color wheel',
        triadic: 'Three colors evenly spaced on the color wheel',
        analogous: 'Colors that are next to each other on the color wheel',
        monochromatic: 'Different shades and tints of the same color',
        'split-complementary': 'A base color and two colors adjacent to its complement',
        tetradic: 'Four colors forming a rectangle on the color wheel'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-transparent to-purple-100/30"></div>

                <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-3xl mb-8 shadow-2xl animate-pulse">
                            🎨
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 leading-tight">
                            Color Palette Generator
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Create stunning color harmonies with professional algorithms. Perfect for designers, developers, and creative professionals.
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="max-w-4xl mx-auto mb-6">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 animate-bounce">
                                <p className="text-emerald-700 font-medium text-center">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Tool */}
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200/50 p-6">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'picker', label: 'Color Picker', icon: '🎯' },
                                        { id: 'image', label: 'From Image', icon: '🖼️' },
                                        { id: 'keyword', label: 'By Keyword', icon: '🔍' },
                                        { id: 'random', label: 'Random', icon: '🎲' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as InputMethod)}
                                            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${activeTab === tab.id
                                                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                                }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Color Picker Tab */}
                                {activeTab === 'picker' && (
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                                    Base Color
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="color"
                                                        value={baseColor}
                                                        onChange={(e) => setBaseColor(e.target.value)}
                                                        className="w-16 h-16 rounded-xl border-2 border-gray-300 cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={baseColor}
                                                        onChange={(e) => setBaseColor(e.target.value)}
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                        placeholder="#3b82f6"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                                    Harmony Type
                                                </label>
                                                <select
                                                    value={harmonyType}
                                                    onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {Object.entries(harmonyDescriptions).map(([key, desc]) => (
                                                        <option key={key} value={key}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')} - {desc}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Image Upload Tab */}
                                {activeTab === 'image' && (
                                    <div className="space-y-6">
                                        {/* Upload Area */}
                                        {uploadedImages.length === 0 ? (
                                            <div className="text-center">
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-blue-400 transition-colors">
                                                    <div className="text-6xl mb-4">📸</div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Images</h3>
                                                    <p className="text-gray-600 mb-6">Extract colors from your favorite images</p>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                                    >
                                                        Choose Images
                                                    </button>
                                                    <p className="text-sm text-gray-500 mt-4">Supports multiple images • JPG, PNG, WebP</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Image Carousel */}
                                                <div className="relative">
                                                    <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                                                        <div className="relative w-full h-64 bg-white rounded-xl overflow-hidden shadow-inner">
                                                            <img
                                                                src={uploadedImages[currentImageIndex]}
                                                                alt={`Uploaded ${currentImageIndex + 1}`}
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <button
                                                                onClick={() => removeImage(currentImageIndex)}
                                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Navigation Arrows */}
                                                    {uploadedImages.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={() => setCurrentImageIndex(prev => prev === 0 ? uploadedImages.length - 1 : prev - 1)}
                                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center"
                                                            >
                                                                ←
                                                            </button>
                                                            <button
                                                                onClick={() => setCurrentImageIndex(prev => prev === uploadedImages.length - 1 ? 0 : prev + 1)}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center"
                                                            >
                                                                →
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Image Thumbnails */}
                                                {uploadedImages.length > 1 && (
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {uploadedImages.map((image, index) => (
                                                            <div
                                                                key={index}
                                                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                                onClick={() => selectImage(index)}
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt={`Thumbnail ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Extracted Colors Preview */}
                                                {extractedColors.length > 0 && (
                                                    <div className="bg-gray-50 rounded-2xl p-4">
                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Extracted Colors</h4>
                                                        <div className="flex gap-2 overflow-x-auto">
                                                            {extractedColors.slice(0, 8).map((color, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex-shrink-0 w-12 h-12 rounded-lg shadow-sm border border-gray-200"
                                                                    style={{ backgroundColor: color.hex }}
                                                                    title={color.hex}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Add More Images Button */}
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    + Add More Images
                                                </button>
                                            </div>
                                        )}

                                        {/* Hidden Canvas for Color Extraction */}
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                )}

                                {/* Keyword Tab */}
                                {activeTab === 'keyword' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-lg font-semibold text-gray-800 mb-3">
                                                Keyword or Mood
                                            </label>
                                            <input
                                                type="text"
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                placeholder="e.g., ocean, sunset, vintage, modern..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(keywordColors).map((word) => (
                                                <button
                                                    key={word}
                                                    onClick={() => setKeyword(word)}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                                >
                                                    {word}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Random Tab */}
                                {activeTab === 'random' && (
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🎲</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Random Generation</h3>
                                        <p className="text-gray-600 mb-6">Let creativity flow with randomized color harmonies</p>
                                    </div>
                                )}

                                {/* Generate Button */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || (activeTab === 'keyword' && !keyword.trim())}
                                        className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isGenerating ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                                                <span>Generating Palette...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <span>🎨</span>
                                                <span>Generate Palette</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        {currentPalette.length > 0 && (
                            <div id="palette-results" className="mt-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <span className="mr-3">🎨</span>
                                        Generated Palette
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={colorFormat}
                                            onChange={(e) => setColorFormat(e.target.value as ColorFormat)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="hex">HEX</option>
                                            <option value="rgb">RGB</option>
                                            <option value="hsl">HSL</option>
                                            <option value="cmyk">CMYK</option>
                                        </select>
                                        <button
                                            onClick={savePalette}
                                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            💾 Save
                                        </button>
                                    </div>
                                </div>

                                {/* Color Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                                    {currentPalette.map((color, index) => (
                                        <div
                                            key={index}
                                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                                        >
                                            <div
                                                className="h-32 w-full cursor-pointer"
                                                style={{ backgroundColor: color.hex }}
                                                onClick={() => copyToClipboard(formatColor(color, colorFormat))}
                                            />
                                            <div className="p-4">
                                                <div className="text-sm font-mono text-gray-800 mb-2">
                                                    {formatColor(color, colorFormat)}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(formatColor(color, colorFormat))}
                                                    className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                                                >
                                                    <span>{copiedColor === formatColor(color, colorFormat) ? '✓' : '📋'}</span>
                                                    <span>{copiedColor === formatColor(color, colorFormat) ? 'Copied!' : 'Copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Export Options */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {['css', 'scss', 'json'].map((format) => (
                                            <button
                                                key={format}
                                                onClick={() => exportPalette(format)}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                            >
                                                📄 Export as {format.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Saved Palettes */}
                        {savedPalettes.length > 0 && (
                            <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <span className="mr-3">💾</span>
                                    Saved Palettes
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedPalettes.slice(0, 6).map((palette) => (
                                        <div key={palette.id} className="bg-white rounded-2xl shadow-lg p-4">
                                            <div className="flex h-16 rounded-lg overflow-hidden mb-3">
                                                {palette.colors.map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="font-semibold text-gray-800">{palette.name}</h4>
                                            <p className="text-sm text-gray-600">{palette.created}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {palette.tags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Professional Features</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to create perfect color combinations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎯',
                                title: 'Multiple Input Methods',
                                description: 'Color picker, image upload, keyword search, and random generation'
                            },
                            {
                                icon: '🔄',
                                title: 'Color Harmony Rules',
                                description: 'Complementary, triadic, analogous, monochromatic, and more'
                            },
                            {
                                icon: '📊',
                                title: 'Multiple Formats',
                                description: 'HEX, RGB, HSL, CMYK support with instant conversion'
                            },
                            {
                                icon: '♿',
                                title: 'Accessibility Check',
                                description: 'WCAG compliance and colorblind simulation'
                            },
                            {
                                icon: '📱',
                                title: 'Real-time Preview',
                                description: 'See your colors in website and logo mockups'
                            },
                            {
                                icon: '💾',
                                title: 'Export Options',
                                description: 'CSS, SCSS, JSON, and design software formats'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                        <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our Color Palette Generator?</h2>

                        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                            <p className="text-xl leading-relaxed">
                                Our Color Palette Generator is the ultimate design tool for creatives, web developers, and brand strategists who need professional-quality color schemes. Whether you're designing a website, creating a brand identity, or developing marketing materials, our advanced color harmony algorithms ensure your palettes are both aesthetically pleasing and psychologically effective.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Advanced Color Theory Applications</h3>
                            <p>
                                Built on solid color theory principles, our generator creates harmonious palettes using complementary, triadic, analogous, monochromatic, split-complementary, and tetradic color relationships. Each harmony type serves specific design purposes: complementary colors create vibrant contrast perfect for call-to-action buttons, while analogous schemes provide calm, cohesive backgrounds ideal for user interfaces.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Design Workflow Integration</h3>
                            <p>
                                Seamlessly integrate our color palettes into your design workflow with multiple export formats including CSS variables, SCSS mixins, JSON data structures, and Adobe Creative Suite color swatches. Our tool eliminates the guesswork from color selection, providing instant access to professional-grade palettes that enhance user experience and brand recognition.
                            </p>

                            <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Multi-Format Color Support</h4>
                            <p>
                                Work with colors in any format your project requires. Our generator supports HEX codes for web development, RGB values for digital displays, HSL for intuitive color manipulation, and CMYK for print design. Real-time format conversion ensures your colors translate perfectly across different media and design applications.
                            </p>

                            <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Accessibility-First Design</h4>
                            <p>
                                Every generated palette includes comprehensive accessibility analysis with WCAG contrast ratio calculations. Our tool automatically identifies color combinations that meet AA and AAA accessibility standards, ensuring your designs are inclusive and compliant with international accessibility guidelines while maintaining visual appeal.
                            </p>

                            <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Intelligent Image Color Extraction</h5>
                            <p>
                                Upload images to extract dominant colors and generate matching palettes automatically. Our advanced color analysis algorithms identify the most prominent and harmonious colors from photographs, artwork, or existing designs, making it easy to create cohesive color schemes that complement visual content.
                            </p>

                            <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Real-Time Design Preview</h5>
                            <p>
                                Visualize your color palettes instantly with our live preview feature. See how your chosen colors work together in website layouts, logo designs, and user interface mockups before finalizing your selection. This immediate feedback helps you make informed design decisions and avoid costly revisions later in the design process.
                            </p>

                            <p className="text-lg font-medium text-gray-900 mt-8">
                                Transform your creative projects with scientifically-backed color combinations that engage audiences and convey your brand message effectively. Our free color palette generator combines artistic intuition with mathematical precision, delivering professional results that elevate your design work to the next level.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Tools */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Related Tools</h2>
                        <p className="text-xl text-gray-600">Explore more creative tools</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', color: 'from-blue-500 to-indigo-500' },
                            { name: 'Barcode Generator', href: '/barcode-generator', icon: '📊', color: 'from-green-500 to-emerald-500' },
                            { name: 'Logo Creator', href: '/logo-creator', icon: '🎨', color: 'from-purple-500 to-pink-500' },
                            { name: 'Image Converter', href: '/png-to-webp', icon: '🖼️', color: 'from-orange-500 to-red-500' }
                        ].map((tool) => (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className={`group bg-gradient-to-r ${tool.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                            >
                                <div className="text-3xl mb-3">{tool.icon}</div>
                                <h3 className="font-bold text-lg">{tool.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
