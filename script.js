// Get all input elements
const baseUrlInput = document.getElementById('baseUrl');
const utmSourceInput = document.getElementById('utm_source');
const utmMediumInput = document.getElementById('utm_medium');
const utmCampaignInput = document.getElementById('utm_campaign');
const utmIdInput = document.getElementById('utm_id');
const utmTermInput = document.getElementById('utm_term');
const utmContentInput = document.getElementById('utm_content');
const utmSourcePlatformInput = document.getElementById('utm_source_platform');
const utmCreativeFormatInput = document.getElementById('utm_creative_format');
const utmMarketingTacticInput = document.getElementById('utm_marketing_tactic');
const includeEmailCheckbox = document.getElementById('includeEmail');
const includeFirstNameCheckbox = document.getElementById('includeFirstName');

const urlDisplay = document.getElementById('urlDisplay');
const urlBreakdown = document.getElementById('urlBreakdown');
const copyBtn = document.getElementById('copyBtn');

// All input elements that should trigger URL update
const allInputs = [
    baseUrlInput,
    utmSourceInput,
    utmMediumInput,
    utmCampaignInput,
    utmIdInput,
    utmTermInput,
    utmContentInput,
    utmSourcePlatformInput,
    utmCreativeFormatInput,
    utmMarketingTacticInput
];

// Add event listeners to all inputs
allInputs.forEach(input => {
    input.addEventListener('input', generateUrl);
});

includeEmailCheckbox.addEventListener('change', generateUrl);
includeFirstNameCheckbox.addEventListener('change', generateUrl);

copyBtn.addEventListener('click', copyToClipboard);

// Color mapping for UTM parameters
const paramColors = {
    'utm_source': '#6366f1',           // Indigo
    'utm_medium': '#8b5cf6',           // Purple
    'utm_campaign': '#ec4899',         // Pink
    'utm_id': '#f59e0b',                // Amber
    'utm_term': '#10b981',             // Green
    'utm_content': '#3b82f6',          // Blue
    'utm_source_platform': '#ef4444',   // Red
    'utm_creative_format': '#06b6d4',  // Cyan
    'utm_marketing_tactic': '#f97316',  // Orange
    'email': '#14b8a6',                 // Teal
    'firstName': '#a855f7'              // Violet
};

