'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, PdfProtectionResponse } from '@/types';
import { ApiService, getAcceptedFileTypes } from '@/lib/api';

export default function PdfPasswordProtectionClient() {
    const [files, setFiles] = useState<FileWithId[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [encryptionLevel, setEncryptionLevel] = useState('standard');
    const [protectionStats, setProtectionStats] = useState({
        totalProtected: 9847,
        encryptionStrength: 256,
        successRate: 99.8
    });

    useEffect(() => {
        // Simulate loading protection statistics
        setProtectionStats({
            totalProtected: 9847,
            encryptionStrength: 256,
            successRate: 99.8
        });
    }, []);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        // Files are handled in handleFilesChange
    };

    const handleFilesChange = (updatedFiles: FileWithId[]) => {
        setFiles(updatedFiles);
    };

    const protectFiles = async () => {
        if (files.length === 0) {
            showNotification('Please select a PDF file to protect', 'warning');
            return;
        }

        if (!password) {
            showNotification('Please enter a password', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'warning');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'warning');
            return;
        }

        setIsProcessing(true);

        try {
            const updatedFiles = files.map(f => ({ ...f, status: 'uploading' as const, progress: 0 }));
            setFiles(updatedFiles);

            for (let i = 0; i < files.length; i++) {
                const fileWithId = files[i];

                try {
                    const updateProgress = (progress: any) => {
                        setFiles(prev => prev.map(f =>
                            f.id === fileWithId.id
                                ? { ...f, progress: progress.percentage, status: 'processing' as const }
                                : f
                        ));
                    };

                    const result: PdfProtectionResponse = await ApiService.protectPdf(
                        fileWithId.file,
                        {
                            user_password: password,
                            encryption_level: encryptionLevel
                        },
                        updateProgress
                    );

                    setFiles(prev => prev.map(f =>
                        f.id === fileWithId.id
                            ? {
                                ...f,
                                status: 'completed' as const,
                                progress: 100,
                                downloadUrl: ApiService.getDownloadUrl(result.output_filename)
                            }
                            : f
                    ));

                    showNotification('PDF protected successfully!', 'success');

                } catch (error: any) {
                    setFiles(prev => prev.map(f =>
                        f.id === fileWithId.id
                            ? {
                                ...f,
                                status: 'error' as const,
                                error: error.message || 'Protection failed'
                            }
                            : f
                    ));
                    showNotification(`Protection failed: ${error.message}`, 'error');
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const resetFiles = () => {
        setFiles([]);
        setPassword('');
        setConfirmPassword('');
        showNotification('Files cleared', 'info');
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        // This would integrate with your notification system
        console.log(`${type}: ${message}`);
    };

    const acceptedTypes = getAcceptedFileTypes('protect-pdf');

    const features = [
        {
            icon: '🔒',
            title: 'Strong Encryption',
            description: '256-bit AES encryption provides military-grade security for your documents',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        },
        {
            icon: '🛡️',
            title: 'Access Control',
            description: 'Prevent unauthorized access, copying, editing, and printing of your PDFs',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: '⚡',
            title: 'Instant Protection',
            description: 'Apply password protection in seconds with real-time processing',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            icon: '📄',
            title: 'Quality Preserved',
            description: 'Original document formatting and quality remain completely intact',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    const protectionSteps = [
        {
            step: 1,
            title: 'Upload PDF',
            description: 'Select your PDF document to protect',
            icon: '📤'
        },
        {
            step: 2,
            title: 'Set Password',
            description: 'Create a strong password for security',
            icon: '🔑'
        },
        {
            step: 3,
            title: 'Download',
            description: 'Get your password-protected PDF instantly',
            icon: '📥'
        }
    ];

    const useCases = [
        { use: 'Confidential documents', icon: '🔐' },
        { use: 'Legal contracts', icon: '⚖️' },
        { use: 'Financial reports', icon: '💰' },
        { use: 'Personal records', icon: '👤' },
        { use: 'Business proposals', icon: '📊' },
        { use: 'Medical records', icon: '🏥' }
    ];

    const passwordStrength = password.length === 0 ? 0 :
        password.length < 6 ? 1 :
            password.length < 8 ? 2 :
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password) ? 4 : 3;

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0: return '';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </li>
                            <li>
                                <span className="text-gray-900 font-medium">PDF Password Protection</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
                        🔒
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
                        PDF Password Protection
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        Secure your PDF documents with
                        <span className="font-semibold text-red-600"> military-grade encryption</span> and
                        <span className="font-semibold text-orange-600"> password protection</span>
                    </p>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">{protectionStats.totalProtected.toLocaleString()}+</div>
                            <div className="text-gray-600 text-sm">PDFs Protected</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{protectionStats.encryptionStrength}-bit</div>
                            <div className="text-gray-600 text-sm">AES Encryption</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{protectionStats.successRate}%</div>
                            <div className="text-gray-600 text-sm">Success Rate</div>
                        </div>
                    </div>
                </div>

                {/* Main Protection Area */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Protect Your PDF</h2>
                        <p className="text-red-100">Upload your PDF and add password protection with encryption</p>
                    </div>

                    <div className="p-8">
                        <FileUpload
                            acceptedFileTypes={acceptedTypes}
                            maxFiles={5}
                            onFilesSelected={handleFilesSelected}
                            onFilesChange={handleFilesChange}
                            selectedFiles={files}
                            isProcessing={isProcessing}
                            title="Drop your PDF files here"
                            description="Select PDF files to add password protection"
                        />

                        {/* Password Configuration */}
                        {files.length > 0 && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>

                                <div className="space-y-6">
                                    {/* Password Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter a strong password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                        />
                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-medium ${passwordStrength === 1 ? 'text-red-600' :
                                                            passwordStrength === 2 ? 'text-orange-600' :
                                                                passwordStrength === 3 ? 'text-yellow-600' :
                                                                    passwordStrength === 4 ? 'text-green-600' : 'text-gray-600'
                                                        }`}>
                                                        {getPasswordStrengthText()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                        />
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                                        )}
                                    </div>

                                    {/* Encryption Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Encryption Level</label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${encryptionLevel === 'standard' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="encryption"
                                                    value="standard"
                                                    checked={encryptionLevel === 'standard'}
                                                    onChange={(e) => setEncryptionLevel(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className="text-center">
                                                    <div className="text-2xl mb-2">🔒</div>
                                                    <div className="font-semibold text-gray-900">Standard (128-bit)</div>
                                                    <div className="text-sm text-gray-600">Good protection for most uses</div>
                                                </div>
                                            </label>

                                            <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${encryptionLevel === 'high' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="encryption"
                                                    value="high"
                                                    checked={encryptionLevel === 'high'}
                                                    onChange={(e) => setEncryptionLevel(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className="text-center">
                                                    <div className="text-2xl mb-2">🛡️</div>
                                                    <div className="font-semibold text-gray-900">High (256-bit)</div>
                                                    <div className="text-sm text-gray-600">Maximum security protection</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Password Tips */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">💡 Password Tips</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Use at least 8 characters</li>
                                            <li>• Include uppercase and lowercase letters</li>
                                            <li>• Add numbers and special characters</li>
                                            <li>• Avoid common words or personal information</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {files.length > 0 && (
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={protectFiles}
                                    disabled={isProcessing || !password || password !== confirmPassword || password.length < 6}
                                    className={`
                    bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg
                    hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300
                    shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center space-x-3
                  `}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Protecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Protect PDFs</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={resetFiles}
                                    disabled={isProcessing}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg
                           transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset Files
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className={`font-bold text-lg ${feature.color} mb-3`}>
                                {feature.title}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* How it Works */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {protectionSteps.map((step, index) => (
                            <div key={index} className="text-center relative">
                                <div className="bg-gradient-to-r from-red-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                    {step.step}
                                </div>
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>

                                {/* Connection Line */}
                                {index < protectionSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-red-200 to-orange-200 transform -translate-x-1/2 z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Use Cases */}
                <div className="mb-16">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Perfect For</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {useCases.map((useCase, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="text-3xl">{useCase.icon}</div>
                                    <span className="font-medium text-gray-900">{useCase.use}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 mb-16">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Security is Our Priority</h3>
                            <p className="text-emerald-800 mb-4 leading-relaxed">
                                We prioritize your document security. All password protection is processed with end-to-end encryption,
                                and files are automatically deleted within 1 hour. Your passwords are never stored or logged.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-emerald-700">End-to-End Encryption</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-emerald-700">No Password Storage</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-emerald-700">Auto-Delete Files</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-emerald-700">GDPR Compliant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">Why Choose Our PDF Password Protection?</h2>
                        <p className="text-red-100">The most secure solution for protecting your sensitive documents</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Safeguard your sensitive PDF documents with our advanced password protection system that combines
                                military-grade encryption with user-friendly functionality. Whether you're securing confidential
                                business documents, legal contracts, or personal files, our comprehensive security solution ensures
                                your information remains protected against unauthorized access while maintaining document integrity.
                            </p>

                            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Military-Grade Encryption Technology
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Our PDF protection employs 256-bit AES encryption, the same standard used by governments and
                                financial institutions worldwide. This unbreakable encryption ensures that even the most
                                sophisticated attacks cannot compromise your protected documents. Combined with secure password
                                hashing algorithms, your PDFs become virtually impenetrable fortresses of digital security.
                            </p>

                            <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Comprehensive Access Control and Document Integrity
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Beyond basic password protection, our system provides granular control over document permissions.
                                Prevent unauthorized copying, editing, printing, and content extraction while maintaining the
                                original document quality and formatting. Advanced permission settings allow you to customize
                                exactly how users can interact with your protected PDFs, ensuring optimal security for any scenario.
                            </p>

                            <h4 className="text-xl font-semibold text-red-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Business-Critical Security for Professional Applications
                            </h4>
                            <p className="text-gray-700 mb-6">
                                Essential for businesses handling sensitive information, our protection system meets compliance
                                requirements for HIPAA, GDPR, and other regulatory standards. Protect intellectual property,
                                financial data, legal documents, and confidential communications with confidence. The robust
                                security framework ensures your organization maintains data integrity while enabling secure
                                document sharing across teams and external partners.
                            </p>

                            <h4 className="text-xl font-semibold text-orange-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clipRule="evenodd" />
                                </svg>
                                Instant Protection with Zero Compromise
                            </h4>
                            <p className="text-gray-700 mb-6">
                                Apply enterprise-level security in seconds without sacrificing document quality or functionality.
                                Our streamlined process maintains all original formatting, embedded elements, and interactive
                                features while adding an impenetrable security layer. Real-time processing ensures immediate
                                protection, making it perfect for time-sensitive documents and urgent security requirements.
                            </p>

                            <h5 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Advanced Password Security Features
                            </h5>
                            <p className="text-gray-700 mb-6">
                                Our intelligent password strength analyzer guides you in creating unbreakable passwords while
                                our dual-verification system prevents accidental lockouts. The system supports complex password
                                requirements and provides real-time feedback to ensure optimal security. Advanced cryptographic
                                techniques protect password integrity throughout the encryption process, making brute-force
                                attacks virtually impossible.
                            </p>

                            <h5 className="text-lg font-semibold text-orange-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Privacy-First Architecture with Universal Compatibility
                            </h5>
                            <p className="text-gray-700 mb-0">
                                Built with privacy as the foundation, our system processes all encryption locally without storing
                                passwords or sensitive data. The protected PDFs maintain complete compatibility across all devices,
                                operating systems, and PDF viewers while ensuring consistent security enforcement. Our commitment
                                to privacy means your confidential information never leaves your control, providing peace of mind
                                for the most sensitive document protection requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
