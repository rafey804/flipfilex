# converters/pdf_password.py - PDF Password Protection Engine
import os
import shutil
import tempfile
import subprocess
from typing import Optional, Dict, Any, List
import asyncio
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Check for PyPDF2/PyPDF4 availability
try:
    import PyPDF2
    PDF_READER_AVAILABLE = True
except ImportError:
    try:
        import PyPDF4 as PyPDF2
        PDF_READER_AVAILABLE = True
    except ImportError:
        PDF_READER_AVAILABLE = False
        logger.warning("PyPDF2/PyPDF4 not available - PDF password operations will be limited")

# Check for pikepdf availability (better encryption support)
try:
    import pikepdf
    PIKEPDF_AVAILABLE = True
    logger.info("pikepdf available for advanced PDF encryption")
except ImportError:
    PIKEPDF_AVAILABLE = False
    logger.warning("pikepdf not available - using basic encryption")

# Permission flags
PDF_PERMISSIONS = {
    'print': 4,           # Allow printing
    'modify': 8,          # Allow modifying the document
    'copy': 16,           # Allow copying text and graphics
    'annotations': 32,    # Allow adding annotations
    'forms': 256,         # Allow filling in forms
    'extract': 512,       # Allow text/graphics extraction for accessibility
    'assemble': 1024,     # Allow assembling the document
    'print_high': 2048    # Allow high-quality printing
}

# Encryption levels
ENCRYPTION_LEVELS = {
    'basic': {
        'name': 'Basic Encryption (40-bit)',
        'description': 'Standard encryption for basic protection',
        'algorithm': 'RC4',
        'key_length': 40,
        'security_level': 'Low'
    },
    'standard': {
        'name': 'Standard Encryption (128-bit)',
        'description': 'Strong encryption for normal use',
        'algorithm': 'RC4/AES',
        'key_length': 128,
        'security_level': 'Medium'
    },
    'high': {
        'name': 'High Security (256-bit AES)',
        'description': 'Advanced encryption for sensitive documents',
        'algorithm': 'AES',
        'key_length': 256,
        'security_level': 'High'
    }
}


