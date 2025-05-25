 document.addEventListener('DOMContentLoaded', function() {
            const elements = {
                fileInput: document.getElementById('fileInput'),
                previewImage: document.getElementById('previewImage'),
                rotateLeftBtn: document.getElementById('rotateLeftBtn'),
                rotateRightBtn: document.getElementById('rotateRightBtn'),
                downloadBtn: document.getElementById('downloadBtn'),
                statusMessage: document.getElementById('statusMessage')
            };
            
            const checkElements = () => {
                for (const [key, element] of Object.entries(elements)) {
                    if (!element) {
                        console.error;
                        return false;
                    }
                }
                return true;
            };
            
            if (!checkElements()) {
                elements.statusMessage.textContent = ' ';
                return;
            }
            
            let rotation = 0;
            let currentFile = null;
            
            elements.fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                currentFile = file;
                
                if (!file) {
                    elements.statusMessage.textContent = ' ';
                    return;
                }
                
                if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                    elements.statusMessage.textContent = ' ';
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    elements.statusMessage.textContent = ' ';
                    return;
                }
                
                elements.statusMessage.textContent = ' ';
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    elements.previewImage.src = event.target.result;
                    elements.previewImage.style.display = 'block';
                    rotation = 0;
                    
                    elements.previewImage.onload = function() {
                        elements.statusMessage.textContent = ` ${file.name}`;
                        enableAllButtons();
                    };
                    
                    elements.previewImage.onerror = function() {
                        elements.statusMessage.textContent = ' ';
                        disableAllButtons();
                    };
                };
                
                reader.onerror = function() {
                    elements.statusMessage.textContent = ' ';
                    disableAllButtons();
                };
                
                reader.readAsDataURL(file);
            });
            
            elements.rotateLeftBtn.addEventListener('click', function() {
                rotation -= 90;
                updateImageRotation();
            });
            
            elements.rotateRightBtn.addEventListener('click', function() {
                rotation += 90;
                updateImageRotation();
            });
            
            elements.downloadBtn.addEventListener('click', function() {
                if (!elements.previewImage.src) {
                    elements.statusMessage.textContent = '';
                    return;
                }
                
                elements.statusMessage.textContent = ' ';
                
                setTimeout(() => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        if (Math.abs(rotation) % 180 === 0) {
                            canvas.width = elements.previewImage.naturalWidth;
                            canvas.height = elements.previewImage.naturalHeight;
                        } else {
                            canvas.width = elements.previewImage.naturalHeight;
                            canvas.height = elements.previewImage.naturalWidth;
                        }
                        
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(rotation * Math.PI / 180);
                        ctx.drawImage(
                            elements.previewImage,
                            -elements.previewImage.naturalWidth / 2,
                            -elements.previewImage.naturalHeight / 2,
                            elements.previewImage.naturalWidth,
                            elements.previewImage.naturalHeight
                        );
                        
                        const link = document.createElement('a');
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const fileName = currentFile ? currentFile.name.replace(/\.[^/.]+$/, '') : 'image';
                        link.download = `${fileName}-rotated-${timestamp}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                        
                        elements.statusMessage.textContent = ' ';
                    } catch (error) {
                        console.error(' ', error);
                        elements.statusMessage.textContent = ' ' + error.message;
                    }
                }, 100);
            });
            
            function updateImageRotation() {
                elements.previewImage.style.transform = `rotate(${rotation}deg)`;
                elements.statusMessage.textContent = ` ${rotation}°`;
            }
            
            function enableAllButtons() {
                elements.rotateLeftBtn.disabled = false;
                elements.rotateRightBtn.disabled = false;
                elements.downloadBtn.disabled = false;
            }
            
            function disableAllButtons() {
                elements.rotateLeftBtn.disabled = true;
                elements.rotateRightBtn.disabled = true;
                elements.downloadBtn.disabled = true;
            }
        });
