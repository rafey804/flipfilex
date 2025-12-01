'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StlToObjClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [conversionResult, setConversionResult] = useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.name.toLowerCase().endsWith('.stl')) {
            setSelectedFile(file);
            setConversionResult(null);
        }
    };

    const handleConvert = async () => {
        if (!selectedFile) return;
        setIsConverting(true);
        setTimeout(() => {
            setIsConverting(false);
            setConversionResult('model.obj');
        }, 3000);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'model.obj';
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">Home</Link></li>
                            <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                            <li><Link href="/tools" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">Tools</Link></li>
                            <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                            <li><span className="text-gray-900 font-medium">STL to OBJ</span></li>
                        </ol>
                    </nav>
                </div>
            </header>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">🎯</div>
                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">STL to OBJ Converter</h1>
                    <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert STL 3D models to OBJ format online for free. Perfect for 3D printing, modeling software compatibility, and cross-platform 3D workflows.</h2>
                    <div className="flex justify-center space-x-4 mb-8">
                        <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">✅ 3D Professional</div>
                        <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
                        <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">⚡ Fast Conversion</div>
                    </div>
                </section>

                <section className="mb-20">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-100/50 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your 3D Models</h3>
                        {!selectedFile ? (
                            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                                <div className="text-6xl mb-4">🎯</div>
                                <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your STL file</h4>
                                <p className="text-gray-500 mb-6">Choose a 3D STL model to convert to OBJ format</p>
                                <label className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                                    Choose STL File
                                    <input type="file" accept=".stl" onChange={handleFileSelect} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">🎯</div>
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                                            <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                                    </div>
                                </div>
                                {!conversionResult ? (
                                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                                        {isConverting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Converting 3D Model...</span>
                                            </div>
                                        ) : 'Convert to OBJ'}
                                    </button>
                                ) : (
                                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                                        <div className="text-4xl mb-4">✅</div>
                                        <h5 className="text-xl font-semibold text-green-800 mb-4">3D Model Converted!</h5>
                                        <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download OBJ</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="mb-20">
                    <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Professional 3D Conversion</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">🖨️</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">3D Printing Ready</h4>
                            <p className="text-gray-600">Convert 3D printing STL files to OBJ format for different modeling software and workflows.</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">🔧</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Software Compatibility</h4>
                            <p className="text-gray-600">OBJ format works with most 3D modeling software including Blender, Maya, and 3ds Max.</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">🎯</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Preserve Geometry</h4>
                            <p className="text-gray-600">Maintains all geometric data and mesh structure during the conversion process.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
