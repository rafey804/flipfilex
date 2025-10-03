# converters/latex_to_pdf_converter.py - LaTeX to PDF conversion logic
from utils.dependencies import LATEX_AVAILABLE

async def latex_to_pdf_converter(latex_path: str, output_path: str) -> bool:
    """Convert LaTeX to PDF document"""
    if not LATEX_AVAILABLE:
        return False

    try:
        import subprocess
        import os
        import tempfile
        import shutil
        from pathlib import Path

        # Create temporary directory for LaTeX compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy LaTeX file to temp directory
            temp_latex_path = os.path.join(temp_dir, 'document.tex')
            shutil.copy2(latex_path, temp_latex_path)

            # Change to temp directory for compilation
            original_cwd = os.getcwd()
            os.chdir(temp_dir)

            try:
                # Run pdflatex twice (for cross-references, etc.)
                for i in range(2):
                    result = subprocess.run([
                        'pdflatex',
                        '-interaction=nonstopmode',
                        '-output-directory=.',
                        'document.tex'
                    ], capture_output=True, text=True, timeout=60)

                    if result.returncode != 0:
                        print(f"LaTeX compilation error (pass {i+1}): {result.stderr}")
                        if i == 0:  # First pass failed, try to continue
                            continue
                        else:  # Second pass failed
                            return False

                # Check if PDF was created
                temp_pdf_path = os.path.join(temp_dir, 'document.pdf')
                if os.path.exists(temp_pdf_path):
                    # Copy PDF to output location
                    shutil.copy2(temp_pdf_path, output_path)
                    return True
                else:
                    return False

            finally:
                os.chdir(original_cwd)

    except subprocess.TimeoutExpired:
        print("LaTeX compilation timeout")
        return False
    except FileNotFoundError:
        print("pdflatex not found. Please install TeX Live or MiKTeX.")
        return False
    except Exception as e:
        print(f"LaTeX to PDF conversion error: {e}")
        return False