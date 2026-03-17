class RecorderZoomMethodsPart5 {
  updateZoomIntensityUI() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const validIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;

    // Ensure intensity is within valid range
    const clampedIntensity = Math.max(1.25, Math.min(4, validIntensity));

    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.value = clampedIntensity;
    }
    if (this.zoomIntensityValue) {
      this.zoomIntensityValue.textContent = `${clampedIntensity.toFixed(1)}x`;
    }
  }


  updateZoomPositionUI() {
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${this.zoomPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${this.zoomPosition.y * 100}%`;
    }
  }


  needsProcessing() {
    const needsProcessing = (
      this.currentPadding > 0 ||
      this.currentBackground !== "#000000" ||
      this.currentBorderRadius > 0 ||
      this.currentBlur > 0 ||
      this.currentBrightness !== 1 ||
      this.currentContrast !== 1 ||
      this.currentSaturation !== 1 ||
      this.currentAspectRatio !== "native" ||
      this.trimStart > 0 ||
      this.trimEnd < this.videoDuration
    );

    return needsProcessing;
  }
}

export { RecorderZoomMethodsPart5 };
