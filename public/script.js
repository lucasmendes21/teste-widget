(function() {
  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:5173';
  iframe.width = '100%';
  iframe.height = '400';

  document.getElementById('render-chart').appendChild(iframe)
})();