class PDFPasswordManager:
    """Advanced PDF password protection and removal"""

    def __init__(self):
        self.temp_files = []

    def cleanup(self):
        """Clean up temporary files"""
        for temp_file in self.temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except:
                pass
        self.temp_files = []

    def __del__(self):
        self.cleanup()

    async def add_password(self, input_path: str, output_path: str,
                          user_password: str, owner_password: Optional[str] = None,
                          encryption_level: str = 'standard',
                          permissions: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Add password protection to PDF file

        Args:
            input_path: Path to input PDF file
            output_path: Path to output protected PDF file
            user_password: Password for opening the document
            owner_password: Password for changing permissions (optional)
            encryption_level: 'basic', 'standard', or 'high'
            permissions: List of allowed permissions

        Returns:
            Dict with protection results
        """
        try:
            if not os.path.exists(input_path):
                return {
                    'success': False,
                    'error': 'Input PDF file not found'
                }

            logger.info(f"Adding password protection to PDF: {input_path}")

            # Use owner password if not provided
            if not owner_password:
                owner_password = user_password

            # Try pikepdf first (better encryption support)
            if PIKEPDF_AVAILABLE:
                result = await self._protect_with_pikepdf(
                    input_path, output_path, user_password, owner_password,
                    encryption_level, permissions
                )
                if result['success']:
                    return result

            # Fallback to PyPDF2
            if PDF_READER_AVAILABLE:
                result = await self._protect_with_pypdf2(
                    input_path, output_path, user_password, owner_password, permissions
                )
                if result['success']:
                    return result

            return {
                'success': False,
                'error': 'No PDF encryption tools available'
            }

        except Exception as e:
            logger.error(f"PDF password protection error: {str(e)}")
            return {
                'success': False,
                'error': f'Password protection failed: {str(e)}'
            }

    async def remove_password(self, input_path: str, output_path: str,
                             password: str) -> Dict[str, Any]:
        """
        Remove password protection from PDF file

        Args:
            input_path: Path to input protected PDF file
            output_path: Path to output unprotected PDF file
            password: Password to unlock the PDF

        Returns:
            Dict with removal results
        """
        try:
            if not os.path.exists(input_path):
                return {
                    'success': False,
                    'error': 'Input PDF file not found'
                }

            logger.info(f"Removing password protection from PDF: {input_path}")

            # Try pikepdf first
            if PIKEPDF_AVAILABLE:
                result = await self._unprotect_with_pikepdf(input_path, output_path, password)
                if result['success']:
                    return result

            # Fallback to PyPDF2
            if PDF_READER_AVAILABLE:
                result = await self._unprotect_with_pypdf2(input_path, output_path, password)
                if result['success']:
                    return result

            return {
                'success': False,
                'error': 'No PDF decryption tools available'
            }

        except Exception as e:
            logger.error(f"PDF password removal error: {str(e)}")
            return {
                'success': False,
                'error': f'Password removal failed: {str(e)}'
            }

    async def _protect_with_pikepdf(self, input_path: str, output_path: str,
                                   user_password: str, owner_password: str,
                                   encryption_level: str, permissions: Optional[List[str]]) -> Dict[str, Any]:
        """Protect PDF using pikepdf (advanced encryption)"""
        try:
            # Open PDF
            pdf = pikepdf.open(input_path)

            # Set encryption parameters based on level
            encryption_config = ENCRYPTION_LEVELS.get(encryption_level, ENCRYPTION_LEVELS['standard'])

            # Calculate permission flags
            permission_flags = 0
            if permissions:
                for perm in permissions:
                    if perm in PDF_PERMISSIONS:
                        permission_flags |= PDF_PERMISSIONS[perm]
            else:
                # Default permissions: print and copy
                permission_flags = PDF_PERMISSIONS['print'] | PDF_PERMISSIONS['copy']

            # Set encryption
            if encryption_level == 'high':
                # AES 256-bit encryption
                encryption = pikepdf.Encryption(
                    user=user_password,
                    owner=owner_password,
                    R=6,  # Revision 6 (AES-256)
                    allow=pikepdf.Permissions(permission_flags)
                )
            else:
                # Standard 128-bit encryption
                encryption = pikepdf.Encryption(
                    user=user_password,
                    owner=owner_password,
                    R=4,  # Revision 4 (128-bit)
                    allow=pikepdf.Permissions(permission_flags)
                )

            # Save protected PDF
            pdf.save(output_path, encryption=encryption)
            pdf.close()

            return {
                'success': True,
                'encryption_method': 'pikepdf',
                'encryption_level': encryption_level,
                'encryption_config': encryption_config,
                'permissions_set': permissions or ['print', 'copy']
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'pikepdf protection error: {str(e)}'
            }

    async def _protect_with_pypdf2(self, input_path: str, output_path: str,
                                  user_password: str, owner_password: str,
                                  permissions: Optional[List[str]]) -> Dict[str, Any]:
        """Protect PDF using PyPDF2 (basic encryption)"""
        try:
            with open(input_path, 'rb') as input_file:
                # Try new PyPDF2 API first
                try:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()

                    # Copy all pages
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)

                    # Add password protection
                    pdf_writer.encrypt(user_password, owner_password)

                    # Write protected PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

                except AttributeError:
                    # Fallback to old PyPDF2 API
                    input_file.seek(0)
                    pdf_reader = PyPDF2.PdfFileReader(input_file)
                    pdf_writer = PyPDF2.PdfFileWriter()

                    # Copy all pages
                    for page_num in range(pdf_reader.numPages):
                        pdf_writer.addPage(pdf_reader.getPage(page_num))

                    # Add password protection
                    pdf_writer.encrypt(user_password, owner_password, use_128bit=True)

                    # Write protected PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

            return {
                'success': True,
                'encryption_method': 'pypdf2',
                'encryption_level': 'standard',
                'encryption_config': ENCRYPTION_LEVELS['standard']
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'PyPDF2 protection error: {str(e)}'
            }

    async def _unprotect_with_pikepdf(self, input_path: str, output_path: str,
                                     password: str) -> Dict[str, Any]:
        """Remove protection using pikepdf"""
        try:
            # Open protected PDF
            pdf = pikepdf.open(input_path, password=password)

            # Save unprotected PDF
            pdf.save(output_path)
            pdf.close()

            return {
                'success': True,
                'decryption_method': 'pikepdf'
            }

        except pikepdf.PasswordError:
            return {
                'success': False,
                'error': 'Incorrect password provided'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'pikepdf decryption error: {str(e)}'
            }

    async def _unprotect_with_pypdf2(self, input_path: str, output_path: str,
                                    password: str) -> Dict[str, Any]:
        """Remove protection using PyPDF2"""
        try:
            with open(input_path, 'rb') as input_file:
                # Try new PyPDF2 API first
                try:
                    pdf_reader = PyPDF2.PdfReader(input_file)

                    # Check if PDF is encrypted
                    if not pdf_reader.is_encrypted:
                        return {
                            'success': False,
                            'error': 'PDF is not password protected'
                        }

                    # Try to decrypt
                    if not pdf_reader.decrypt(password):
                        return {
                            'success': False,
                            'error': 'Incorrect password provided'
                        }

                    pdf_writer = PyPDF2.PdfWriter()

                    # Copy all pages
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)

                    # Write unprotected PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

                except AttributeError:
                    # Fallback to old PyPDF2 API
                    input_file.seek(0)
                    pdf_reader = PyPDF2.PdfFileReader(input_file)

                    # Check if PDF is encrypted
                    if not pdf_reader.isEncrypted:
                        return {
                            'success': False,
                            'error': 'PDF is not password protected'
                        }

                    # Try to decrypt
                    if not pdf_reader.decrypt(password):
                        return {
                            'success': False,
                            'error': 'Incorrect password provided'
                        }

                    pdf_writer = PyPDF2.PdfFileWriter()

                    # Copy all pages
                    for page_num in range(pdf_reader.numPages):
                        pdf_writer.addPage(pdf_reader.getPage(page_num))

                    # Write unprotected PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

            return {
                'success': True,
                'decryption_method': 'pypdf2'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'PyPDF2 decryption error: {str(e)}'
            }

    def check_password_protection(self, file_path: str) -> Dict[str, Any]:
        """Check if PDF is password protected and get info"""
        try:
            # First check if file is actually a PDF
            if not os.path.exists(file_path):
                return {'error': 'File not found'}

            # Check file extension and magic bytes
            if not file_path.lower().endswith('.pdf'):
                return {'error': 'File is not a PDF'}

            # Read first few bytes to check PDF signature
            try:
                with open(file_path, 'rb') as f:
                    header = f.read(8)
                    if not header.startswith(b'%PDF'):
                        return {'error': 'File is not a valid PDF'}
            except Exception:
                return {'error': 'Cannot read file'}

            info = {
                'is_protected': False,
                'encryption_info': {},
                'file_accessible': False
            }

            # Try pikepdf first
            if PIKEPDF_AVAILABLE:
                try:
                    pdf = pikepdf.open(file_path)
                    info['is_protected'] = pdf.is_encrypted
                    info['file_accessible'] = True

                    if pdf.is_encrypted:
                        # Get encryption info
                        enc_info = pdf.encryption
                        if enc_info:
                            info['encryption_info'] = {
                                'revision': getattr(enc_info, 'R', 'unknown'),
                                'algorithm': 'AES' if getattr(enc_info, 'R', 0) >= 4 else 'RC4',
                                'user_password_required': True
                            }

                    pdf.close()
                    return info

                except pikepdf.PasswordError:
                    info['is_protected'] = True
                    info['file_accessible'] = False
                    return info
                except Exception as e:
                    logger.error(f"pikepdf error: {str(e)}")
                    # Continue to PyPDF2 fallback

            # Fallback to PyPDF2
            if PDF_READER_AVAILABLE:
                try:
                    with open(file_path, 'rb') as file:
                        # Try new PyPDF2 API first
                        try:
                            pdf_reader = PyPDF2.PdfReader(file)
                            info['is_protected'] = pdf_reader.is_encrypted
                            info['file_accessible'] = not pdf_reader.is_encrypted

                            if pdf_reader.is_encrypted:
                                info['encryption_info'] = {
                                    'algorithm': 'RC4/AES',
                                    'user_password_required': True
                                }

                        except AttributeError:
                            # Fallback to old PyPDF2 API
                            file.seek(0)
                            pdf_reader = PyPDF2.PdfFileReader(file)
                            info['is_protected'] = pdf_reader.isEncrypted
                            info['file_accessible'] = not pdf_reader.isEncrypted

                            if pdf_reader.isEncrypted:
                                info['encryption_info'] = {
                                    'algorithm': 'RC4/AES',
                                    'user_password_required': True
                                }

                    return info

                except Exception as e:
                    logger.error(f"PyPDF2 error: {str(e)}")
                    return {'error': f'PDF analysis failed: {str(e)}'}

            return {
                'error': 'No PDF analysis tools available'
            }

        except Exception as e:
            logger.error(f"PDF protection check error: {str(e)}")
            return {
                'error': str(e)
            }


# Global password manager instance
pdf_password_manager = PDFPasswordManager()


async def add_pdf_password(input_path: str, output_path: str,
                          user_password: str, owner_password: Optional[str] = None,
                          encryption_level: str = 'standard',
                          permissions: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Add password protection to PDF file

    Args:
        input_path: Path to input PDF file
        output_path: Path to output protected PDF file
        user_password: Password for opening the document
        owner_password: Password for changing permissions (optional)
        encryption_level: 'basic', 'standard', or 'high'
        permissions: List of allowed permissions

    Returns:
        Dict with protection results
    """
    return await pdf_password_manager.add_password(
        input_path, output_path, user_password, owner_password, encryption_level, permissions
    )


async def remove_pdf_password(input_path: str, output_path: str, password: str) -> Dict[str, Any]:
    """
    Remove password protection from PDF file

    Args:
        input_path: Path to input protected PDF file
        output_path: Path to output unprotected PDF file
        password: Password to unlock the PDF

    Returns:
        Dict with removal results
    """
    return await pdf_password_manager.remove_password(input_path, output_path, password)


def get_password_capabilities() -> Dict[str, Any]:
    """Get password protection capabilities"""
    return {
        'available_methods': {
            'pikepdf': PIKEPDF_AVAILABLE,
            'pypdf2': PDF_READER_AVAILABLE
        },
        'encryption_levels': ENCRYPTION_LEVELS,
        'supported_permissions': list(PDF_PERMISSIONS.keys()),
        'features': {
            'add_password': True,
            'remove_password': True,
            'custom_permissions': PIKEPDF_AVAILABLE,
            'advanced_encryption': PIKEPDF_AVAILABLE,
            'metadata_protection': PIKEPDF_AVAILABLE
        },
        'max_file_size': 100 * 1024 * 1024,  # 100MB
        'supported_formats': ['pdf'],
        'output_format': 'pdf'
    }


def check_pdf_protection(file_path: str) -> Dict[str, Any]:
    """Check PDF protection status"""
    return pdf_password_manager.check_password_protection(file_path)