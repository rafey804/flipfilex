'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllSourceFormats,
  getTargetFormats,
  getConversionSlug,
  getFormatDisplayName,
  getFormatCategory,
  categoryInfo,
} from '@/lib/formatMappings';

interface FormatSelectorProps {
  currentSourceFormat: string;
  currentTargetFormat: string;
  currentSlug: string;
}

export default function FormatSelector({
  currentSourceFormat,
  currentTargetFormat,
  currentSlug,
}: FormatSelectorProps) {
  const router = useRouter();
  const [sourceFormat, setSourceFormat] = useState(currentSourceFormat);
  const [targetFormat, setTargetFormat] = useState(currentTargetFormat);
  const [availableTargets, setAvailableTargets] = useState<string[]>([]);

  // Get all available source formats
  const allSourceFormats = getAllSourceFormats();

  // Update available target formats when source changes
  useEffect(() => {
    if (sourceFormat) {
      const targets = getTargetFormats(sourceFormat);
      setAvailableTargets(targets);

      // If current target is not available for new source, reset to first available
      if (targets.length > 0 && !targets.includes(targetFormat)) {
        setTargetFormat(targets[0]);
      }
    }
  }, [sourceFormat]);

  // Handle source format change
  const handleSourceChange = (newSource: string) => {
    setSourceFormat(newSource);
    const targets = getTargetFormats(newSource);
    if (targets.length > 0) {
      setTargetFormat(targets[0]);
    }
  };

  // Handle target format change
  const handleTargetChange = (newTarget: string) => {
    setTargetFormat(newTarget);
  };

  // Handle conversion navigation
  const handleConvert = () => {
    if (sourceFormat && targetFormat) {
      const slug = getConversionSlug(sourceFormat, targetFormat);
      if (slug !== currentSlug) {
        router.push(`/${slug}`);
      }
    }
  };

  // Get category icon for a format
  const getCategoryIcon = (format: string) => {
    const category = getFormatCategory(format);
    return categoryInfo[category as keyof typeof categoryInfo]?.icon || '📄';
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
          Choose Your Conversion
        </h3>

        <div className="grid md:grid-cols-2 gap-3 mb-3">
          {/* Source Format Selector */}
          <div>
            <label
              htmlFor="source-format"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              From
            </label>
            <div className="relative">
              <select
                id="source-format"
                value={sourceFormat}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="block w-full px-3 py-2.5 pr-8 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white shadow-sm hover:border-gray-400 transition-all cursor-pointer appearance-none"
              >
                <option value="">Select source format...</option>

                {/* Image Formats */}
                <optgroup label="📷 Image Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'image')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* Document Formats */}
                <optgroup label="📄 Document Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'document')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* Audio Formats */}
                <optgroup label="🎵 Audio Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'audio')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* Video Formats */}
                <optgroup label="🎬 Video Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'video')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* Font Formats */}
                <optgroup label="🔤 Font Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'font')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* PDF Operations */}
                <optgroup label="📕 PDF Tools">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'pdf')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>

                {/* 3D/CAD Formats */}
                <optgroup label="🎨 3D/CAD Formats">
                  {allSourceFormats
                    .filter(f => getFormatCategory(f) === 'ai')
                    .map((format) => (
                      <option key={format} value={format}>
                        {getFormatDisplayName(format)}
                      </option>
                    ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Target Format Selector */}
          <div>
            <label
              htmlFor="target-format"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              To
            </label>
            <div className="relative">
              <select
                id="target-format"
                value={targetFormat}
                onChange={(e) => handleTargetChange(e.target.value)}
                disabled={!sourceFormat || availableTargets.length === 0}
                className={`block w-full px-3 py-2.5 pr-8 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm transition-all appearance-none ${
                  !sourceFormat || availableTargets.length === 0
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400'
                    : 'bg-white border-gray-300 hover:border-gray-400 cursor-pointer'
                }`}
              >
                {availableTargets.length === 0 ? (
                  <option value="">Select source format first...</option>
                ) : (
                  <>
                    <option value="">Select target format...</option>

                    {/* Group targets by category */}
                    {['image', 'document', 'audio', 'video', 'font', 'pdf', 'ai'].map((cat) => {
                      const categoryFormats = availableTargets.filter(
                        (f) => getFormatCategory(f) === cat
                      );
                      if (categoryFormats.length === 0) return null;

                      const categoryLabel = categoryInfo[cat as keyof typeof categoryInfo];
                      if (!categoryLabel) return null;

                      return (
                        <optgroup
                          key={cat}
                          label={`${categoryLabel.icon} ${categoryLabel.name}`}
                        >
                          {categoryFormats.map((format) => (
                            <option key={format} value={format}>
                              {getFormatDisplayName(format)}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Go Button */}
        <button
          onClick={handleConvert}
          disabled={
            !sourceFormat ||
            !targetFormat ||
            getConversionSlug(sourceFormat, targetFormat) === currentSlug
          }
          className={`w-full py-2.5 px-6 rounded-lg font-semibold text-sm transition-all shadow ${
            !sourceFormat ||
            !targetFormat ||
            getConversionSlug(sourceFormat, targetFormat) === currentSlug
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg'
          }`}
        >
          {getConversionSlug(sourceFormat, targetFormat) === currentSlug
            ? 'Current Converter'
            : 'Go to Converter →'}
        </button>
      </div>
    </div>
  );
}
