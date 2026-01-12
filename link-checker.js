// ============================================
// LINK SAFETY CHECKER
// ============================================

const SUSPICIOUS_PATTERNS = [
    '.exe.zip', '.scr', '.bat', '.cmd', '.vbs', '.js.zip',
    'bit.ly', 'tinyurl.com', 'goo.gl', // Shortened URLs
    'discord.gg/free', 'telegram.me/free',
    'double-download', 'mega-free', 'crack', 'keygen'
];

const TRUSTED_DOMAINS = [
    'github.com', 'gitlab.com', 'bitbucket.org',
    'drive.google.com', 'dropbox.com', 'mega.nz',
    'mediafire.com', 'wetransfer.com', 'onedrive.live.com'
];

const SUSPICIOUS_DOMAINS = [
    'free-download.xyz', 'crackapp.com', 'keygenfor.com',
    'downloadnow.click', 'getfreeapp.net'
];

function checkLinkSafety(url) {
    const result = {
        safe: true,
        warnings: [],
        domain: '',
        trustScore: 100
    };

    try {
        const urlObj = new URL(url);
        result.domain = urlObj.hostname;

        // Check if trusted domain
        if (TRUSTED_DOMAINS.some(domain => result.domain.includes(domain))) {
            result.safe = true;
            result.trustScore = 100;
            return result;
        }

        // Check suspicious domains
        if (SUSPICIOUS_DOMAINS.some(domain => result.domain.includes(domain))) {
            result.safe = false;
            result.warnings.push('⚠️ النطاق مشبوه - قد يحتوي على ملفات ضارة');
            result.trustScore = 20;
        }

        // Check suspicious patterns
        SUSPICIOUS_PATTERNS.forEach(pattern => {
            if (url.toLowerCase().includes(pattern.toLowerCase())) {
                result.safe = false;
                result.warnings.push(`⚠️ الرابط يحتوي على نمط مشبوه: ${pattern}`);
                result.trustScore -= 20;
            }
        });

        // Check for IP addresses (suspicious)
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(result.domain)) {
            result.warnings.push('⚠️ الرابط يستخدم عنوان IP بدلاً من نطاق - قد يكون مشبوهاً');
            result.trustScore -= 30;
        }

        // Check for too many subdomains
        const subdomains = result.domain.split('.');
        if (subdomains.length > 3) {
            result.warnings.push('⚠️ النطاق يحتوي على عدد كبير من النطاقات الفرعية');
            result.trustScore -= 10;
        }

        // Check protocol
        if (urlObj.protocol !== 'https:') {
            result.warnings.push('⚠️ الرابط غير آمن (لا يستخدم HTTPS)');
            result.trustScore -= 20;
        }

        // Final safety determination
        result.trustScore = Math.max(0, result.trustScore);
        result.safe = result.trustScore >= 60;

    } catch (error) {
        result.safe = false;
        result.warnings.push('❌ رابط غير صالح');
        result.trustScore = 0;
    }

    return result;
}

function displaySafetyBadge(safetyCheck) {
    if (safetyCheck.trustScore >= 80) {
        return `<span style="color: #10b981;">✅ آمن (${safetyCheck.trustScore}%)</span>`;
    } else if (safetyCheck.trustScore >= 60) {
        return `<span style="color: #f59e0b;">⚠️ حذر (${safetyCheck.trustScore}%)</span>`;
    } else {
        return `<span style="color: #ef4444;">🚫 خطير (${safetyCheck.trustScore}%)</span>`;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkLinkSafety, displaySafetyBadge };
}