// Function to encode URL parameters
function encodeParam(value) {
    if (!value || value.trim() === '') return null;
    return encodeURIComponent(value.trim());
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to highlight URL parameters with colors
function highlightUrlParams(url) {
    try {
        const urlObj = new URL(url);
        const baseUrl = urlObj.origin + urlObj.pathname;
        const hash = urlObj.hash;
        const params = urlObj.searchParams;
        
        let highlightedUrl = `<span class="url-base">${escapeHtml(baseUrl)}</span>`;
        
        if (params.toString()) {
            highlightedUrl += '<span class="url-separator">?</span>';
            
            let firstParam = true;
            params.forEach((value, key) => {
                const color = paramColors[key] || '#64748b';
                const separator = firstParam ? '' : '<span class="url-ampersand">&</span>';
                const paramName = escapeHtml(key);
                const paramValue = escapeHtml(decodeURIComponent(value));
                // Convert hex color to rgba for background
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const bgColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
                // Color the entire parameter including the equals sign
                highlightedUrl += `${separator}<span class="url-param" style="background: ${bgColor}; border-left: 3px solid ${color}; color: ${color};"><span class="url-param-name" style="color: ${color}; font-weight: 700;">${paramName}</span><span style="color: ${color}; opacity: 0.8;">=</span><span class="url-param-value" style="color: ${color}; opacity: 0.9;">${paramValue}</span></span>`;
                firstParam = false;
            });
        }
        
        if (hash) {
            highlightedUrl += `<span class="url-hash">${escapeHtml(hash)}</span>`;
        }
        
        return highlightedUrl;
    } catch (e) {
        return escapeHtml(url);
    }
}

// Function to generate the UTM URL
function generateUrl() {
    const baseUrl = baseUrlInput.value.trim();
    
    // Check if base URL is provided
    if (!baseUrl) {
        urlDisplay.innerHTML = '<span class="placeholder">Enter a base URL to generate tracking link...</span>';
        urlBreakdown.innerHTML = '';
        copyBtn.disabled = true;
        return;
    }

    // Validate base URL
    try {
        new URL(baseUrl);
    } catch (e) {
        urlDisplay.innerHTML = '<span class="placeholder" style="color: #ef4444;">Please enter a valid URL...</span>';
        urlBreakdown.innerHTML = '';
        copyBtn.disabled = true;
        return;
    }

    // Collect UTM parameters
    const params = new URLSearchParams();
    const breakdown = [];

    // Required parameters
    const utmSource = encodeParam(utmSourceInput.value);
    const utmMedium = encodeParam(utmMediumInput.value);
    const utmCampaign = encodeParam(utmCampaignInput.value);

    if (utmSource) {
        params.append('utm_source', utmSource);
        breakdown.push({ name: 'utm_source', value: utmSource });
    }
    if (utmMedium) {
        params.append('utm_medium', utmMedium);
        breakdown.push({ name: 'utm_medium', value: utmMedium });
    }
    if (utmCampaign) {
        params.append('utm_campaign', utmCampaign);
        breakdown.push({ name: 'utm_campaign', value: utmCampaign });
    }

    // Optional UTM parameters
    const optionalParams = [
        { input: utmIdInput, key: 'utm_id' },
        { input: utmTermInput, key: 'utm_term' },
        { input: utmContentInput, key: 'utm_content' },
        { input: utmSourcePlatformInput, key: 'utm_source_platform' },
        { input: utmCreativeFormatInput, key: 'utm_creative_format' },
        { input: utmMarketingTacticInput, key: 'utm_marketing_tactic' }
    ];

    optionalParams.forEach(({ input, key }) => {
        const value = encodeParam(input.value);
        if (value) {
            params.append(key, value);
            breakdown.push({ name: key, value: value });
        }
    });

    // Optional template variables
    if (includeEmailCheckbox.checked) {
        params.append('email', '{{email}}');
        breakdown.push({ name: 'email', value: '{{email}}' });
    }

    if (includeFirstNameCheckbox.checked) {
        params.append('firstName', '{{firstName}}');
        breakdown.push({ name: 'firstName', value: '{{firstName}}' });
    }

    // Build the final URL
    const separator = baseUrl.includes('?') ? '&' : '?';
    const finalUrl = baseUrl + separator + params.toString();

    // Display the URL with color highlighting
    urlDisplay.innerHTML = highlightUrlParams(finalUrl);
    urlDisplay.classList.remove('placeholder');

    // Display breakdown
    if (breakdown.length > 0) {
        let breakdownHTML = '<h3>Parameters:</h3><ul>';
        breakdown.forEach(param => {
            breakdownHTML += `
                <li>
                    <span class="param-name">${param.name}:</span>
                    <span class="param-value">${decodeURIComponent(param.value)}</span>
                </li>
            `;
        });
        breakdownHTML += '</ul>';
        urlBreakdown.innerHTML = breakdownHTML;
    } else {
        urlBreakdown.innerHTML = '';
    }

    // Enable copy button
    copyBtn.disabled = false;
}

// Function to copy URL to clipboard
async function copyToClipboard() {
    // Get plain text URL (without HTML formatting)
    const url = urlDisplay.textContent || urlDisplay.innerText;
    
    try {
        await navigator.clipboard.writeText(url);
        
        // Visual feedback
        const originalText = copyBtn.querySelector('.copy-text').textContent;
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            alert('Failed to copy URL. Please copy manually.');
        }
        
        document.body.removeChild(textArea);
    }
}

// Initialize on page load
generateUrl();

