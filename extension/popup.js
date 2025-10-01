function updateAndHighlight(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        const parentP = element.closest('p');
        if (parentP) {
            parentP.classList.remove('highlight-animation');
            void parentP.offsetWidth;
            parentP.classList.add('highlight-animation');
        }
    }
}

function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = (date.getTime() - now.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const units = [
        { unit: 'year', seconds: 31536000 }, { unit: 'month', seconds: 2592000 },
        { unit: 'week', seconds: 604800 }, { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 }, { unit: 'minute', seconds: 60 },
    ];
    for (const { unit, seconds } of units) {
        if (Math.abs(diffInSeconds) >= seconds) {
            return rtf.format(Math.round(diffInSeconds / seconds), unit);
        }
    }
    const value = Math.round(diffInSeconds);
    return Math.abs(value) > 0 ? rtf.format(value, 'second') : 'just now';
}

function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).textContent;
    if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalBtn = document.querySelector(`button[data-target='${elementId}']`);
            if (originalBtn) {
                if (originalBtn.textContent === 'Copied!') {
                    return;
                }
                const originalText = originalBtn.textContent;
                originalBtn.textContent = 'Copied!';
                setTimeout(() => { originalBtn.textContent = originalText; }, 1500);
            }
        });
    }
}

function getLocalIsoString(date) {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (num) => (num < 10 ? '0' : '') + num;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) +
        diff + pad(Math.floor(Math.abs(tzOffset) / 60)) + ':' + pad(Math.abs(tzOffset) % 60);
}

function convertHumanDate() {
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);
    const hour = parseInt(document.getElementById('hour').value) || 0;
    const minute = parseInt(document.getElementById('minute').value) || 0;
    const second = parseInt(document.getElementById('second').value) || 0;
    if (!year || !month || !day) return;

    const isLocal = document.getElementById('tz_local').checked;
    const dateInMs = isLocal ? new Date(year, month - 1, day, hour, minute, second).getTime() : Date.UTC(year, month - 1, day, hour, minute, second);

    const isValid = !isNaN(dateInMs);
    updateAndHighlight('ms', isValid ? BigInt(dateInMs).toString() : 'Invalid Date');
    updateAndHighlight('us', isValid ? (BigInt(dateInMs) * 1000n).toString() : 'Invalid Date');
    updateAndHighlight('ns', isValid ? (BigInt(dateInMs) * 1000000n).toString() : 'Invalid Date');

    const date = new Date(dateInMs);
    updateAndHighlight('hd_iso_utc', isValid ? date.toISOString() : 'Invalid Date');
    updateAndHighlight('hd_iso_local', isValid ? getLocalIsoString(date) : 'Invalid Date');
}

function convertTimestamp() {
    const timestampStr = document.getElementById('timestamp').value.trim();
    if (!timestampStr || !/^\d+$/.test(timestampStr)) return;

    const timestamp = BigInt(timestampStr);
    let dateInMs;
    if (timestampStr.length > 16) { dateInMs = Number(timestamp / 1000000n); }
    else if (timestampStr.length > 13) { dateInMs = Number(timestamp / 1000n); }
    else if (timestampStr.length > 10) { dateInMs = Number(timestamp); }
    else { dateInMs = Number(timestamp * 1000n); }

    const date = new Date(dateInMs);
    const isValid = !isNaN(date.getTime());
    updateAndHighlight('gmt_time', isValid ? date.toUTCString() : 'Invalid Timestamp');
    updateAndHighlight('local_time', isValid ? date.toString() : 'Invalid Timestamp');
    updateAndHighlight('relative_time', isValid ? getRelativeTime(date) : '');
    updateAndHighlight('ts_iso_utc', isValid ? date.toISOString() : 'Invalid Timestamp');
    updateAndHighlight('ts_iso_local', isValid ? getLocalIsoString(date) : 'Invalid Timestamp');
}

function convertFromIsoString() {
    const isoString = document.getElementById('iso_string').value.trim();
    if (!isoString) return;

    const date = new Date(isoString);
    const dateInMs = date.getTime();
    const isValid = !isNaN(dateInMs);

    updateAndHighlight('iso_ms', isValid ? BigInt(dateInMs).toString() : 'Invalid Date String');
    updateAndHighlight('iso_us', isValid ? (BigInt(dateInMs) * 1000n).toString() : 'Invalid Date String');
    updateAndHighlight('iso_ns', isValid ? (BigInt(dateInMs) * 1000000n).toString() : 'Invalid Date String');
    updateAndHighlight('iso_gmt_time', isValid ? date.toUTCString() : 'Invalid Date String');
    updateAndHighlight('iso_local_time', isValid ? date.toString() : 'Invalid Date String');
    updateAndHighlight('iso_relative_time', isValid ? getRelativeTime(date) : '');
}

function convertDuration() {
    const days = parseFloat(document.getElementById('days_input').value);
    const isValid = !isNaN(days) && days >= 0;
    updateAndHighlight('duration_hours', isValid ? (days * 24).toLocaleString() : 'Invalid input');
    updateAndHighlight('duration_minutes', isValid ? (days * 24 * 60).toLocaleString() : 'Invalid input');
    updateAndHighlight('duration_seconds', isValid ? (days * 24 * 60 * 60).toLocaleString() : 'Invalid input');
}

document.addEventListener('DOMContentLoaded', () => {
    // Human Date Converter
    const hdInputs = ['year', 'month', 'day', 'hour', 'minute', 'second', 'tz_gmt', 'tz_local'];
    hdInputs.forEach(id => document.getElementById(id).addEventListener('input', convertHumanDate));

    // Timestamp Converter
    document.getElementById('timestamp').addEventListener('input', convertTimestamp);

    // ISO Converter
    document.getElementById('iso_string').addEventListener('input', convertFromIsoString);

    // Duration Converter
    document.getElementById('days_input').addEventListener('input', convertDuration);

    // Copy Buttons
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => copyToClipboard(button.dataset.target));
    });

    // Prefill date/time
    const now = new Date();
    document.getElementById('year').value = now.getFullYear();
    document.getElementById('month').value = now.getMonth() + 1;
    document.getElementById('day').value = now.getDate();
    document.getElementById('hour').value = now.getHours();
    document.getElementById('minute').value = now.getMinutes();
    document.getElementById('second').value = now.getSeconds();
    convertHumanDate();
});
