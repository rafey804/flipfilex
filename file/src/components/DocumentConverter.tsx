'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Types
interface FileWithId {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
  conversionId?: string;
}

interface ConversionConfig {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string;
  urlSlug: string;
  h1Title: string;
  breadcrumbText: string;
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

interface DocumentConverterProps {
  conversionType?: string;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '⚠'
  }[type];

  return (
    <div className={`fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in`}>
      <span className="text-lg">{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Dynamic Document SEO Content Component
interface DynamicDocumentSEOContentProps {
  conversionType: string;
  conversionTypes: Record<string, {
    name: string;
    inputFormats: string[];
    outputFormat: string;
    color: string;
    bgColor: string;
    icon: string;
    description: string;
  }>;
}

const DynamicDocumentSEOContent = ({ conversionType, conversionTypes }: DynamicDocumentSEOContentProps) => {
  const currentType = conversionTypes[conversionType];
  const typeName = currentType?.name || 'Document Conversion';

  // Ensure we always have a valid conversion type
  if (!currentType) {
    console.warn('No matching conversion type found for:', conversionType);
    console.log('Available types:', Object.keys(conversionTypes));
    return null;
  }

  // UNIQUE DOCUMENT SECTION TITLES for each conversion type
  const getDocumentSectionTitles = (type: string) => {
    const uniqueDocumentTitles: Record<string, {
      howTo: string;
      whyFrom: string;
      whyTo: string;
      whyMatters: string;
      benefits: string;
      technical: string;
      useCases: string;
      faq: string;
      relatedTools: string;
    }> = {
      'excel_to_pdf': {
        howTo: `Transform Excel Spreadsheets to Professional PDF Documents`,
        whyFrom: `Excel Limitations in Document Distribution and Presentation`,
        whyTo: `PDF Excellence for Professional Document Sharing`,
        whyMatters: `Business Communication Enhancement Through Excel to PDF Conversion`,
        benefits: `Professional Benefits of Converting Excel to PDF Format`,
        technical: `Excel vs PDF: Spreadsheet vs Document Technology Analysis`,
        useCases: `Business Applications for Excel to PDF Conversion`,
        faq: `Excel to PDF Professional Conversion: Business Guide`,
        relatedTools: `Professional Excel and PDF Business Document Tools`
      },
      'powerpoint_to_pdf': {
        howTo: `Convert PowerPoint Presentations to Portable PDF Documents`,
        whyFrom: `PowerPoint Software Dependencies in Professional Presentations`,
        whyTo: `PDF Universal Compatibility for Presentation Distribution`,
        whyMatters: `Presentation Accessibility Through PowerPoint to PDF Conversion`,
        benefits: `Distribution Benefits of PowerPoint to PDF Transformation`,
        technical: `PowerPoint vs PDF: Presentation vs Document Analysis`,
        useCases: `Professional Presentation Applications for PowerPoint to PDF`,
        faq: `PowerPoint to PDF Presentation Distribution: Professional Guide`,
        relatedTools: `Professional PowerPoint and PDF Presentation Tools`
      },
      'text_to_pdf': {
        howTo: `Transform Plain Text Files to Formatted PDF Documents`,
        whyFrom: `Text File Limitations in Professional Document Creation`,
        whyTo: `PDF Professional Formatting for Enhanced Document Presentation`,
        whyMatters: `Document Professionalization Through Text to PDF Enhancement`,
        benefits: `Formatting Benefits of Text to PDF Document Creation`,
        technical: `Text vs PDF: Plain Text vs Formatted Document Analysis`,
        useCases: `Professional Documentation Applications for Text to PDF`,
        faq: `Text to PDF Document Creation: Professional Formatting Guide`,
        relatedTools: `Professional Text and PDF Document Creation Tools`
      },
      'html_to_pdf': {
        howTo: `Convert Web Pages to Printable PDF Documents`,
        whyFrom: `HTML Web Format Limitations for Offline Document Use`,
        whyTo: `PDF Offline Access for Permanent Document Storage`,
        whyMatters: `Web Content Preservation Through HTML to PDF Conversion`,
        benefits: `Archival Benefits of HTML to PDF Web Preservation`,
        technical: `HTML vs PDF: Web Content vs Document Format Analysis`,
        useCases: `Web Archival Applications for HTML to PDF Conversion`,
        faq: `HTML to PDF Web Preservation: Digital Archiving Guide`,
        relatedTools: `Professional HTML and PDF Web Archival Tools`
      },
      'csv_to_excel': {
        howTo: `Transform CSV Data Files to Professional Excel Spreadsheets`,
        whyFrom: `CSV Data Format Limitations in Business Analysis`,
        whyTo: `Excel Advanced Features for Professional Data Management`,
        whyMatters: `Data Analysis Enhancement Through CSV to Excel Conversion`,
        benefits: `Business Intelligence Benefits of CSV to Excel Transformation`,
        technical: `CSV vs Excel: Raw Data vs Business Intelligence Analysis`,
        useCases: `Business Analytics Applications for CSV to Excel Conversion`,
        faq: `CSV to Excel Data Analysis: Business Intelligence Guide`,
        relatedTools: `Professional CSV and Excel Business Analytics Tools`
      },
      'json_to_csv': {
        howTo: `Convert JSON Data to Tabular CSV Format`,
        whyFrom: `JSON Structure Complexity in Traditional Data Analysis`,
        whyTo: `CSV Simplicity for Universal Data Processing`,
        whyMatters: `Data Accessibility Through JSON to CSV Simplification`,
        benefits: `Data Processing Benefits of JSON to CSV Conversion`,
        technical: `JSON vs CSV: Structured vs Tabular Data Analysis`,
        useCases: `Data Science Applications for JSON to CSV Conversion`,
        faq: `JSON to CSV Data Processing: Data Science Guide`,
        relatedTools: `Professional JSON and CSV Data Processing Tools`
      },
      'epub_to_pdf': {
        howTo: `Transform EPUB eBooks to Universal PDF Documents`,
        whyFrom: `EPUB Reader Dependencies and Platform Limitations`,
        whyTo: `PDF Universal Accessibility for eBook Content`,
        whyMatters: `Digital Publishing Enhancement Through EPUB to PDF Conversion`,
        benefits: `Professional Benefits of EPUB to PDF Document Creation`,
        technical: `EPUB vs PDF: eBook vs Document Format Analysis`,
        useCases: `Publishing Applications for EPUB to PDF Conversion`,
        faq: `EPUB to PDF eBook Publishing: Professional Guide`,
        relatedTools: `Professional EPUB and PDF Publishing Tools`
      },
      'mobi_to_epub': {
        howTo: `Convert Kindle MOBI Books to Standard EPUB Format`,
        whyFrom: `MOBI Format Restrictions and Kindle Ecosystem Lock-in`,
        whyTo: `EPUB Standard Compatibility for Universal eBook Access`,
        whyMatters: `Digital Library Freedom Through MOBI to EPUB Liberation`,
        benefits: `Cross-Platform Benefits of MOBI to EPUB Conversion`,
        technical: `MOBI vs EPUB: Proprietary vs Open eBook Standards`,
        useCases: `Digital Library Applications for MOBI to EPUB Migration`,
        faq: `MOBI to EPUB eBook Liberation: Cross-Platform Guide`,
        relatedTools: `Professional MOBI and EPUB eBook Management Tools`
      },
      'txt_to_epub': {
        howTo: `Transform Plain Text Files to Professional EPUB eBooks`,
        whyFrom: `Text File Limitations in Digital Publishing and Distribution`,
        whyTo: `EPUB Professional eBook Features for Enhanced Reading`,
        whyMatters: `Content Publishing Enhancement Through Text to EPUB Creation`,
        benefits: `Digital Publishing Benefits of Text to EPUB Transformation`,
        technical: `Text vs EPUB: Plain Content vs Rich eBook Format Analysis`,
        useCases: `Self-Publishing Applications for Text to EPUB Conversion`,
        faq: `Text to EPUB eBook Creation: Self-Publishing Guide`,
        relatedTools: `Professional Text and EPUB Publishing Tools`
      },
      'docx_to_epub': {
        howTo: `Convert Microsoft Word Documents to Interactive EPUB eBooks`,
        whyFrom: `Word Document Limitations in Digital Reading Experience`,
        whyTo: `EPUB Interactive Features for Enhanced Digital Publishing`,
        whyMatters: `Content Transformation Through DOCX to EPUB Innovation`,
        benefits: `Digital Publishing Benefits of DOCX to EPUB Enhancement`,
        technical: `DOCX vs EPUB: Document vs eBook Technology Comparison`,
        useCases: `Professional Publishing Applications for DOCX to EPUB`,
        faq: `DOCX to EPUB Publishing Workflow: Professional Guide`,
        relatedTools: `Professional DOCX and EPUB Publishing Solutions`
      },
      'bib_to_pdf': {
        howTo: `Convert Bibliography Files to Formatted PDF Documents`,
        whyFrom: `BibTeX File Limitations in Academic Document Presentation`,
        whyTo: `PDF Professional Formatting for Academic Bibliography Display`,
        whyMatters: `Academic Publishing Enhancement Through BIB to PDF Creation`,
        benefits: `Research Benefits of BibTeX to PDF Documentation`,
        technical: `BibTeX vs PDF: Reference Data vs Formatted Document Analysis`,
        useCases: `Academic Research Applications for BIB to PDF Conversion`,
        faq: `BibTeX to PDF Academic Publishing: Research Guide`,
        relatedTools: `Professional BibTeX and PDF Academic Tools`
      },
      'latex_to_pdf': {
        howTo: `Compile LaTeX Documents to Professional PDF Publications`,
        whyFrom: `LaTeX Source Complexity in Document Distribution`,
        whyTo: `PDF Professional Output for Academic and Technical Publishing`,
        whyMatters: `Academic Excellence Through LaTeX to PDF Compilation`,
        benefits: `Professional Publishing Benefits of LaTeX to PDF Generation`,
        technical: `LaTeX vs PDF: Source Code vs Publication Format Analysis`,
        useCases: `Academic and Technical Applications for LaTeX to PDF`,
        faq: `LaTeX to PDF Academic Publishing: Technical Guide`,
        relatedTools: `Professional LaTeX and PDF Academic Publishing Tools`
      }
    };

    if (uniqueDocumentTitles[type]) {
      return uniqueDocumentTitles[type];
    }

    // Create completely unique fallback titles for documents
    const dynamicDocumentTitles = {
      howTo: `Master ${typeName} Processing Workflow`,
      whyFrom: `${typeName} Source Format Challenges and Requirements`,
      whyTo: `${typeName} Target Format Excellence for Your Needs`,
      whyMatters: `Strategic Enhancement: ${typeName} Document Evolution`,
      benefits: `Professional Benefits: ${typeName} Document Advancement`,
      technical: `${typeName}: Comprehensive Format Technology Specification`,
      useCases: `Professional Applications: ${typeName} Document Processing`,
      faq: `${typeName}: Advanced Processing Documentation`,
      relatedTools: `${typeName} Professional Document Technology Suite`
    };

    return dynamicDocumentTitles;
  };

  // UNIQUE DOCUMENT CONVERSION-SPECIFIC DESCRIPTIONS - NO DUPLICATE CONTENT
  const getDocumentConversionSpecificDescription = (type: string) => {
    const uniqueDocumentConversions: Record<string, { sourceDesc: string; targetDesc: string; why: string }> = {
      'excel_to_pdf': {
        sourceDesc: 'Excel spreadsheets contain dynamic calculations, formulas, and data analysis capabilities but require specific software to view and may lose formatting when shared across different platforms and devices.',
        targetDesc: 'PDF format preserves exact visual appearance of spreadsheets while ensuring universal accessibility across all devices and platforms without requiring specialized software or losing formatting integrity.',
        why: 'Converting Excel to PDF is essential for sharing financial reports, data analysis, and business presentations where consistent appearance and universal accessibility are critical for professional communication.'
      },
      'powerpoint_to_pdf': {
        sourceDesc: 'PowerPoint presentations provide interactive features and editing capabilities but create compatibility challenges when sharing with audiences who may not have PowerPoint software or when consistent visual presentation is required.',
        targetDesc: 'PDF format ensures presentations display identically across all devices and platforms while maintaining slide layouts, fonts, and visual elements without requiring PowerPoint software for viewing.',
        why: 'Converting PowerPoint to PDF is crucial for distributing presentations to diverse audiences, ensuring consistent appearance regardless of viewing device, and creating permanent records of presentation content.'
      },
      'text_to_pdf': {
        sourceDesc: 'Plain text files contain raw content without formatting, visual structure, or professional presentation elements, making them unsuitable for formal documents and professional communication.',
        targetDesc: 'PDF format transforms plain text into professionally formatted documents with proper typography, layout, and visual structure suitable for business and formal communication.',
        why: 'Converting text to PDF is essential for creating professional documents from raw content, ensuring proper formatting for reports, letters, and formal communication that represents your organization professionally.'
      },
      'html_to_pdf': {
        sourceDesc: 'HTML web pages require internet connectivity and browsers to view, may change over time, and cannot be reliably archived or shared as permanent documents for offline reference.',
        targetDesc: 'PDF format captures web content as permanent, offline-accessible documents that preserve the exact appearance and content for archival purposes and reliable future reference.',
        why: 'Converting HTML to PDF is vital for archiving web content, creating permanent records of online information, and ensuring important web-based documents remain accessible regardless of internet connectivity.'
      },
      'csv_to_excel': {
        sourceDesc: 'CSV files contain raw data in simple comma-separated format but lack advanced features like formulas, charts, formatting, and data analysis tools needed for comprehensive business intelligence.',
        targetDesc: 'Excel format provides advanced data analysis capabilities including formulas, pivot tables, charts, conditional formatting, and business intelligence features for comprehensive data management.',
        why: 'Converting CSV to Excel is essential for transforming raw data into actionable business intelligence, enabling advanced analysis, visualization, and reporting capabilities for informed decision-making.'
      },
      'json_to_csv': {
        sourceDesc: 'JSON format stores data in nested, hierarchical structures that are excellent for applications but complex for traditional data analysis tools and spreadsheet applications.',
        targetDesc: 'CSV format provides simple, tabular data structure that works universally with spreadsheet applications, databases, and data analysis tools for straightforward data processing.',
        why: 'Converting JSON to CSV is necessary for making complex data structures accessible to traditional analysis tools, enabling data scientists and analysts to work with application data using familiar spreadsheet tools.'
      },
      'epub_to_pdf': {
        sourceDesc: 'EPUB format is designed for reflowable content and requires specialized eBook readers or apps, creating barriers for universal access and limiting distribution options for authors and publishers seeking broader audience reach.',
        targetDesc: 'PDF format ensures universal document accessibility across all devices and platforms while preserving the exact layout and formatting of eBook content for consistent presentation and professional distribution.',
        why: 'Converting EPUB to PDF is essential for academic institutions, libraries, and publishers who need to distribute eBook content to audiences without requiring specialized eReader software, ensuring accessibility compliance and broader content reach.'
      },
      'mobi_to_epub': {
        sourceDesc: 'MOBI format is proprietary to Amazon\'s Kindle ecosystem, creating platform lock-in that restricts users to Amazon devices and limits the ability to share or access content across different eReader platforms and applications.',
        targetDesc: 'EPUB format is the open industry standard for eBooks, providing universal compatibility across all major eReader devices, applications, and platforms while supporting advanced features like accessibility options and interactive content.',
        why: 'Converting MOBI to EPUB is crucial for digital library management, cross-platform accessibility, and breaking free from proprietary restrictions, enabling users to access their eBook collections on any device or platform of their choice.'
      },
      'txt_to_epub': {
        sourceDesc: 'Plain text files contain raw content without any formatting, structure, or metadata, making them unsuitable for professional digital publishing and lacking the interactive features that enhance modern reading experiences.',
        targetDesc: 'EPUB format transforms plain text into richly formatted eBooks with professional typography, table of contents, metadata, search capabilities, and accessibility features that provide superior reading experiences across all devices.',
        why: 'Converting text to EPUB is essential for self-publishers, content creators, and educators who want to transform written content into professional digital publications that can be distributed through major eBook platforms and accessed on any eReader device.'
      },
      'docx_to_epub': {
        sourceDesc: 'Microsoft Word documents are designed for traditional document workflows and lack the reflowable, responsive design features necessary for optimal digital reading experiences across various screen sizes and eReader devices.',
        targetDesc: 'EPUB format provides adaptive layouts, responsive typography, and device-optimized reading experiences while maintaining the content structure and formatting elements essential for professional digital publishing and distribution.',
        why: 'Converting DOCX to EPUB is vital for publishers, educators, and content creators who need to transform traditional documents into interactive digital publications that provide optimal reading experiences across tablets, eReaders, and mobile devices.'
      },
      'bib_to_pdf': {
        sourceDesc: 'BibTeX files contain structured reference data in a specialized format that requires specific software to interpret and lacks the visual formatting necessary for professional academic document presentation and citation display.',
        targetDesc: 'PDF format transforms bibliography data into professionally formatted reference lists with proper academic styling, consistent formatting, and universal accessibility for inclusion in research papers, theses, and academic publications.',
        why: 'Converting BibTeX to PDF is essential for academic researchers, graduate students, and scholars who need to generate professionally formatted bibliography sections for research papers, dissertations, and academic publications with proper citation formatting.'
      },
      'latex_to_pdf': {
        sourceDesc: 'LaTeX source files contain markup code and commands that require specialized compilation software and technical expertise, making them inaccessible to readers and unsuitable for direct distribution or publication.',
        targetDesc: 'PDF format compiles LaTeX source into polished, professionally typeset documents with precise formatting, mathematical equations, figures, and references that meet the highest academic and technical publishing standards.',
        why: 'Converting LaTeX to PDF is fundamental for academic publishing, technical documentation, and scientific communication, enabling researchers to produce publication-ready documents with professional typography and mathematical formatting for journals, conferences, and institutional repositories.'
      }
    };

    const conversion = uniqueDocumentConversions[type];
    if (conversion) {
      return conversion;
    }

    // Fallback for other combinations
    return {
      sourceDesc: `${typeName} source format serves specific document workflow purposes but may face limitations in distribution, compatibility, or feature requirements for your intended use case.`,
      targetDesc: `${typeName} target format provides enhanced capabilities in accessibility, distribution, or functionality that better match your specific document processing needs and professional requirements.`,
      why: `${typeName} conversion helps optimize your documents for specific workflows, platform requirements, and professional communication standards.`
    };
  };

  // Get document technical specifications
  const getDocumentTechnicalSpecs = (type: string) => {
    const specs: Record<string, { source: string[], target: string[] }> = {
      'epub_to_pdf': {
        source: [
          'Reflowable text layout adapts to different screen sizes and reading preferences',
          'Supports rich media integration including images, audio, and interactive elements',
          'Metadata structure enables detailed book information and cataloging',
          'Accessibility features support screen readers and assistive technologies',
          'DRM compatibility allows protected content distribution'
        ],
        target: [
          'Fixed layout ensures consistent appearance across all viewing platforms',
          'Universal compatibility works on any device without specialized software',
          'Optimized for printing with proper page breaks and formatting',
          'Searchable text content maintains full-text search capabilities',
          'File compression reduces storage space while preserving quality'
        ]
      },
      'mobi_to_epub': {
        source: [
          'Optimized for Kindle devices with proprietary formatting features',
          'Supports Amazon-specific DRM and content protection mechanisms',
          'Integrated with Kindle ecosystem for seamless device synchronization',
          'Compressed format reduces file size for efficient device storage',
          'Whispersync compatibility enables cross-device reading progress'
        ],
        target: [
          'Open standard format ensures broad device and application compatibility',
          'Rich formatting support includes advanced CSS styling and layouts',
          'Accessibility compliance meets international web accessibility standards',
          'Cross-platform synchronization works with multiple reading applications',
          'Future-proof format backed by industry consortium standards'
        ]
      },
      'txt_to_epub': {
        source: [
          'Plain text format ensures maximum compatibility across all systems',
          'Minimal file size enables efficient storage and transmission',
          'Simple structure allows easy content editing and modification',
          'Universal readability requires no specialized software or applications',
          'Character encoding flexibility supports multiple languages'
        ],
        target: [
          'Rich typography enhances reading experience with proper formatting',
          'Interactive table of contents enables easy navigation through content',
          'Metadata support provides author information and publication details',
          'Responsive design adapts to different screen sizes and orientations',
          'Enhanced accessibility features support diverse reading needs'
        ]
      },
      'docx_to_epub': {
        source: [
          'Advanced formatting capabilities including styles, tables, and graphics',
          'Collaboration features enable multiple authors and revision tracking',
          'Template system provides consistent document structure and branding',
          'Integration with Microsoft Office ecosystem and cloud services',
          'Robust editing tools support complex document creation workflows'
        ],
        target: [
          'Reflowable layout optimizes content for various screen sizes and devices',
          'Enhanced reading experience with adjustable fonts and reading settings',
          'Cross-platform compatibility works with all major eReader applications',
          'Improved accessibility features support screen readers and navigation',
          'Distribution-ready format enables publishing to major eBook platforms'
        ]
      },
      'bib_to_pdf': {
        source: [
          'Structured data format enables automated citation management',
          'LaTeX integration provides seamless academic document workflow',
          'Machine-readable format supports bibliographic database systems',
          'Version control compatibility tracks changes in reference lists',
          'Cross-reference capabilities link citations to full bibliographic data'
        ],
        target: [
          'Professional formatting meets academic journal and publication standards',
          'Consistent citation style ensures proper academic presentation',
          'Portable format enables easy sharing with advisors and colleagues',
          'Print-ready output supports both digital and physical distribution',
          'Universal accessibility works without specialized bibliography software'
        ]
      },
      'latex_to_pdf': {
        source: [
          'Precise typographical control enables professional document layout',
          'Mathematical equation support with advanced formatting capabilities',
          'Automated cross-referencing for figures, tables, and citations',
          'Template system ensures consistent academic and technical formatting',
          'Version control compatibility supports collaborative document development'
        ],
        target: [
          'Professional typography meets highest academic and technical standards',
          'Universal compatibility ensures consistent appearance across all platforms',
          'Print-ready quality suitable for journal submission and publication',
          'Optimized file size balances quality with efficient distribution',
          'Searchable content maintains full-text search and indexing capabilities'
        ]
      }
    };

    return specs[type] || {
      source: ['Source format provides specific capabilities for document creation and editing'],
      target: ['Target format offers enhanced compatibility and distribution advantages']
    };
  };

  // Get document use cases
  const getDocumentUseCases = (type: string) => {
    const useCases: Record<string, Array<{ title: string, description: string, icon: string }>> = {
      'epub_to_pdf': [
        {
          title: 'Academic Institution Libraries',
          description: 'Universities and colleges need to provide eBook content to students who may not have specialized eReader software or devices. Converting EPUB to PDF ensures all students can access required reading materials on any device, supports accessibility compliance for students with disabilities, and enables integration with existing learning management systems without requiring additional software installations.',
          icon: '🎓'
        },
        {
          title: 'Corporate Training Materials',
          description: 'Companies distributing training content and employee handbooks require universal access across diverse device ecosystems. PDF conversion ensures consistent formatting for compliance documentation, enables offline access for field workers, supports printing for reference materials, and eliminates the need for specialized eReader software licensing across the organization.',
          icon: '🏢'
        },
        {
          title: 'Legal Document Distribution',
          description: 'Law firms and legal departments need to distribute case materials, contracts, and legal documents with guaranteed formatting consistency. PDF conversion ensures document integrity for legal compliance, provides universal access for clients and opposing counsel, supports digital signatures and annotations, and maintains admissibility standards for court submissions.',
          icon: '⚖️'
        },
        {
          title: 'Research Publication Archives',
          description: 'Academic publishers and research institutions require long-term preservation of scholarly content with consistent formatting. PDF conversion creates archival-quality documents for institutional repositories, ensures future accessibility without dependency on changing eReader technologies, supports citation and reference systems, and maintains publication standards for academic integrity.',
          icon: '📚'
        }
      ],
      'mobi_to_epub': [
        {
          title: 'Digital Library Migration',
          description: 'Libraries and educational institutions transitioning away from proprietary formats need to ensure continued access to digital collections. EPUB conversion enables cross-platform accessibility for patrons using various devices, supports integration with open-source library management systems, provides long-term format sustainability, and eliminates vendor lock-in for digital collection management.',
          icon: '📖'
        },
        {
          title: 'Personal eBook Collection Management',
          description: 'Readers with extensive eBook libraries want freedom to access their content across multiple devices and platforms. EPUB conversion breaks the Kindle ecosystem lock-in, enables reading on preferred applications and devices, supports synchronization across multiple platforms, and provides backup compatibility for personal digital libraries.',
          icon: '📱'
        },
        {
          title: 'Educational Content Development',
          description: 'Educators and content creators developing digital learning materials need format flexibility for distribution across various platforms. EPUB conversion enables integration with multiple learning management systems, supports accessibility features for diverse learners, allows customization for specific educational needs, and provides broader distribution opportunities for educational content.',
          icon: '👨‍🏫'
        },
        {
          title: 'Publishing Platform Diversification',
          description: 'Authors and publishers seeking to expand distribution beyond Amazon\'s ecosystem require format flexibility. EPUB conversion enables publishing on multiple platforms simultaneously, reaches broader international markets, supports independent bookstore partnerships, and provides greater revenue diversification opportunities for content creators.',
          icon: '✍️'
        }
      ],
      'txt_to_epub': [
        {
          title: 'Self-Publishing Authors',
          description: 'Independent authors working with manuscripts in plain text format need professional eBook creation capabilities. EPUB conversion transforms raw content into distribution-ready digital books with proper formatting, navigation, and metadata for major eBook platforms including Apple Books, Google Play Books, and Barnes & Noble, enabling global distribution and professional presentation.',
          icon: '📝'
        },
        {
          title: 'Content Creator Communities',
          description: 'Writers, bloggers, and online content creators want to compile their work into professional digital publications. EPUB conversion enables monetization of existing content through eBook sales, provides readers with offline access to favorite content, supports fan fiction and community-driven publishing, and creates professional portfolios for content creators.',
          icon: '👥'
        },
        {
          title: 'Educational Material Development',
          description: 'Teachers and educators creating course materials, study guides, and educational resources need accessible digital formats. EPUB conversion enables distribution to students across various devices, supports accessibility features for diverse learning needs, allows interactive elements and multimedia integration, and provides cost-effective alternatives to traditional textbooks.',
          icon: '📚'
        },
        {
          title: 'Technical Documentation Publishing',
          description: 'Software developers and technical writers creating documentation need reader-friendly formats for complex information. EPUB conversion enables responsive layouts for technical guides, supports code syntax highlighting and formatting, provides searchable documentation for developers, and creates portable reference materials for technical teams.',
          icon: '💻'
        }
      ],
      'docx_to_epub': [
        {
          title: 'Academic Publishing Workflow',
          description: 'Researchers and academics writing papers, theses, and dissertations in Word need digital publication formats. EPUB conversion enables thesis submission to digital repositories, supports academic conference proceedings distribution, provides accessible formats for academic content sharing, and enables broader dissemination of research findings beyond traditional publication channels.',
          icon: '🎓'
        },
        {
          title: 'Corporate Content Publishing',
          description: 'Businesses creating white papers, reports, and thought leadership content need professional digital distribution formats. EPUB conversion enables lead generation through content marketing, provides responsive layouts for mobile business readers, supports brand consistency across digital publications, and enhances customer engagement through professional content presentation.',
          icon: '📊'
        },
        {
          title: 'Newsletter and Magazine Publishing',
          description: 'Publishers transitioning from traditional print formats to digital need responsive, reader-friendly alternatives. EPUB conversion enables mobile-optimized magazine layouts, supports subscription-based digital content distribution, provides interactive elements for enhanced reader engagement, and reduces distribution costs while expanding global reach.',
          icon: '📰'
        },
        {
          title: 'Professional Service Documentation',
          description: 'Consultants, lawyers, and professional service providers creating client deliverables need professional presentation formats. EPUB conversion enables branded content delivery to clients, supports interactive proposals and presentations, provides accessible documentation for diverse client needs, and enhances professional credibility through polished digital presentations.',
          icon: '💼'
        }
      ],
      'bib_to_pdf': [
        {
          title: 'Thesis and Dissertation Preparation',
          description: 'Graduate students and doctoral candidates need professionally formatted bibliography sections for their research work. PDF conversion creates publication-ready reference lists that meet university formatting requirements, ensures consistent citation styles across academic disciplines, supports both digital submission and print requirements, and provides backup documentation for thesis defense and publication.',
          icon: '🎓'
        },
        {
          title: 'Academic Paper Submission',
          description: 'Researchers submitting to academic journals require precise bibliography formatting that meets publisher specifications. PDF conversion ensures citation style compliance for different journals, provides clean formatting for peer review processes, supports both digital and print publication requirements, and maintains formatting integrity throughout the publication workflow.',
          icon: '📄'
        },
        {
          title: 'Research Grant Applications',
          description: 'Principal investigators preparing grant proposals need professional reference sections that demonstrate research foundation and relevance. PDF conversion creates compelling bibliography presentations for funding committees, ensures formatting consistency across multi-institutional proposals, supports both digital submission and review processes, and enhances proposal professionalism and credibility.',
          icon: '💰'
        },
        {
          title: 'Conference Proceedings Publication',
          description: 'Academic conference organizers need formatted bibliography sections for published proceedings. PDF conversion ensures consistent reference formatting across multiple authors and papers, supports conference publication standards and requirements, provides professional presentation for conference archives, and enables both digital and print conference proceedings distribution.',
          icon: '🏛️'
        }
      ],
      'latex_to_pdf': [
        {
          title: 'Academic Journal Publication',
          description: 'Researchers and academics preparing manuscripts for peer-reviewed journals require professional typesetting that meets stringent publication standards. PDF compilation ensures mathematical equations render correctly, maintains precise formatting for tables and figures, supports complex citation systems and cross-references, and produces publication-ready documents that meet journal submission requirements.',
          icon: '📚'
        },
        {
          title: 'Technical Documentation Creation',
          description: 'Software engineers and technical writers creating comprehensive documentation need professional formatting for complex technical content. PDF generation enables precise control over code listings and syntax highlighting, supports mathematical formulas and technical diagrams, provides consistent formatting for API documentation, and creates professional references for technical teams and users.',
          icon: '⚙️'
        },
        {
          title: 'Scientific Research Papers',
          description: 'Scientists and researchers presenting experimental results and theoretical work require precise typographical control for complex scientific content. PDF compilation ensures accurate representation of mathematical models and equations, supports high-quality figure and chart integration, maintains scientific notation and symbol accuracy, and produces documents suitable for scientific publication and peer review.',
          icon: '🔬'
        },
        {
          title: 'Educational Material Production',
          description: 'Educators and textbook authors creating instructional materials need professional formatting for complex educational content. PDF generation supports mathematical textbooks with precise equation formatting, enables creation of professional course materials and handouts, provides consistent formatting for educational publishers, and produces high-quality materials for both digital and print distribution.',
          icon: '📖'
        }
      ]
    };

    return useCases[type] || [
      {
        title: 'Professional Document Creation',
        description: 'Convert documents for professional use with enhanced formatting and compatibility.',
        icon: '📄'
      },
      {
        title: 'Cross-Platform Compatibility',
        description: 'Ensure documents work seamlessly across different devices and platforms.',
        icon: '🔄'
      }
    ];
  };

  const documentSectionTitles = getDocumentSectionTitles(conversionType);

  return (
    <div className="space-y-16">
      {/* How to Convert Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.howTo}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Converting documents with our {typeName} converter is simple and efficient. Follow these easy steps to transform your documents:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Document Files</h3>
              <p className="text-gray-600 text-sm">Select your {currentType?.inputFormats.join(', ').toUpperCase()} files or drag and drop them into the upload area. Up to 3 files supported.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Conversion</h3>
              <p className="text-gray-600 text-sm">Click convert and our server will process your documents with professional quality settings and formatting preservation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Results</h3>
              <p className="text-gray-600 text-sm">Download your converted {currentType?.outputFormat.toUpperCase()} files immediately with preserved formatting and quality.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Our {typeName} converter maintains document integrity while optimizing for your specific needs. The conversion process is completely free, secure, and preserves formatting, structure, and content quality. Your files are automatically deleted after processing for complete privacy.
          </p>
        </div>
      </div>

      {/* UNIQUE DOCUMENT CONVERSION-SPECIFIC CONTENT - NO DUPLICATE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-teal-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {documentSectionTitles.whyFrom}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getDocumentConversionSpecificDescription(conversionType).sourceDesc}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {documentSectionTitles.whyTo}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getDocumentConversionSpecificDescription(conversionType).targetDesc}
            </p>
          </div>
        </div>
      </div>

      {/* WHY THIS CONVERSION MATTERS - UNIQUE SECTION */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.whyMatters}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg">
            {getDocumentConversionSpecificDescription(conversionType).why}
          </p>
        </div>
      </div>

      {/* Document Processing Benefits Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.benefits}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900">Perfect Formatting Preservation</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Our converter maintains document structure, formatting, fonts, and layout integrity, ensuring professional appearance across all viewing platforms and devices.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900">Lightning Fast Processing</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Advanced conversion technology processes documents quickly while maintaining quality, ensuring rapid turnaround for time-sensitive business needs.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌍</div>
                <h3 className="text-xl font-semibold text-gray-900">Universal Compatibility</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Converted documents work seamlessly across all operating systems, devices, and software platforms, eliminating compatibility concerns for document sharing.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔐</div>
                <h3 className="text-xl font-semibold text-gray-900">Enterprise-Grade Security</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Documents are processed with bank-level security protocols and automatically deleted after conversion, ensuring complete confidentiality for sensitive business information.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Format FAQ Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          {documentSectionTitles.faq}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Will my document formatting be preserved during {typeName} conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Yes! Our converter maintains all formatting elements including fonts, colors, layouts, tables, and visual elements. The converted document will appear identical to the original while gaining the benefits of the target format.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What file size limits apply to {typeName} conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Our converter supports documents up to 100MB in size, accommodating most business documents, presentations, spreadsheets, and data files. This covers everything from simple documents to complex presentations with multimedia elements.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert multiple documents simultaneously?</h3>
              <p className="text-gray-700 leading-relaxed">Yes! Our batch processing feature allows you to convert up to 3 documents at once. Upload multiple files and convert them all in one operation, saving time for bulk document processing tasks.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my document data secure during conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Absolutely! All uploads are encrypted with HTTPS and processed on secure servers. Your original documents and converted files are automatically deleted after processing. We never store, access, or analyze your document content.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does {typeName} conversion typically take?</h3>
              <p className="text-gray-700 leading-relaxed">Most document conversions complete within 15-45 seconds, depending on file size and complexity. Our optimized processing servers ensure quick turnaround while maintaining professional quality output.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do I need to install any software for {typeName} conversion?</h3>
              <p className="text-gray-700 leading-relaxed">No software installation required! Our web-based converter works directly in your browser across all operating systems. Simply upload your documents, convert online, and download the results immediately.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Technical Specifications Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.technical}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">📤</span>
                Source Format Capabilities
              </h3>
              <div className="space-y-3">
                {getDocumentTechnicalSpecs(conversionType).source.map((spec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">{spec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">📥</span>
                Target Format Advantages
              </h3>
              <div className="space-y-3">
                {getDocumentTechnicalSpecs(conversionType).target.map((spec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">{spec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Use Cases Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.useCases}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {getDocumentUseCases(conversionType).map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">{useCase.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">{useCase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Document Tools Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {documentSectionTitles.relatedTools}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-8 text-center">
            Explore our complete suite of document conversion tools for all your business and professional needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(conversionTypes)
              .filter(([key]) => key !== conversionType)
              .slice(0, 5)
              .map(([key, type]) => (
                <a key={key} href={`/${key.replace(/_/g, '-')}`} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-teal-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-amber-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">{type.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">{type.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </a>
              ))
            }

          </div>
        </div>
      </div>
    </div>
  );
};

// Document conversion types - moved outside component to prevent recreation
const conversionTypes = {
  'excel_to_pdf': {
    name: 'Excel to PDF',
    inputFormats: ['xlsx', 'xls', 'xlsm'],
    outputFormat: 'pdf',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: '📊',
    description: 'Convert spreadsheets to PDF documents'
  },
  'powerpoint_to_pdf': {
    name: 'PowerPoint to PDF',
    inputFormats: ['pptx', 'ppt', 'pptm'],
    outputFormat: 'pdf',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: '📽️',
    description: 'Convert presentations to PDF documents'
  },
  'text_to_pdf': {
    name: 'Text to PDF',
    inputFormats: ['txt', 'text'],
    outputFormat: 'pdf',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '📝',
    description: 'Convert text files to PDF documents'
  },
  'html_to_pdf': {
    name: 'HTML to PDF',
    inputFormats: ['html', 'htm'],
    outputFormat: 'pdf',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: '🌐',
    description: 'Convert web pages to PDF documents'
  },
  'csv_to_excel': {
    name: 'CSV to Excel',
    inputFormats: ['csv'],
    outputFormat: 'xlsx',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: '📈',
    description: 'Convert data files to Excel spreadsheets'
  },
  'json_to_csv': {
    name: 'JSON to CSV',
    inputFormats: ['json'],
    outputFormat: 'csv',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: '🔄',
    description: 'Convert JSON data to CSV format'
  },
  'epub_to_pdf': {
    name: 'EPUB to PDF',
    inputFormats: ['epub'],
    outputFormat: 'pdf',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    icon: '📚',
    description: 'Convert eBooks to PDF documents'
  },
  'mobi_to_epub': {
    name: 'MOBI to EPUB',
    inputFormats: ['mobi', 'azw', 'azw3'],
    outputFormat: 'epub',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    icon: '📖',
    description: 'Convert Kindle books to EPUB format'
  },
  'txt_to_epub': {
    name: 'TXT to EPUB',
    inputFormats: ['txt', 'text'],
    outputFormat: 'epub',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    icon: '📄',
    description: 'Convert text files to EPUB eBooks'
  },
  'docx_to_epub': {
    name: 'DOCX to EPUB',
    inputFormats: ['docx', 'doc'],
    outputFormat: 'epub',
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    icon: '📘',
    description: 'Convert Word documents to EPUB eBooks'
  },
  'bib_to_pdf': {
    name: 'BIB to PDF',
    inputFormats: ['bib', 'bibtex'],
    outputFormat: 'pdf',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    icon: '📑',
    description: 'Convert bibliography files to PDF'
  },
  'latex_to_pdf': {
    name: 'LaTeX to PDF',
    inputFormats: ['tex', 'latex'],
    outputFormat: 'pdf',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: '📜',
    description: 'Convert LaTeX documents to PDF'
  }
};

export default function DocumentConverter({
  conversionType: initialConversionType
}: DocumentConverterProps = {}) {
  const router = useRouter();

  // State management
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionType, setConversionType] = useState(() => {
    // Initialize with the prop value, fallback to epub_to_pdf
    // Convert dashes to underscores if needed
    const normalizedType = initialConversionType?.replace(/-/g, '_') || 'epub_to_pdf';
    return normalizedType;
  });
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<any>({ conversion_types: {} });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  const [conversionStats] = useState({
    totalConverted: 12847,
    successRate: 99.5,
    averageTime: 25
  });

  // Generate SEO configuration
  const generateSEOConfig = useCallback((type: string): ConversionConfig => {
    const typeInfo = conversionTypes[type as keyof typeof conversionTypes];

    if (!typeInfo) {
      return {
        title: 'Document Converter | Free Online Converter',
        description: 'Convert documents online for free',
        metaDescription: 'Convert documents online for free. Fast, secure, and high-quality conversion with no software required.',
        keywords: 'document converter, online converter, free converter',
        urlSlug: 'document-converter',
        h1Title: 'Document Converter',
        breadcrumbText: 'Document Converter'
      };
    }

    const nameParts = typeInfo.name.split(' to ');
    const fromFormat = nameParts[0] || '';
    const toFormat = nameParts[1] || '';

    return {
      title: `${typeInfo.name} | Free Online Converter`,
      description: `Convert ${fromFormat} to ${toFormat} online for free`,
      metaDescription: `${typeInfo.description}. Fast, secure, and high-quality conversion with no software required.`,
      keywords: `${type.replace(/_/g, ' ')}, ${fromFormat.toLowerCase()}, ${toFormat.toLowerCase()}, document converter, online converter, free converter`,
      urlSlug: type.replace(/_/g, '-'),
      h1Title: typeInfo.name,
      breadcrumbText: typeInfo.name
    };
  }, []); // Empty dependency array since conversionTypes is now stable

  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => {
    const initialType = initialConversionType?.replace(/-/g, '_') || 'epub_to_pdf';
    return generateSEOConfig(initialType);
  });

  // Update conversion type when prop changes (URL changes)
  useEffect(() => {
    if (initialConversionType) {
      const normalizedType = initialConversionType.replace(/-/g, '_');
      if (normalizedType !== conversionType) {
        setConversionType(normalizedType);
      }
    }
  }, [initialConversionType, conversionType]);

  // Update SEO config when conversion type changes
  useEffect(() => {
    const newConfig = generateSEOConfig(conversionType);
    setSeoConfig(newConfig);
  }, [conversionType]); // Removed generateSEOConfig since it's now stable

  // Handle conversion type change and navigate to new URL
  const handleConversionTypeChange = useCallback((newConversionType: string) => {
    const newUrlSlug = newConversionType.replace(/_/g, '-');
    setConversionType(newConversionType);

    // Navigate to the new URL
    router.push(`/${newUrlSlug}`);
  }, [router]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
    
  }, []);

  // Load supported formats
  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_BASE_URL}/convert/supported-document-formats`);
        if (response.ok) {
          const formats = await response.json();
          setSupportedFormats(formats);
        } else {
          throw new Error('Failed to load supported formats');
        }
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        showNotification('Failed to load supported formats. Using defaults.', 'warning');
      }
    };

    loadSupportedFormats();
  }, [showNotification]);

  // Enhanced file validation
  const validateDocumentFile = useCallback((file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      return 'File must have a valid extension';
    }
    
    const currentType = conversionTypes[conversionType as keyof typeof conversionTypes];
    if (currentType && !currentType.inputFormats.includes(fileExtension)) {
      return `Unsupported format: ${fileExtension.toUpperCase()}. Supported formats: ${currentType.inputFormats.join(', ')}`;
    }
    
    // 100MB limit for documents
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 100MB`;
    }
    
    return null;
  }, [conversionType, conversionTypes]);

  // Dropzone handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateDocumentFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      showNotification(errors.join('\n'), 'error');
    }

    if (validFiles.length > 0) {
      const newFiles: FileWithId[] = validFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'pending'
      }));

      setFiles(prev => [...prev, ...newFiles]);
      showNotification(`${validFiles.length} document(s) added successfully`, 'success');
    }
  }, [validateDocumentFile, showNotification]);

  const currentType = conversionTypes[conversionType as keyof typeof conversionTypes];
  const acceptedExtensions = currentType ? currentType.inputFormats.map(ext => `.${ext}`) : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/*': acceptedExtensions,
      'text/*': acceptedExtensions.includes('.txt') ? ['.txt'] : []
    },
    maxFiles: 3,
    disabled: isProcessing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDragOver: () => setDragActive(true),
  });

  // File management
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    showNotification('File removed', 'info');
  }, [showNotification]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    showNotification('Files cleared', 'info');
  }, [showNotification]);

  // Convert files function
  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select document files to convert', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      for (const fileWithId of files) {
        if (fileWithId.status !== 'pending') continue;

        try {
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          ));

          const formData = new FormData();
          formData.append('file', fileWithId.file);
          formData.append('conversion_type', conversionType);

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          
          console.log('Starting document conversion request...');
          const response = await fetch(`${API_BASE_URL}/convert/convert-document`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Conversion failed');
          }

          const result = await response.json();
          console.log('Conversion started:', result);
          
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, conversionId: result.conversion_id, status: 'processing', progress: 10 }
              : f
          ));

          // Polling for progress
          const pollProgress = async () => {
            let attempts = 0;
            const maxAttempts = 120;
            
            const poll = async () => {
              try {
                attempts++;
                console.log(`Polling attempt ${attempts} for ${result.conversion_id}`);
                
                const progressResponse = await fetch(`${API_BASE_URL}/convert/document-progress/${result.conversion_id}`);
                if (!progressResponse.ok) {
                  throw new Error('Failed to get progress');
                }
                
                const progressData = await progressResponse.json();
                console.log('Progress data:', progressData);
                
                setFiles(prev => prev.map(f => 
                  f.id === fileWithId.id 
                    ? { 
                        ...f, 
                        status: progressData.status as any,
                        progress: progressData.progress || 0,
                        error: progressData.error,
                        downloadUrl: progressData.download_url
                      }
                    : f
                ));

                if (progressData.status === 'completed') {
                  showNotification(`${fileWithId.file.name} converted successfully!`, 'success');
                  return;
                } else if (progressData.status === 'error') {
                  showNotification(`Conversion failed: ${progressData.error || progressData.message}`, 'error');
                  return;
                } else if (attempts >= maxAttempts) {
                  setFiles(prev => prev.map(f => 
                    f.id === fileWithId.id 
                      ? { ...f, status: 'error', error: 'Conversion timed out' }
                      : f
                  ));
                  showNotification('Conversion timed out', 'error');
                  return;
                }
                
                setTimeout(poll, 3000);
                
              } catch (error) {
                console.error('Polling error:', error);
                attempts++;
                if (attempts >= 3) {
                  setFiles(prev => prev.map(f => 
                    f.id === fileWithId.id 
                      ? { ...f, status: 'error', error: 'Lost connection to server' }
                      : f
                  ));
                  showNotification('Lost connection to conversion service', 'error');
                } else {
                  setTimeout(poll, 2000);
                }
              }
            };
            
            setTimeout(poll, 1000);
          };

          await pollProgress();

        } catch (error: any) {
          console.error('Conversion error:', error);
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, status: 'error', error: error.message }
              : f
          ));
          showNotification(`Conversion failed: ${error.message}`, 'error');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Download function
  const handleDownload = useCallback(async (fileWithId: FileWithId) => {
    if (!fileWithId.downloadUrl) {
      showNotification('Download URL not available', 'error');
      return;
    }
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const fullUrl = fileWithId.downloadUrl.startsWith('http') 
        ? fileWithId.downloadUrl 
        : `${API_BASE_URL}${fileWithId.downloadUrl}`;

      console.log('Download URL:', fullUrl);

      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `${fileWithId.file.name.split('.')[0]}_converted.${currentType?.outputFormat}`;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Download started', 'success');
    } catch (error: any) {
      console.error('Download error:', error);
      showNotification(`Download failed: ${error.message}`, 'error');
    }
  }, [currentType, showNotification]);

  const getFileIcon = () => {
    return (
      <div className={`w-12 h-12 bg-gradient-to-br from-teal-100 to-amber-200 rounded-xl flex items-center justify-center shadow-md`}>
        <span className="text-2xl">{currentType?.icon || '📄'}</span>
      </div>
    );
  };

  const getStatusInfo = (fileWithId: FileWithId) => {
    switch (fileWithId.status) {
      case 'pending':
        return {
          text: 'Ready to convert',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'uploading':
        return {
          text: `Uploading ${fileWithId.progress}%`,
          color: 'text-teal-700',
          bgColor: 'bg-teal-100',
          icon: (
            <div className="animate-spin w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full"></div>
          )
        };
      case 'processing':
        return {
          text: `Converting ${fileWithId.progress}%`,
          color: 'text-amber-700',
          bgColor: 'bg-amber-100',
          icon: (
            <div className="animate-pulse w-4 h-4 bg-amber-600 rounded-full"></div>
          )
        };
      case 'completed':
        return {
          text: 'Completed',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          text: 'Failed',
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          text: 'Ready',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: null
        };
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'uploading':
        return 'bg-gradient-to-r from-teal-500 to-cyan-500';
      case 'processing':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {notification.show && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/" className="text-gray-500 hover:text-teal-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{seoConfig.breadcrumbText}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-amber-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            {currentType?.icon || '📄'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-teal-600"> professional quality</span> and 
            <span className="font-semibold text-amber-600"> perfect formatting</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Documents Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-teal-500 to-amber-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Conversion Type</h2>
            <p className="text-teal-100">Choose your document conversion type - automatically converts with high quality</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Conversion Type</label>
              <select
                value={conversionType}
                onChange={(e) => handleConversionTypeChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 text-lg"
              >
                {Object.entries(conversionTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>

            <div
              {...getRootProps()}
              className={`
                relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-in-out group
                ${isDragActive || dragActive
                  ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-amber-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-teal-400 hover:bg-gradient-to-br hover:from-teal-50 hover:to-amber-50'
                }
                ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-6">
                <div className={`
                  w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg
                  transition-all duration-300 group-hover:scale-110
                  ${isDragActive || dragActive 
                    ? 'bg-gradient-to-br from-teal-500 to-amber-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-teal-100 group-hover:to-amber-100 group-hover:text-teal-600'
                  }
                `}>
                  <span className="text-4xl">{currentType?.icon || '📄'}</span>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-900 transition-colors">
                    Drop your {currentType?.inputFormats.join(', ').toUpperCase()} files here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {currentType?.description}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-teal-600 font-semibold text-lg animate-pulse">
                        Drop files here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your files here, or{' '}
                        <button
                          type="button"
                          className="text-teal-600 font-semibold hover:text-teal-700 underline decoration-2 underline-offset-2"
                        >
                          browse files
                        </button>
                      </p>
                      <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                        <span>{currentType?.inputFormats.join(', ').toUpperCase()}</span>
                        <span className="text-gray-300">•</span>
                        <span>Max 3 files</span>
                        <span className="text-gray-300">•</span>
                        <span>100MB limit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-teal-600 font-semibold text-lg">Converting Document...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={convertFiles}
                  disabled={isProcessing || files.some(f => f.status === 'processing' || f.status === 'uploading')}
                  className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Convert to {currentType?.outputFormat.toUpperCase()} (High Quality)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={clearFiles}
                  disabled={isProcessing}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Files
                </button>
              </div>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold text-gray-900">
                Selected Files ({files.length})
              </h4>
            </div>
            
            <div className="space-y-4">
              {files.map((fileWithId) => {
                const statusInfo = getStatusInfo(fileWithId);
                
                return (
                  <div
                    key={fileWithId.id}
                    className={`
                      bg-white border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg
                      ${fileWithId.status === 'completed' ? 'border-green-200 bg-green-50' : 
                        fileWithId.status === 'error' ? 'border-red-200 bg-red-50' : 
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-teal-200 bg-teal-50' : 
                        'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {getFileIcon()}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-lg">
                            {fileWithId.file.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              {formatFileSize(fileWithId.file.size)}
                            </p>
                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                              {statusInfo.icon}
                              <span>{statusInfo.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {fileWithId.status === 'completed' && (
                          <button 
                            onClick={() => handleDownload(fileWithId)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                            </svg>
                            <span>Download</span>
                          </button>
                        )}

                        {(fileWithId.status === 'pending' || fileWithId.status === 'error') && (
                          <button
                            onClick={() => removeFile(fileWithId.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-xl hover:bg-red-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {(fileWithId.status === 'uploading' || 
                      fileWithId.status === 'processing' || 
                      fileWithId.status === 'completed') && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {fileWithId.status === 'uploading' ? 'Uploading...' : 
                             fileWithId.status === 'processing' ? 'Converting...' : 'Complete'}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {fileWithId.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(fileWithId.status)}`}
                            style={{ width: `${fileWithId.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {fileWithId.error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-red-800">Conversion Error</p>
                            <p className="text-sm text-red-700 mt-1">{fileWithId.error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🚀</div>
            <h3 className="font-bold text-lg text-teal-600 mb-4">Ultra Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">High-speed document conversion with optimized processing</p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-amber-600 mb-4">Perfect Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain document integrity with professional formatting</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">All Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for Excel, PowerPoint, Word, HTML, CSV, and JSON</p>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-indigo-600 mb-4">Secure Processing</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Files processed securely with automatic cleanup</p>
          </div>
        </div>

        {/* Supported Conversion Types */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Document Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(conversionTypes).map(([key, type]) => (
              <div key={key} className={`${type.bgColor} border-2 border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer`}
                   onClick={() => handleConversionTypeChange(key)}>
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className={`text-lg font-bold ${type.color} mb-2`}>{type.name}</div>
                <div className="text-xs text-gray-500 mb-1">{type.inputFormats.join(', ').toUpperCase()} → {type.outputFormat.toUpperCase()}</div>
                <div className="text-xs text-gray-400">{type.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-800">
              <strong>Note:</strong> All conversions preserve document structure, formatting, and metadata while ensuring
              professional output quality. Perfect for business, academic, and personal use.
            </p>
          </div>
        </div>

        {/* Dynamic Document SEO Content Sections */}
        <DynamicDocumentSEOContent
          conversionType={conversionType}
          conversionTypes={conversionTypes}
        />

      </div>
    </div>
  );
}