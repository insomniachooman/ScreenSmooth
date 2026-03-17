export class CursorProcessor {
    constructor() {
        this.cursorImage = null;
        this.canvas = null;
        this.ctx = null;
        this.isLoadingCursor = false;

        // Preload cursor image
        this.loadCursorImageAsync();
    }

    async loadCursorImageAsync() {
        if (this.isLoadingCursor || this.cursorImage) return;

        this.isLoadingCursor = true;
        try {
            const cursorPath = typeof chrome !== 'undefined' && chrome.runtime?.getURL
                ? chrome.runtime.getURL('assets/cursor.png')
                : '../../assets/cursor.png';
            console.log('🔄 Loading cursor image from:', cursorPath);
            await this.loadCursorImage(cursorPath);
            console.log('✅ Cursor image loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load cursor image:', error);
        } finally {
            this.isLoadingCursor = false;
        }
    }

    async loadCursorImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cursorImage = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // Catmull-Rom spline interpolation for smooth cursor movement
    getSplinePoint(p0, p1, p2, p3, t) {
        // 🆕 CRITICAL: Validate all coordinate values to prevent NaN
        // If any coordinate is undefined or NaN, the entire calculation becomes NaN
        const isValid = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y);

        if (!isValid(p0) || !isValid(p1) || !isValid(p2) || !isValid(p3)) {
            console.error('❌ Invalid points in spline calculation:', { p0, p1, p2, p3 });
            // Fallback to p1 (current point)
            return { x: p1?.x || 0, y: p1?.y || 0 };
        }

        const tt = t * t;
        const ttt = tt * t;

        const q0 = -ttt + 2 * tt - t;
        const q1 = 3 * ttt - 5 * tt + 2;
        const q2 = -3 * ttt + 4 * tt + t;
        const q3 = ttt - tt;

        const tx = 0.5 * (p0.x * q0 + p1.x * q1 + p2.x * q2 + p3.x * q3);
        const ty = 0.5 * (p0.y * q0 + p1.y * q1 + p2.y * q2 + p3.y * q3);

        // 🆕 Final validation: ensure result is not NaN
        if (!Number.isFinite(tx) || !Number.isFinite(ty)) {
            console.error('❌ Spline calculation produced NaN:', { tx, ty, q0, q1, q2, q3 });
            // Fallback to linear interpolation between p1 and p2
            return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
        }

        return { x: tx, y: ty };
    }

    smoothCursorData(cursorData, smoothingFactor = 5) {
        if (!cursorData || cursorData.length < 4) return cursorData;

        const smoothed = [];
        // Centered moving average for post-processing (no lag)
        const windowSize = smoothingFactor;
        const halfWindow = Math.floor(windowSize / 2);

        for (let i = 0; i < cursorData.length; i++) {
            let sumX = 0;
            let sumY = 0;
            let count = 0;

            // Calculate average for the window around the current point
            const start = Math.max(0, i - halfWindow);
            const end = Math.min(cursorData.length, i + halfWindow + 1);

            for (let j = start; j < end; j++) {
                sumX += cursorData[j].x;
                sumY += cursorData[j].y;
                count++;
            }

            smoothed.push({
                ...cursorData[i], // Keep timestamp and other props
                x: sumX / count,
                y: sumY / count
            });
        }

        console.log(`✨ Smoothed ${cursorData.length} cursor points with factor ${smoothingFactor}`);
        return smoothed;
    }

    // Interpolate cursor position for a specific time with smooth spline
    getCursorAtTime(cursorData, time) {
        if (!cursorData || cursorData.length === 0) return null;

        // If only one point, return it
        if (cursorData.length === 1) return cursorData[0];

        // Find the data points around this time
        let index = -1;
        for (let i = 0; i < cursorData.length - 1; i++) {
            if (time >= cursorData[i].timestamp && time <= cursorData[i + 1].timestamp) {
                index = i;
                break;
            }
        }

        // Handle edge cases - if time is out of bounds
        if (index === -1) {
            if (time > cursorData[cursorData.length - 1].timestamp) {
                return cursorData[cursorData.length - 1];
            }
            return cursorData[0];
        }

        // Get 4 points for Catmull-Rom spline (p0, p1, p2, p3)
        const p1 = cursorData[index];
        const p2 = cursorData[index + 1];

        // Safety check: if p1 or p2 are invalid, return null or fallback
        if (!p1 || !p2) return p1 || cursorData[0];

        const p0 = index > 0 ? cursorData[index - 1] : p1;
        const p3 = index + 2 < cursorData.length ? cursorData[index + 2] : p2;

        // Calculate interpolation factor (0 to 1)
        const duration = p2.timestamp - p1.timestamp;
        if (duration <= 0) return p1;

        const t = (time - p1.timestamp) / duration;

        // Safety check for t
        if (isNaN(t)) return p1;

        // Interpolate scale and rotation linearly
        const scale = p1.scale !== undefined ? p1.scale + (p2.scale - p1.scale) * t : 1;
        const rotation = p1.rotation !== undefined ? p1.rotation + (p2.rotation - p1.rotation) * t : 0;

        // 🆕 CRITICAL FIX: Ensure windowWidth/windowHeight are always defined
        // Try p1 first, fallback to p2, then reverse
        const windowWidth = p1.windowWidth || p2.windowWidth || p0.windowWidth || p3.windowWidth;
        const windowHeight = p1.windowHeight || p2.windowHeight || p0.windowHeight || p3.windowHeight;

        // 🆕 Additional validation
        if (!windowWidth || !windowHeight) {
            console.error('❌ Missing window dimensions in cursor data:', { p0, p1, p2, p3 });
        }

        // Apply Catmull-Rom spline interpolation
        try {
            const smoothed = this.getSplinePoint(p0, p1, p2, p3, t);

            // Check for NaN results
            if (isNaN(smoothed.x) || isNaN(smoothed.y)) {
                // Fallback to linear interpolation
                return {
                    x: p1.x + (p2.x - p1.x) * t,
                    y: p1.y + (p2.y - p1.y) * t,
                    vx: (p1.vx || 0) + ((p2.vx || 0) - (p1.vx || 0)) * t,
                    vy: (p1.vy || 0) + ((p2.vy || 0) - (p1.vy || 0)) * t,
                    windowWidth: windowWidth,
                    windowHeight: windowHeight,
                    isPressed: p1.isPressed || false,
                    scale: scale,
                    rotation: rotation,
                    opacity: p1.opacity !== undefined ? p1.opacity + (p2.opacity - p1.opacity) * t : 1
                };
            }

            return {
                x: smoothed.x,
                y: smoothed.y,
                vx: (p1.vx || 0) + ((p2.vx || 0) - (p1.vx || 0)) * t,
                vy: (p1.vy || 0) + ((p2.vy || 0) - (p1.vy || 0)) * t,
                windowWidth: windowWidth,
                windowHeight: windowHeight,
                isPressed: p1.isPressed || false,
                scale: scale,
                rotation: rotation
            };
        } catch (e) {
            console.warn("Spline calculation failed, falling back to linear:", e);
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t,
                windowWidth: windowWidth,
                windowHeight: windowHeight,
                isPressed: p1.isPressed || false,
                scale: scale,
                rotation: rotation
            };
        }
    }

    // Remove blue overlay from the current canvas context
    removeBlueOverlay(ctx, width, height) {
        const frameData = ctx.getImageData(0, 0, width, height);
        const data = frameData.data;
        const len = data.length;

        // Blue overlay color approx: R:59, G:130, B:246
        // We look for pixels close to this
        for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Simple distance check
            if (b > 200 && r < 100 && g > 100 && g < 180) {
                // Make it transparent for now
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(frameData, 0, 0);
    }

    drawStyledCursorShape(ctx, cursorStyle, size) {
        switch (cursorStyle) {
            case 'minimal_dot': {
                // Sleek, modern dot with subtle drop shadow and semi-transparent ring
                const centerX = size * 0.2;
                const centerY = size * 0.2;
                const outerRadius = Math.max(6, size * 0.18);
                const innerRadius = outerRadius * 0.4;

                // Outer semi-transparent ring
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, outerRadius + 2, 0, Math.PI * 2);
                ctx.fill();

                // Dark outline
                ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
                ctx.fill();

                // Inner bright dot
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
                ctx.fill();
                break;
            }

            case 'soft_glow': {
                // Ethereal macOS-like neon glow cursor
                const centerX = size * 0.2;
                const centerY = size * 0.2;
                const glowRadius = Math.max(10, size * 0.3);
                const coreRadius = Math.max(4, size * 0.1);

                // Multi-layered radial gradient for deep glow
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.2, 'rgba(167, 139, 250, 0.9)'); // Purple/Indigo tint
                gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.5)'); // Indigo
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                // Solid white core
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
                ctx.fill();
                break;
            }

            case 'high_contrast': {
                // Vibrant, playful, highly visible arrow cursor
                const width = size * 0.85;
                const height = size * 1.05;

                ctx.save();
                // Add a subtle rotation to make it look dynamic
                ctx.translate(size * 0.1, size * 0.1);
                ctx.rotate(-5 * Math.PI / 180);

                // Neon yellow/green fill
                ctx.fillStyle = '#ccff00';

                // Bold thick black stroke
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(3, size * 0.12);
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(width * 0.45, height * 0.85);
                ctx.lineTo(width * 0.52, height * 0.55);
                ctx.lineTo(width * 0.85, height * 0.65);
                ctx.lineTo(width * 0.95, height * 0.45);
                ctx.lineTo(width * 0.6, height * 0.35);
                ctx.lineTo(width * 0.85, height * 0.15);
                ctx.closePath();

                ctx.fill();
                ctx.stroke();

                // Inner white accent line for 3D effect
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = Math.max(1, size * 0.04);
                ctx.beginPath();
                ctx.moveTo(size * 0.05, size * 0.05);
                ctx.lineTo(width * 0.42, height * 0.8);
                ctx.stroke();

                ctx.restore();
                break;
            }

            default:
                // Fallback elegant circle
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(size * 0.2, size * 0.2, Math.max(6, size * 0.15), 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
        }
    }

    drawCursorAt(ctx, x, y, size = 24, scale = 1, rotation = 0, vx = 0, vy = 0, opacity = 1, cursorStyle = 'classic') {
        if (!ctx) return;

        const style = cursorStyle || 'classic';
        const isClassic = style === 'classic';
        if (isClassic && !this.cursorImage) return;

        // Calculate size for classic image cursor
        const aspectRatio = (isClassic && this.cursorImage) ? (this.cursorImage.width / this.cursorImage.height) : 1;
        const width = size;
        const height = isClassic ? (size / aspectRatio) : size;
        const yOffset = 0;

        const drawCursorGlyph = () => {
            if (isClassic) {
                ctx.drawImage(this.cursorImage, 0, yOffset, width, height);
            } else {
                this.drawStyledCursorShape(ctx, style, size);
            }
        };

        // Motion trail intentionally disabled to avoid cursor ghosting.

        ctx.save();
        ctx.translate(x, y);
        if (rotation !== 0) ctx.rotate(rotation * Math.PI / 180);
        if (scale !== 1) ctx.scale(scale, scale);

        const baseShadowBlur = 20;
        const baseShadowOffsetY = 6;
        const baseShadowOffsetX = 1;
        const baseShadowOpacity = 0.45;
        const shadowScale = Math.max(0.6, scale);

        ctx.shadowColor = `rgba(0, 0, 0, ${baseShadowOpacity * 0.8 * opacity})`;
        ctx.shadowBlur = baseShadowBlur * shadowScale;
        ctx.shadowOffsetX = baseShadowOffsetX * shadowScale;
        ctx.shadowOffsetY = baseShadowOffsetY * shadowScale;
        ctx.globalAlpha = opacity;
        drawCursorGlyph();

        ctx.shadowColor = `rgba(0, 0, 0, ${baseShadowOpacity * 1.2 * opacity})`;
        ctx.shadowBlur = (baseShadowBlur * 0.4) * shadowScale;
        ctx.shadowOffsetX = (baseShadowOffsetX * 0.5) * shadowScale;
        ctx.shadowOffsetY = (baseShadowOffsetY * 0.5) * shadowScale;
        drawCursorGlyph();

        ctx.restore();
    }

    async processVideo(videoBlob, cursorData, options = {}) {
        const {
            cursorSize = 1.0,
            removeOverlay = true,
            smoothing = 0,
            cursorStyle = 'classic'
        } = options;

        // Load cursor image if not loaded
        if (!this.cursorImage) {
            const cursorPath = typeof chrome !== 'undefined' && chrome.runtime?.getURL
                ? chrome.runtime.getURL('assets/cursor.png')
                : '../../assets/cursor.png';
            await this.loadCursorImage(cursorPath);
        }

        // Create video element to play source
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoBlob);
        video.muted = true;
        await new Promise(r => video.onloadedmetadata = r);

        // Setup canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Setup MediaRecorder for output
        const stream = this.canvas.captureStream(30); // 30 FPS output
        // Pass audio track if exists
        // Note: captureStream() might not capture audio from the video element automatically in all browsers
        // We might need to extract audio track from source video and add to stream

        // For now, let's focus on video track. Audio handling might need AudioContext.

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                URL.revokeObjectURL(video.src);
                resolve(blob);
            };

            mediaRecorder.start();

            // Processing loop
            video.play();

            const processFrame = () => {
                if (video.paused || video.ended) {
                    mediaRecorder.stop();
                    return;
                }

                // Draw video frame
                this.ctx.drawImage(video, 0, 0);

                // 1. Remove Blue Overlay
                if (removeOverlay) {
                    this.removeBlueOverlay(this.ctx, this.canvas.width, this.canvas.height);
                }

                // 2. Draw High-Res Cursor
                const currentTime = video.currentTime * 1000; // ms
                const cursorState = this.getCursorAtTime(cursorData, currentTime);

                if (cursorState) {
                    const size = 24 * cursorSize;
                    this.drawCursorAt(this.ctx, cursorState.x, cursorState.y, size, cursorState.scale, cursorState.rotation, cursorState.vx, cursorState.vy, cursorState.opacity, cursorStyle);
                }

                requestAnimationFrame(processFrame);
            };

            processFrame();
        });
    }
}
