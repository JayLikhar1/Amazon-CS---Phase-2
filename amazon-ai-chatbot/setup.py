"""
Setup Script for AI Customer Segmentation Chatbot
Automates the setup process and model download
"""

import os
import sys
import subprocess
import urllib.request
from pathlib import Path
import shutil

def print_header():
    """Print setup header"""
    print("🤖 AI Customer Segmentation Chatbot Setup")
    print("=" * 50)
    print("Setting up your offline AI chatbot system...")
    print()

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required. Current version:", sys.version)
        return False
    
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    
    try:
        # Install basic requirements
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Basic dependencies installed")
        
        # Try to install llama-cpp-python with optimizations
        print("🔧 Installing llama-cpp-python (this may take a few minutes)...")
        
        # Detect system and install optimized version
        import platform
        system = platform.system().lower()
        machine = platform.machine().lower()
        
        if system == "darwin" and ("arm" in machine or "m1" in machine or "m2" in machine):
            # Apple Silicon Mac
            print("🍎 Detected Apple Silicon Mac - installing with Metal support...")
            env = os.environ.copy()
            env["CMAKE_ARGS"] = "-DLLAMA_METAL=on"
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "llama-cpp-python", "--force-reinstall", "--no-cache-dir"
            ], env=env)
        elif system == "linux":
            # Linux with OpenBLAS
            print("🐧 Detected Linux - installing with OpenBLAS support...")
            env = os.environ.copy()
            env["CMAKE_ARGS"] = "-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "llama-cpp-python", "--force-reinstall", "--no-cache-dir"
            ], env=env)
        else:
            # Windows or other systems
            print("🪟 Installing standard version...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "llama-cpp-python", "--force-reinstall", "--no-cache-dir"
            ])
        
        print("✅ llama-cpp-python installed successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print("💡 Try installing manually: pip install -r requirements.txt")
        return False

def create_models_directory():
    """Create models directory"""
    print("\n📁 Creating models directory...")
    
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    print("✅ Models directory created")
    return models_dir

def download_model():
    """Download the Mistral-7B model"""
    print("\n🧠 Setting up LLM model...")
    
    models_dir = create_models_directory()
    model_filename = "mistral-7b-instruct-v0.1.Q4_K_M.gguf"
    model_path = models_dir / model_filename
    
    if model_path.exists():
        print(f"✅ Model already exists: {model_path}")
        return True
    
    print("📥 Model not found. Here are your options:")
    print()
    print("Option 1: Automatic Download (Recommended)")
    print("Option 2: Manual Download")
    print("Option 3: Skip for now")
    print()
    
    choice = input("Choose option (1/2/3): ").strip()
    
    if choice == "1":
        return download_model_automatic(model_path)
    elif choice == "2":
        return download_model_manual(model_path)
    else:
        print("⏭️  Skipping model download. You can download it later.")
        print(f"📖 See README.md for download instructions")
        return True

def download_model_automatic(model_path):
    """Attempt automatic model download"""
    print("\n🔄 Attempting automatic download...")
    
    try:
        # Try using huggingface-hub if available
        try:
            from huggingface_hub import hf_hub_download
            print("📡 Using huggingface-hub for download...")
            
            downloaded_path = hf_hub_download(
                repo_id="TheBloke/Mistral-7B-Instruct-v0.1-GGUF",
                filename="mistral-7b-instruct-v0.1.Q4_K_M.gguf",
                local_dir="models"
            )
            print(f"✅ Model downloaded successfully: {downloaded_path}")
            return True
            
        except ImportError:
            print("📦 Installing huggingface-hub...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "huggingface-hub"])
            
            from huggingface_hub import hf_hub_download
            downloaded_path = hf_hub_download(
                repo_id="TheBloke/Mistral-7B-Instruct-v0.1-GGUF",
                filename="mistral-7b-instruct-v0.1.Q4_K_M.gguf",
                local_dir="models"
            )
            print(f"✅ Model downloaded successfully: {downloaded_path}")
            return True
            
    except Exception as e:
        print(f"❌ Automatic download failed: {e}")
        print("💡 Falling back to manual download instructions...")
        return download_model_manual(model_path)

def download_model_manual(model_path):
    """Provide manual download instructions"""
    print("\n📖 Manual Download Instructions:")
    print("=" * 40)
    print("1. Visit: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF")
    print("2. Download: mistral-7b-instruct-v0.1.Q4_K_M.gguf (~4.1GB)")
    print(f"3. Place the file in: {model_path.absolute()}")
    print()
    print("Alternative download methods:")
    print("• wget: wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf")
    print("• curl: curl -L -o models/mistral-7b-instruct-v0.1.Q4_K_M.gguf https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf")
    print()
    
    input("Press Enter after downloading the model...")
    
    if model_path.exists():
        print("✅ Model file found!")
        return True
    else:
        print("⚠️  Model file not found. You can download it later.")
        return False

def run_system_test():
    """Run system tests"""
    print("\n🧪 Running system tests...")
    
    try:
        import test_system
        success = test_system.run_comprehensive_test()
        return success
    except Exception as e:
        print(f"❌ System test failed: {e}")
        return False

def create_launch_script():
    """Create a launch script for easy startup"""
    print("\n🚀 Creating launch script...")
    
    # Create launch script for different platforms
    if os.name == 'nt':  # Windows
        script_content = """@echo off
echo Starting AI Customer Segmentation Chatbot...
streamlit run app.py
pause
"""
        with open("launch.bat", "w") as f:
            f.write(script_content)
        print("✅ Created launch.bat for Windows")
    else:  # Unix-like systems
        script_content = """#!/bin/bash
echo "Starting AI Customer Segmentation Chatbot..."
streamlit run app.py
"""
        with open("launch.sh", "w") as f:
            f.write(script_content)
        os.chmod("launch.sh", 0o755)
        print("✅ Created launch.sh for Unix systems")

def print_completion_message():
    """Print setup completion message"""
    print("\n" + "=" * 50)
    print("🎉 SETUP COMPLETE!")
    print("=" * 50)
    print()
    print("Your AI Customer Segmentation Chatbot is ready!")
    print()
    print("🚀 To start the application:")
    if os.name == 'nt':
        print("   • Double-click: launch.bat")
        print("   • Or run: streamlit run app.py")
    else:
        print("   • Run: ./launch.sh")
        print("   • Or run: streamlit run app.py")
    print()
    print("🌐 The app will open at: http://localhost:8501")
    print()
    print("💡 Example questions to try:")
    print("   • 'Which customer segment is most profitable?'")
    print("   • 'Compare segment 1 and segment 2'")
    print("   • 'Suggest marketing strategy for high-value customers'")
    print()
    print("📖 For more information, see README.md")
    print()
    print("🔒 Remember: This runs 100% offline with no API costs!")

def main():
    """Main setup function"""
    print_header()
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install dependencies
    if not install_dependencies():
        print("⚠️  Continuing with partial setup...")
    
    # Download model
    download_model()
    
    # Run system tests
    print("\n🧪 Running final system validation...")
    test_success = run_system_test()
    
    # Create launch script
    create_launch_script()
    
    # Print completion message
    print_completion_message()
    
    if not test_success:
        print("⚠️  Some tests failed, but the system may still work.")
        print("📖 Check README.md for troubleshooting if you encounter issues.")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Setup failed with error: {e}")
        print("📖 Please check README.md for manual setup instructions")
        sys.exit(1)