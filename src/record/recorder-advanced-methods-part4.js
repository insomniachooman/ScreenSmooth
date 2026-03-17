class RecorderAdvancedMethodsPart4 {
  showPaymentReminder(contentHtml) {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('payment-reminder-overlay');
    if (existing?.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const overlay = document.createElement('div');
    overlay.id = 'payment-reminder-overlay';
    overlay.className = 'payment-reminder-overlay visible';
    overlay.innerHTML = `
      <div class="payment-reminder-overlay__card">
        <button class="payment-reminder__close" aria-label="Close reminder">&times;</button>
        <div class="payment-reminder-overlay__content"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.classList.remove('visible');
      }
    });

    const closeButton = overlay.querySelector('.payment-reminder__close');
    closeButton?.addEventListener('click', () => overlay.classList.remove('visible'));

    const contentContainer = overlay.querySelector('.payment-reminder-overlay__content');
    if (contentContainer) {
      contentContainer.innerHTML = contentHtml;
    }

    const ctaButton = overlay.querySelector('#payment-reminder-cta');
    if (ctaButton) {
      ctaButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const checkoutUrl = 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8';
        try {
          if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
            await chrome.tabs.create({ url: checkoutUrl, active: true });
          } else {
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
          }
        } catch (checkoutError) {
          ('�a�️ Unable to reopen checkout tab:', checkoutError);
          window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        }
      });
    }

    ('�x� Payment reminder overlay rendered');
  }

  showExportAdvancedPanel() {
    // Hide zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "none";
    }

    // Show export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "block";
    }

    ("Switched to Export & Advanced panel in right sidebar");
  }


  showZoomControlsPanel() {
    // Hide export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "none";
    }

    // Show zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "block";
    }

    ("Switched to Zoom Controls panel in right sidebar");
  }

  updateStatusText(message) {
    const statusEl = document.getElementById('export-status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }


  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === "error"
        ? "#FF6B6B"
        : type === "success"
          ? "#4CAF50"
          : "#2196F3"
      };
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
    notification.textContent = message;

    // Add animation styles
    if (!document.getElementById("notification-styles")) {
      const styles = document.createElement("style");
      styles.id = "notification-styles";
      styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
}

export { RecorderAdvancedMethodsPart4 };
