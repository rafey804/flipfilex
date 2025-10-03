'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Interfaces
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  photo: string;
  photoAdjustments: {
    position: 'center' | 'top' | 'bottom';
    size: 'small' | 'medium' | 'large';
    shape: 'circle' | 'square' | 'rounded';
    brightness: number;
    contrast: number;
    crop: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  customSections: { title: string; content: string }[];
}

// Color themes
const colorThemes = [
  { name: 'Professional Brown', primary: '#D4A574', secondary: '#B8926A', accent: '#E6B485' },
  { name: 'Professional Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'Executive Navy', primary: '#1e3a8a', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'Modern Purple', primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6' },
  { name: 'Corporate Gray', primary: '#374151', secondary: '#4b5563', accent: '#6b7280' },
  { name: 'Creative Teal', primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6' },
  { name: 'Elegant Green', primary: '#059669', secondary: '#047857', accent: '#10b981' },
  { name: 'Warm Orange', primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' },
  { name: 'Deep Red', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
  { name: 'Royal Purple', primary: '#9333ea', secondary: '#7c3aed', accent: '#a855f7' },
  { name: 'Ocean Blue', primary: '#0284c7', secondary: '#0369a1', accent: '#0ea5e9' },
  { name: 'Forest Green', primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' },
  { name: 'Sunset Pink', primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
  { name: 'Modern Black', primary: '#111827', secondary: '#1f2937', accent: '#374151' }
];

// Template styles
const templates = [
  { name: 'Professional', id: 'professional' },
  { name: 'Modern', id: 'modern' },
  { name: 'Executive', id: 'executive' },
  { name: 'Creative', id: 'creative' }
];

// AI suggestions data
const aiSuggestions = {
  jobTitles: {
    'software': ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer'],
    'marketing': ['Digital Marketing Manager', 'Content Marketing Specialist', 'SEO Specialist', 'Social Media Manager'],
    'sales': ['Sales Manager', 'Account Executive', 'Business Development Manager', 'Sales Representative'],
    'design': ['UX/UI Designer', 'Graphic Designer', 'Product Designer', 'Web Designer']
  },
  skills: {
    'software': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'TypeScript', 'SQL', 'API Development'],
    'marketing': ['Google Analytics', 'SEO/SEM', 'Content Strategy', 'Social Media Marketing', 'Email Marketing', 'PPC Advertising'],
    'sales': ['CRM Software', 'Lead Generation', 'Negotiation', 'Sales Forecasting', 'Customer Relationship Management'],
    'design': ['Adobe Creative Suite', 'Figma', 'Sketch', 'UI/UX Design', 'Prototyping', 'User Research', 'Wireframing']
  }
};

export default function ResumeBuilder() {
  // State management
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: '',
      photo: '',
      photoAdjustments: {
        position: 'center',
        size: 'medium',
        shape: 'circle',
        brightness: 100,
        contrast: 100,
        crop: {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }
      }
    },
    professionalSummary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    languages: [],
    certifications: [],
    customSections: []
  });

  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [activeSection, setActiveSection] = useState('personal');
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // AI features state
  const [aiSuggestedSkills, setAiSuggestedSkills] = useState<string[]>([]);
  const [jobMatchingData, setJobMatchingData] = useState({
    jobDescription: '',
    matchScore: 0,
    missingSkills: [] as string[],
    suggestions: [] as string[]
  });
  const [aiLoading, setAiLoading] = useState(false);

  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Load saved data
    const saved = localStorage.getItem('resumeBuilder');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new arrays and objects exist for backward compatibility
        const updatedData = {
          ...parsed,
          languages: parsed.languages || [],
          certifications: parsed.certifications || [],
          personalInfo: {
            ...parsed.personalInfo,
            photoAdjustments: parsed.personalInfo?.photoAdjustments || {
              position: 'center',
              size: 'medium',
              shape: 'circle',
              brightness: 100,
              contrast: 100,
              crop: {
                x: 0,
                y: 0,
                width: 100,
                height: 100
              }
            }
          }
        };
        setResumeData(updatedData);
        setForceUpdate(prev => prev + 1);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data automatically
  const updateResumeData = (updates: Partial<ResumeData>) => {
    const newData = { ...resumeData, ...updates };
    setResumeData(newData);
    if (isClient) {
      localStorage.setItem('resumeBuilder', JSON.stringify(newData));
    }
    setForceUpdate(prev => prev + 1);
  };

  // Experience functions
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateResumeData({
      experience: [...resumeData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    const updatedExperience = resumeData.experience.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    updateResumeData({ experience: updatedExperience });
  };

  const removeExperience = (id: string) => {
    const updatedExperience = resumeData.experience.filter(exp => exp.id !== id);
    updateResumeData({ experience: updatedExperience });
  };

  // Education functions
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    updateResumeData({
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    const updatedEducation = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    );
    updateResumeData({ education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    const updatedEducation = resumeData.education.filter(edu => edu.id !== id);
    updateResumeData({ education: updatedEducation });
  };

  // Project functions
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    updateResumeData({
      projects: [...resumeData.projects, newProject]
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = resumeData.projects.map(proj =>
      proj.id === id ? { ...proj, ...updates } : proj
    );
    updateResumeData({ projects: updatedProjects });
  };

  const removeProject = (id: string) => {
    const updatedProjects = resumeData.projects.filter(proj => proj.id !== id);
    updateResumeData({ projects: updatedProjects });
  };

  // Skills functions
  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      updateResumeData({
        skills: [...resumeData.skills, skill]
      });
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = resumeData.skills.filter(s => s !== skill);
    updateResumeData({ skills: updatedSkills });
  };

  // Language functions
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate'
    };
    updateResumeData({
      languages: [...resumeData.languages, newLanguage]
    });
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    const updatedLanguages = resumeData.languages.map(lang =>
      lang.id === id ? { ...lang, ...updates } : lang
    );
    updateResumeData({ languages: updatedLanguages });
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = resumeData.languages.filter(lang => lang.id !== id);
    updateResumeData({ languages: updatedLanguages });
  };

  // Certification functions
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      link: ''
    };
    updateResumeData({
      certifications: [...resumeData.certifications, newCertification]
    });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    const updatedCertifications = resumeData.certifications.map(cert =>
      cert.id === id ? { ...cert, ...updates } : cert
    );
    updateResumeData({ certifications: updatedCertifications });
  };

  const removeCertification = (id: string) => {
    const updatedCertifications = resumeData.certifications.filter(cert => cert.id !== id);
    updateResumeData({ certifications: updatedCertifications });
  };

  // AI Functions
  const generateAISuggestions = (field: string) => {
    setAiLoading(true);
    setTimeout(() => {
      const category = field.toLowerCase() as keyof typeof aiSuggestions.skills;
      const suggestions = aiSuggestions.skills[category] || aiSuggestions.skills.software;
      setAiSuggestedSkills(suggestions.filter((skill: string) => !resumeData.skills.includes(skill)));
      setAiLoading(false);
    }, 1000);
  };

  const generateProfessionalSummary = () => {
    setAiLoading(true);
    setTimeout(() => {
      const experience = resumeData.experience[0];
      const skills = resumeData.skills.slice(0, 3).join(', ');
      const yearsExp = resumeData.experience.length > 0 ? '3+' : 'entry-level';

      const summary = `Experienced ${experience?.position || 'professional'} with ${yearsExp} years of expertise in ${skills || 'various technologies'}. Proven track record of delivering high-quality solutions and driving business growth. Passionate about leveraging cutting-edge technologies to solve complex problems and create innovative solutions.`;

      updateResumeData({ professionalSummary: summary });
      setAiLoading(false);
    }, 1500);
  };

  const enhanceJobDescription = (experienceId: string) => {
    setAiLoading(true);
    setTimeout(() => {
      const experience = resumeData.experience.find(exp => exp.id === experienceId);
      if (experience) {
        const enhanced = `• Led cross-functional teams to deliver high-impact projects, resulting in 25% improvement in efficiency
• Implemented innovative solutions that reduced costs by $50K annually
• Collaborated with stakeholders to define requirements and ensure successful project delivery
• Mentored junior team members and contributed to knowledge sharing initiatives`;

        updateExperience(experienceId, { description: enhanced });
      }
      setAiLoading(false);
    }, 1500);
  };

  const analyzeJobMatching = () => {
    if (!jobMatchingData.jobDescription) return;

    setAiLoading(true);
    setTimeout(() => {
      const jobKeywords = jobMatchingData.jobDescription.toLowerCase().split(' ');
      const resumeText = [
        resumeData.professionalSummary,
        ...resumeData.skills,
        ...resumeData.experience.map(exp => exp.description)
      ].join(' ').toLowerCase();

      const matches = jobKeywords.filter(keyword =>
        keyword.length > 3 && resumeText.includes(keyword)
      ).length;

      const score = Math.min(Math.round((matches / Math.max(jobKeywords.length * 0.3, 1)) * 100), 100);

      setJobMatchingData(prev => ({
        ...prev,
        matchScore: score,
        missingSkills: ['React Native', 'GraphQL', 'TypeScript'],
        suggestions: [
          'Add more specific technical skills mentioned in the job description',
          'Include quantifiable achievements in your experience section',
          'Optimize keywords for ATS scanning'
        ]
      }));
      setAiLoading(false);
    }, 2000);
  };

  // Photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateResumeData({
          personalInfo: {
            ...resumeData.personalInfo,
            photo: e.target?.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Photo delete
  const handlePhotoDelete = () => {
    updateResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        photo: ''
      }
    });
  };

  // PDF Export
  const exportToPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // DOCX Export - Get exact HTML from preview
  const exportToDOCX = () => {
    try {
      // Get the actual HTML content from the resume preview
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        alert('Resume preview not found. Please try again.');
        return;
      }

      // Create a clean HTML document with the resume content
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              background: white;
            }
            .resume-container {
              max-width: 4xl;
              margin: 0 auto;
              padding: 2rem;
              color: #4B5563;
            }
            .header {
              border-bottom: 4px solid ${selectedTheme.primary};
              padding-bottom: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .header-content {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
            }
            .header-left {
              flex: 1;
            }
            .name {
              font-size: 2.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
              color: ${selectedTheme.primary};
            }
            .contact-info {
              color: #4B5563;
              space-y: 0.25rem;
            }
            .contact-item {
              display: flex;
              align-items: center;
              margin-bottom: 0.25rem;
              font-size: 0.875rem;
            }
            .contact-icon {
              width: 1rem;
              height: 1rem;
              margin-right: 0.5rem;
              color: currentColor;
            }
            .photo {
              margin-left: 1.25rem;
              flex-shrink: 0;
            }
            .photo img {
              width: ${resumeData.personalInfo.photoAdjustments?.size === 'small' ? '4rem' :
                        resumeData.personalInfo.photoAdjustments?.size === 'large' ? '8rem' : '6rem'};
              height: ${resumeData.personalInfo.photoAdjustments?.size === 'small' ? '4rem' :
                         resumeData.personalInfo.photoAdjustments?.size === 'large' ? '8rem' : '6rem'};
              object-fit: cover;
              border: 4px solid ${selectedTheme.primary};
              ${resumeData.personalInfo.photoAdjustments?.shape === 'circle' ? 'border-radius: 50%;' :
                resumeData.personalInfo.photoAdjustments?.shape === 'rounded' ? 'border-radius: 0.5rem;' : ''}
              filter: brightness(${resumeData.personalInfo.photoAdjustments?.brightness || 100}%)
                      contrast(${resumeData.personalInfo.photoAdjustments?.contrast || 100}%);
              object-position: ${resumeData.personalInfo.photoAdjustments?.position || 'center'};
            }
            .section {
              margin-bottom: 1.5rem;
            }
            .section-title {
              font-size: 1.25rem;
              font-weight: bold;
              color: ${selectedTheme.primary};
              border-bottom: 2px solid ${selectedTheme.primary};
              padding-bottom: 0.25rem;
              margin-bottom: 0.75rem;
            }
            .professional-summary {
              color: #4B5563;
              line-height: 1.625;
              margin-bottom: 1.5rem;
            }
            .skills-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .skill-tag {
              background-color: ${selectedTheme.accent};
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.875rem;
              font-weight: 500;
              display: inline-block;
            }
            .experience-item, .education-item, .project-item, .language-item, .certification-item {
              margin-bottom: 1rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #E5E7EB;
            }
            .experience-item:last-child, .education-item:last-child, .project-item:last-child,
            .language-item:last-child, .certification-item:last-child {
              border-bottom: none;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 0.5rem;
            }
            .position, .degree, .project-name, .cert-name {
              font-size: 1rem;
              font-weight: 600;
              color: ${selectedTheme.primary};
            }
            .company, .school, .date, .organization {
              color: #6B7280;
              font-size: 0.875rem;
            }
            .description {
              color: #4B5563;
              margin-top: 0.5rem;
              line-height: 1.5;
            }
            .tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 0.25rem;
              margin-top: 0.5rem;
            }
            .tech-tag {
              background-color: #F3F4F6;
              color: #374151;
              padding: 0.125rem 0.5rem;
              border-radius: 0.75rem;
              font-size: 0.75rem;
              border: 1px solid #D1D5DB;
            }
            .language-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .proficiency {
              color: ${selectedTheme.secondary};
              font-weight: 500;
              font-size: 0.875rem;
            }
          </style>
        </head>
        <body>
          <div class="resume-container">

            <!-- Header -->
            <div class="header">
              <div class="header-content">
                <div class="header-left">
                  <h1 class="name">${resumeData.personalInfo.fullName || 'Your Name'}</h1>
                  <div class="contact-info">
                ${resumeData.personalInfo.email ? `<div class="contact-item">📧 ${resumeData.personalInfo.email}</div>` : ''}
                ${resumeData.personalInfo.phone ? `<div class="contact-item">📞 ${resumeData.personalInfo.phone}</div>` : ''}
                ${resumeData.personalInfo.address ? `<div class="contact-item">📍 ${resumeData.personalInfo.address}</div>` : ''}
                ${resumeData.personalInfo.linkedin ? `<div class="contact-item">🔗 ${resumeData.personalInfo.linkedin}</div>` : ''}
                ${resumeData.personalInfo.portfolio ? `<div class="contact-item">🌐 ${resumeData.personalInfo.portfolio}</div>` : ''}
              </div>
            </div>
            ${resumeData.personalInfo.photo ? `
              <div class="photo">
                <img src="${resumeData.personalInfo.photo}" alt="Professional Photo" />
              </div>
            ` : ''}
          </div>

          <!-- Professional Summary -->
          ${resumeData.professionalSummary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <div class="description">${resumeData.professionalSummary}</div>
            </div>
          ` : ''}

          <!-- Skills -->
          ${resumeData.skills && resumeData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills & Technologies</div>
              <div class="skills-container">
                ${resumeData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Experience -->
          ${resumeData.experience && resumeData.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              ${resumeData.experience.map(exp => `
                <div class="experience-item">
                  <div class="position">${exp.position || 'Position'}</div>
                  <div class="company">${exp.company || 'Company'}${exp.location ? ` • ${exp.location}` : ''}</div>
                  ${exp.startDate || exp.endDate ? `
                    <div class="date">
                      ${exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      ${exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}
                      ${exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </div>
                  ` : ''}
                  ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${resumeData.education && resumeData.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}</div>
                  <div class="institution">${edu.institution || 'Institution'}</div>
                  ${edu.startDate || edu.endDate ? `
                    <div class="date">
                      ${edu.startDate ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      ${edu.startDate && edu.endDate ? ' - ' : ''}
                      ${edu.endDate ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </div>
                  ` : ''}
                  ${edu.gpa ? `<div class="date">GPA: ${edu.gpa}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Projects -->
          ${resumeData.projects && resumeData.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${resumeData.projects.map(project => `
                <div class="project-item">
                  <div class="project-name">${project.name || 'Project Name'}</div>
                  ${project.technologies ? `<div class="company"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
                  ${project.link ? `<div class="company"><strong>Link:</strong> ${project.link}</div>` : ''}
                  ${project.description ? `<div class="description">${project.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Languages -->
          ${resumeData.languages && resumeData.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Languages</div>
              <div class="languages-grid">
                ${resumeData.languages.map(lang => `
                  <div class="language-item">
                    <span class="language-name">${lang.name || 'Language'}</span>
                    <span class="language-level">${lang.proficiency}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Certifications -->
          ${resumeData.certifications && resumeData.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              ${resumeData.certifications.map(cert => `
                <div class="cert-item">
                  <div class="cert-name">${cert.name || 'Certification'}</div>
                  <div class="company">${cert.issuer || 'Organization'}</div>
                  ${cert.date ? `
                    <div class="date">
                      ${new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      ${cert.expiryDate ? ` - ${new Date(cert.expiryDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                    </div>
                  ` : ''}
                  ${cert.credentialId ? `<div class="company"><strong>Credential ID:</strong> ${cert.credentialId}</div>` : ''}
                  ${cert.link ? `<div class="company"><strong>Verification:</strong> ${cert.link}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
        </html>
      `;

      // Convert HTML to Word document format
      const blob = new Blob([
        '\ufeff', // BOM for proper encoding
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='UTF-8'>
          <meta name='ProgId' content='Word.Document'>
          <meta name='Generator' content='Microsoft Word 15'>
          <meta name='Originator' content='Microsoft Word 15'>
          <!--[if !mso]>
          <style>
            v\\:* {behavior:url(#default#VML);}
            o\\:* {behavior:url(#default#VML);}
            w\\:* {behavior:url(#default#VML);}
            .shape {behavior:url(#default#VML);}
          </style>
          <![endif]-->
        </head>
        ${htmlContent.replace('<html>', '').replace('</html>', '')}
        </html>`
      ], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName || 'Resume'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating DOCX. Please try again.');
    }
  };

  // Reset function
  const resetResume = () => {
    if (confirm('Are you sure you want to start over? This will delete all your data.')) {
      const emptyData: ResumeData = {
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          linkedin: '',
          portfolio: '',
          photo: '',
          photoAdjustments: {
            position: 'center',
            size: 'medium',
            shape: 'circle',
            brightness: 100,
            contrast: 100,
            crop: {
              x: 0,
              y: 0,
              width: 100,
              height: 100
            }
          }
        },
        professionalSummary: '',
        skills: [],
        experience: [],
        education: [],
        projects: [],
        languages: [],
        certifications: [],
        customSections: []
      };
      setResumeData(emptyData);
      if (isClient) {
        localStorage.removeItem('resumeBuilder');
      }
      setForceUpdate(prev => prev + 1);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Resume Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
    <div className="max-w-7xl mx-auto">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Panel - Form Inputs */}
        <div className="space-y-6">

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'personal', label: 'Personal', icon: '👤' },
                { id: 'summary', label: 'Summary', icon: '📝' },
                { id: 'experience', label: 'Experience', icon: '💼' },
                { id: 'education', label: 'Education', icon: '🎓' },
                { id: 'skills', label: 'Skills', icon: '⚡' },
                { id: 'projects', label: 'Projects', icon: '🚀' },
                { id: 'languages', label: 'Languages', icon: '🌍' },
                { id: 'certifications', label: 'Certificates', icon: '🏆' },
                { id: 'customize', label: 'Design', icon: '🎨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          {activeSection === 'personal' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.address}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => updateResumeData({
                        personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://johndoe.dev"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a professional headshot (optional)</p>

                  {/* Photo Preview and Adjustments */}
                  {resumeData.personalInfo.photo && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">📸 Photo Adjustments</h4>
                        <button
                          onClick={handlePhotoDelete}
                          className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg border border-red-300 transition-colors flex items-center space-x-1"
                        >
                          <span>🗑️</span>
                          <span>Delete Photo</span>
                        </button>
                      </div>

                      {/* Photo Preview */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={resumeData.personalInfo.photo}
                              alt="Preview"
                              className={`w-20 h-20 object-cover border-2 border-gray-300 ${
                                resumeData.personalInfo.photoAdjustments?.shape === 'circle' ? 'rounded-full' :
                                resumeData.personalInfo.photoAdjustments?.shape === 'rounded' ? 'rounded-lg' : 'rounded-none'
                              }`}
                              style={{
                                filter: `brightness(${resumeData.personalInfo.photoAdjustments?.brightness || 100}%) contrast(${resumeData.personalInfo.photoAdjustments?.contrast || 100}%)`,
                                objectPosition: resumeData.personalInfo.photoAdjustments?.position === 'center' ? 'center' :
                                              resumeData.personalInfo.photoAdjustments?.position === 'top' ? 'top' : 'bottom'
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-1">Preview</p>
                        </div>

                        <div className="flex-1 space-y-3">
                          {/* Shape Selection */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Photo Shape</label>
                            <div className="flex space-x-2">
                              {[
                                { value: 'circle', label: '⭕ Circle', desc: 'Round' },
                                { value: 'rounded', label: '⬜ Rounded', desc: 'Soft corners' },
                                { value: 'square', label: '⬛ Square', desc: 'Sharp corners' }
                              ].map((shape) => (
                                <button
                                  key={shape.value}
                                  onClick={() => updateResumeData({
                                    personalInfo: {
                                      ...resumeData.personalInfo,
                                      photoAdjustments: {
                                        ...(resumeData.personalInfo.photoAdjustments || {}),
                                        shape: shape.value as any
                                      }
                                    }
                                  })}
                                  className={`flex-1 p-2 text-xs rounded-lg border transition-all ${
                                    resumeData.personalInfo.photoAdjustments?.shape === shape.value
                                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  <div className="text-center">
                                    <div>{shape.label.split(' ')[0]}</div>
                                    <div className="font-medium">{shape.desc}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Size Selection */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Photo Size</label>
                            <div className="flex space-x-2">
                              {[
                                { value: 'small', label: 'Small' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'large', label: 'Large' }
                              ].map((size) => (
                                <button
                                  key={size.value}
                                  onClick={() => updateResumeData({
                                    personalInfo: {
                                      ...resumeData.personalInfo,
                                      photoAdjustments: {
                                        ...(resumeData.personalInfo.photoAdjustments || {}),
                                        size: size.value as any
                                      }
                                    }
                                  })}
                                  className={`flex-1 py-1.5 px-3 text-xs rounded-lg border transition-all ${
                                    resumeData.personalInfo.photoAdjustments?.size === size.value
                                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  {size.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Position Selection */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Photo Position</label>
                            <div className="flex space-x-2">
                              {[
                                { value: 'top', label: '⬆️ Top' },
                                { value: 'center', label: '⭐ Center' },
                                { value: 'bottom', label: '⬇️ Bottom' }
                              ].map((position) => (
                                <button
                                  key={position.value}
                                  onClick={() => updateResumeData({
                                    personalInfo: {
                                      ...resumeData.personalInfo,
                                      photoAdjustments: {
                                        ...(resumeData.personalInfo.photoAdjustments || {}),
                                        position: position.value as any
                                      }
                                    }
                                  })}
                                  className={`flex-1 py-1.5 px-3 text-xs rounded-lg border transition-all ${
                                    resumeData.personalInfo.photoAdjustments?.position === position.value
                                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  {position.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Adjustments */}
                      <div className="space-y-3">
                        {/* Brightness */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">☀️ Brightness</label>
                            <span className="text-xs text-gray-500">{resumeData.personalInfo.photoAdjustments?.brightness || 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={resumeData.personalInfo.photoAdjustments?.brightness || 100}
                            onChange={(e) => updateResumeData({
                              personalInfo: {
                                ...resumeData.personalInfo,
                                photoAdjustments: {
                                  ...resumeData.personalInfo.photoAdjustments,
                                  brightness: parseInt(e.target.value)
                                }
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Contrast */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">🌗 Contrast</label>
                            <span className="text-xs text-gray-500">{resumeData.personalInfo.photoAdjustments?.contrast || 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={resumeData.personalInfo.photoAdjustments?.contrast || 100}
                            onChange={(e) => updateResumeData({
                              personalInfo: {
                                ...resumeData.personalInfo,
                                photoAdjustments: {
                                  ...resumeData.personalInfo.photoAdjustments,
                                  contrast: parseInt(e.target.value)
                                }
                              }
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Reset Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => updateResumeData({
                              personalInfo: {
                                ...resumeData.personalInfo,
                                photoAdjustments: {
                                  position: 'center',
                                  size: 'medium',
                                  shape: 'circle',
                                  brightness: 100,
                                  contrast: 100,
                                  crop: { x: 0, y: 0, width: 100, height: 100 }
                                }
                              }
                            })}
                            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-all duration-200"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {activeSection === 'summary' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Professional Summary
                </h3>
                <button
                  onClick={generateProfessionalSummary}
                  disabled={aiLoading}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{aiLoading ? 'Generating...' : 'AI Generate'}</span>
                </button>
              </div>

              <textarea
                value={resumeData.professionalSummary}
                onChange={(e) => updateResumeData({ professionalSummary: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Keep it concise (3-4 sentences) and focus on your unique value proposition
              </p>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                  </svg>
                  Work Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Experience #{index + 1}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => enhanceJobDescription(exp.id)}
                          disabled={aiLoading}
                          className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 disabled:opacity-50"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>AI Enhance</span>
                        </button>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Job Title"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City, State"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <div className="space-y-1">
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            disabled={exp.current}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                          <label className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                              className="mr-1"
                            />
                            <span>Current position</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Job Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        rows={4}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible&#10;• Focus on impact and value delivered"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Use action verbs and quantify achievements (e.g., "Increased sales by 25%")
                      </p>
                    </div>
                  </div>
                ))}

                {resumeData.experience.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                    </svg>
                    <p>No work experience added yet</p>
                    <p className="text-sm">Click "Add Experience" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Education #{index + 1}</span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                ))}

                {resumeData.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    <p>No education added yet</p>
                    <p className="text-sm">Click "Add Education" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Skills & Technologies
                </h3>
                <button
                  onClick={() => generateAISuggestions('software')}
                  disabled={aiLoading}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{aiLoading ? 'Loading...' : 'AI Suggest'}</span>
                </button>
              </div>

              {/* Add Skill Input */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="skillInput"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addSkill(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('skillInput') as HTMLInputElement;
                      addSkill(input.value);
                      input.value = '';
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Current Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  {resumeData.skills.length === 0 && (
                    <p className="text-gray-500 text-sm">No skills added yet. Add skills above or use AI suggestions.</p>
                  )}
                </div>
              </div>

              {/* AI Suggested Skills */}
              {aiSuggestedSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Suggested Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestedSkills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          addSkill(skill);
                          setAiSuggestedSkills(prev => prev.filter(s => s !== skill));
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                      >
                        {skill}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Projects
                </h3>
                <button
                  onClick={addProject}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Project #{index + 1}</span>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => updateProject(project.id, { name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="E-commerce Platform"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Project Link</label>
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => updateProject(project.id, { link: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Technologies Used</label>
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, { technologies: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="React, Node.js, MongoDB, AWS"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Project Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Describe the project, your role, challenges overcome, and results achieved..."
                      />
                    </div>
                  </div>
                ))}

                {resumeData.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>No projects added yet</p>
                    <p className="text-sm">Click "Add Project" to showcase your work</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {activeSection === 'languages' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Languages
                </h3>
                <button
                  onClick={addLanguage}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Language
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.languages.map((language, index) => (
                  <div key={language.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Language #{index + 1}</span>
                      <button
                        onClick={() => removeLanguage(language.id)}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-medium rounded-lg hover:from-red-200 hover:to-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <input
                          type="text"
                          value={language.name}
                          onChange={(e) => updateLanguage(language.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., English, Spanish, French"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                        <select
                          value={language.proficiency}
                          onChange={(e) => updateLanguage(language.id, { proficiency: e.target.value as Language['proficiency'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {resumeData.languages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Languages Added</h3>
                    <p className="text-gray-500">Showcase your multilingual abilities</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Language" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {activeSection === 'certifications' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Certifications
                </h3>
                <button
                  onClick={addCertification}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={cert.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Certification #{index + 1}</span>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-medium rounded-lg hover:from-red-200 hover:to-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., AWS Certified Solutions Architect"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Amazon Web Services"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                          <input
                            type="month"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                          <input
                            type="month"
                            value={cert.expiryDate}
                            onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID (Optional)</label>
                          <input
                            type="text"
                            value={cert.credentialId}
                            onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., ABC123XYZ"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Link (Optional)</label>
                        <input
                          type="url"
                          value={cert.link}
                          onChange={(e) => updateCertification(cert.id, { link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., https://verify.certificationbody.com/123"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {resumeData.certifications.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Certifications Added</h3>
                    <p className="text-gray-500">Highlight your professional credentials</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Certification" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customization Section */}
          {activeSection === 'customize' && (
            <div className="space-y-6">

              {/* Color Themes */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-4a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2z" />
                  </svg>
                  Color Theme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {colorThemes.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        selectedTheme.name === theme.name
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-center space-x-1">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.primary }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.secondary }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.accent }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-center text-gray-700">{theme.name}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Custom Colors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedTheme.primary}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            primary: e.target.value
                          })}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedTheme.primary}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            primary: e.target.value
                          })}
                          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#D4A574"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedTheme.secondary}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            secondary: e.target.value
                          })}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedTheme.secondary}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            secondary: e.target.value
                          })}
                          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#B8926A"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Accent Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedTheme.accent}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            accent: e.target.value
                          })}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedTheme.accent}
                          onChange={(e) => setSelectedTheme({
                            ...selectedTheme,
                            name: 'Custom',
                            accent: e.target.value
                          })}
                          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#E6B485"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Job Matching */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  AI Job Matching
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Job Description for Analysis
                    </label>
                    <textarea
                      value={jobMatchingData.jobDescription}
                      onChange={(e) => setJobMatchingData(prev => ({ ...prev, jobDescription: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Paste the job description here and get AI analysis of how well your resume matches..."
                    />
                  </div>

                  <button
                    onClick={analyzeJobMatching}
                    disabled={!jobMatchingData.jobDescription || aiLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{aiLoading ? 'Analyzing...' : 'Analyze Job Match'}</span>
                  </button>

                  {jobMatchingData.matchScore > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-900">Match Score</h4>
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-bold text-purple-600">{jobMatchingData.matchScore}%</div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            jobMatchingData.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                            jobMatchingData.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {jobMatchingData.matchScore >= 80 ? 'Excellent' :
                             jobMatchingData.matchScore >= 60 ? 'Good' : 'Needs Work'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-purple-800 text-sm mb-1">AI Suggestions:</h5>
                          <ul className="text-sm text-purple-700 space-y-1">
                            {jobMatchingData.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-purple-800 text-sm mb-1">Missing Skills:</h5>
                          <div className="flex flex-wrap gap-1">
                            {jobMatchingData.missingSkills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>

              <button
                onClick={exportToDOCX}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download DOCX
              </button>

              <button
                onClick={resetResume}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="text-white font-semibold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h3>
            </div>

            <div className="p-6 max-h-screen overflow-y-auto">
              <div
                ref={resumeRef}
                className="bg-white"
                style={{
                  transform: 'scale(0.8)',
                  transformOrigin: 'top left',
                  width: '125%',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                {/* Resume Preview Content - Professional Layout */}
                <div className="w-full h-auto min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>

                  {/* Header Section */}
                  <div className="w-full py-4 px-4 md:py-6 md:px-6" style={{ backgroundColor: selectedTheme.primary }}>
                    <div className="flex flex-col md:flex-row items-center md:items-center">
                      {/* Photo */}
                      {resumeData.personalInfo.photo && (
                        <div className="mb-3 md:mb-0 md:mr-6">
                          <img
                            src={resumeData.personalInfo.photo}
                            alt="Professional"
                            className={`object-cover border-2 border-white rounded-full ${
                              resumeData.personalInfo.photoAdjustments?.size === 'small' ? 'w-14 h-14' :
                              resumeData.personalInfo.photoAdjustments?.size === 'large' ? 'w-20 h-20' : 'w-16 h-16'
                            }`}
                            style={{
                              filter: `brightness(${resumeData.personalInfo.photoAdjustments?.brightness || 100}%) contrast(${resumeData.personalInfo.photoAdjustments?.contrast || 100}%)`,
                              objectPosition: resumeData.personalInfo.photoAdjustments?.position || 'center'
                            }}
                          />
                        </div>
                      )}

                      {/* Name and Title */}
                      <div className="text-white text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-bold tracking-wide mb-1">
                          {(resumeData.personalInfo.fullName || 'YOUR NAME').toUpperCase()}
                        </h1>
                        {resumeData.professionalSummary && (
                          <p className="text-xs md:text-sm opacity-90 font-light">
                            {resumeData.professionalSummary.split(' ').slice(0, 8).join(' ')}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-6 py-4">

                    {/* Contact Section */}
                    <div className="mb-5 bg-gray-50 p-3 rounded-lg">
                      <h2 className="text-base font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>CONTACT</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                        {resumeData.personalInfo.phone && (
                          <div className="flex items-center">
                            <span className="mr-2">📞</span>
                            <span>{resumeData.personalInfo.phone}</span>
                          </div>
                        )}
                        {resumeData.personalInfo.email && (
                          <div className="flex items-center">
                            <span className="mr-2">✉️</span>
                            <span>{resumeData.personalInfo.email}</span>
                          </div>
                        )}
                        {resumeData.personalInfo.linkedin && (
                          <div className="flex items-center">
                            <span className="mr-2">💼</span>
                            <span>LinkedIn Profile</span>
                          </div>
                        )}
                        {resumeData.personalInfo.address && (
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span>{resumeData.personalInfo.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* About Me Section */}
                    {resumeData.professionalSummary && (
                      <div className="mb-5">
                        <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>ABOUT ME</h2>
                        <p className="text-gray-700 leading-relaxed text-xs">
                          {resumeData.professionalSummary}
                        </p>
                      </div>
                    )}

                    {/* Professional Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mb-5">
                        <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: selectedTheme.primary }}>PROFESSIONAL EXPERIENCE</h2>
                        <div className="space-y-3">
                          {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="border-l-3 pl-4" style={{ borderColor: selectedTheme.accent }}>
                              <div className="mb-1">
                                <h3 className="text-sm font-semibold text-gray-800">{exp.position}</h3>
                                <p className="text-xs font-medium" style={{ color: selectedTheme.secondary }}>{exp.company}, {exp.location}</p>
                                <p className="text-xs text-gray-500">
                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                              </div>
                              {exp.description && (
                                <div className="text-xs text-gray-700 leading-relaxed">
                                  {exp.description.split('\n').map((line, idx) => (
                                    <p key={idx} className="mb-0.5">• {line.trim()}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mb-5">
                        <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>EDUCATION</h2>
                        <div className="space-y-2">
                          {resumeData.education.map((edu, index) => (
                            <div key={edu.id}>
                              <h3 className="text-sm font-semibold text-gray-800">{edu.degree}</h3>
                              <p className="text-xs" style={{ color: selectedTheme.secondary }}>{edu.institution}</p>
                              <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                              {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Two Column Layout for Skills and Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Skills */}
                      {resumeData.skills.length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>KEY SKILLS</h2>
                          <div className="space-y-1">
                            {resumeData.skills.map((skill, index) => (
                              <div key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: selectedTheme.accent }}></span>
                                <span className="text-xs text-gray-700">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {resumeData.languages && resumeData.languages.length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>LANGUAGES</h2>
                          <div className="space-y-1">
                            {resumeData.languages.map((lang, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-xs text-gray-700">{lang.name || 'Language'}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{lang.proficiency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    {resumeData.certifications && resumeData.certifications.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>CERTIFICATIONS</h2>
                        <div className="space-y-1">
                          {resumeData.certifications.map((cert, index) => (
                            <div key={cert.id || index} className="border-l-3 pl-3" style={{ borderColor: selectedTheme.accent }}>
                              <div className="text-xs font-semibold text-gray-800">{cert.name || 'Certification'}</div>
                              <div className="text-xs" style={{ color: selectedTheme.secondary }}>{cert.issuer || 'Organization'}</div>
                              {cert.date && (
                                <div className="text-xs text-gray-500">
                                  {new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects && resumeData.projects.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold mb-2 tracking-wide" style={{ color: selectedTheme.primary }}>PROJECTS</h2>
                        <div className="space-y-2">
                          {resumeData.projects.map((project, index) => (
                            <div key={project.id} className="border-l-3 pl-3" style={{ borderColor: selectedTheme.accent }}>
                              <h3 className="text-xs font-semibold text-gray-800">{project.name}</h3>
                              <p className="text-xs text-gray-600 mb-1">{project.description}</p>
                              {project.technologies && (
                                <p className="text-xs" style={{ color: selectedTheme.secondary }}>Technologies: {project.technologies}</p>
                              )}
                              {project.link && (
                                <p className="text-xs underline" style={{ color: selectedTheme.secondary }}>{project.link}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                  {/* Empty State */}
                  {!resumeData.personalInfo.fullName &&
                   !resumeData.personalInfo.email &&
                   !resumeData.professionalSummary &&
                   resumeData.skills.length === 0 &&
                   resumeData.experience.length === 0 &&
                   resumeData.education.length === 0 &&
                   resumeData.projects.length === 0 &&
                   (!resumeData.languages || resumeData.languages.length === 0) &&
                   (!resumeData.certifications || resumeData.certifications.length === 0) ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Your Resume Preview</h3>
                      <p className="text-gray-500">Start filling out the form to see your resume come to life</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </React.Fragment>
  );
}