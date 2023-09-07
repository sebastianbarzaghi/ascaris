const DownloadModule = (function () {
    
    function downloadXmlTei() {
        const downloadLink = document.querySelector('#xml-tei-download');
        const editableContent = document.querySelector('#editableContent');
        const documentId = editableContent.getAttribute('data-documentId');
        downloadLink.href = `/download_tei/${documentId}`;
    }

    downloadXmlTei();

})();

export { DownloadModule };