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

// Function to encode URL parameters
function encodeParam(value) {
    if (!value || value.trim() === '') return null;
    return encodeURIComponent(value.trim());
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

    // Display the URL
    urlDisplay.textContent = finalUrl;
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
    const url = urlDisplay.textContent;
    
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

