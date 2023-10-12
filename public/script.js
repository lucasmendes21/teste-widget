(function() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://teste-widget.vercel.app/cdn';
  iframe.width = '100%';
  iframe.height = '600';

  document.getElementById('render-chart').appendChild(iframe)
})();
