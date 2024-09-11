import React from 'react';

export default function ApiPage() {

    return (
        <div style={{ height: 'calc(100vh - 65px)', padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Start Analysis</h1>
            <div style={{
                position: 'relative',

                backgroundColor: 'rgba(107,132,153,.1)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '16px',
                marginBottom: '10px',
            }}>
                <pre style={{ margin: 0 }}>POST /api/analyze</pre>
            </div>

            {/* Description below the code block */}
            <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '40px' }}>
                This endpoint accepts a video and selected elements for analysis. It returns a <code>video_id</code> that can be used to check the status and retrieve the results of the analysis.
            </p>

            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Check Status</h1>

            <div style={{
                position: 'relative',

                backgroundColor: 'rgba(107,132,153,.1)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '16px',
                marginBottom: '10px',
            }}>
                <pre style={{ margin: 0 }}>GET /api/status/{'{id}'}</pre>
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '40px' }}>
                This endpoint returns the status of the video processing with the specified <code>id</code>. The response includes the status and the progress of the processing.
            </p>

            {/* Example for GET /api/results */}
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Analysis Results</h1>

            <div style={{
                position: 'relative',

                backgroundColor: 'rgba(107,132,153,.1)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '16px',
                marginBottom: '10px',
            }}>
                <pre style={{ margin: 0 }}>GET /api/results/{'{id}'}</pre>
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                This endpoint returns the analysis results of the video in JSON format, including detected elements and a quality assessment of the video.
            </p>
        </div>
    );
}
