import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 12,
          background: '#090d16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontFamily: 'sans-serif',
          letterSpacing: '0.04em',
          border: '1px solid #1e293b',
          borderRadius: '4px'
        }}
      >
        <span style={{ fontSize: '10px', lineHeight: 1, color: '#f8fafc', fontWeight: 800 }}>UK</span>
        <span style={{ fontSize: '8px', lineHeight: 1, color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>LAB</span>
      </div>
    ),
    {
      ...size
    }
  );
}

