import React, { useEffect, useRef } from 'react';

type PreviewPaneProps = {
  url: string;
  title?: string;
};

export default function PreviewPane({ url, title = 'Live Preview' }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Adjust iframe height to viewport
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${window.innerHeight - 120}px`;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="preview-pane">
      <h2 className="preview-title text-xl font-semibold mb-2">{title}</h2>
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className="preview-iframe border-4 rounded-lg shadow-lg"
        sandbox="allow-scripts allow-same-origin"
      />
    </section>
  );
}
