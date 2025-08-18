// To disable ads across the entire site, change this value to false.
const ADS_ENABLED = true;

function injectAdUnit(container) {
    // This function creates and injects the ad unit into the given container.
    container.innerHTML = ''; // Clear any existing content.

    const insElement = document.createElement('ins');
    insElement.className = 'adsbygoogle';
    insElement.style.display = 'block';
    insElement.dataset.adClient = 'ca-pub-1959532382727156';
    insElement.dataset.adSlot = '9444730198';
    insElement.dataset.adFormat = 'auto';
    insElement.dataset.fullWidthResponsive = 'true';

    container.appendChild(insElement);

    // Push an ad request for this unit.
    (window.adsbygoogle = window.adsbygoogle || []).push({});
}

document.addEventListener('DOMContentLoaded', () => {
    if (ADS_ENABLED) {
        document.body.classList.add('ads-active');

        // Load the main AdSense script. It only needs to be on the page once.
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1959532382727156";
        adScript.crossOrigin = "anonymous";
        document.head.appendChild(adScript);

        // Find all ad containers and inject an ad unit into each one.
        const adContainers = document.querySelectorAll('.ad-container');
        adContainers.forEach(injectAdUnit);
    }
    // If ADS_ENABLED is false, or if this script doesn't load,
    // the .ads-active class is not added, so ad containers remain hidden by default CSS.
});
