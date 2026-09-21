import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UK AI Economic Measurement Lab | Measuring AI in the UK Economy';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0b1329',
          padding: '70px 80px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Top Header Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                color: '#94a3b8',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              UK National Accounts • Statistical Research Prototype
            </span>
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              border: '1px solid #1e293b',
              padding: '6px 14px',
              borderRadius: '4px'
            }}
          >
            Independent Research
          </div>
        </div>

        {/* Center Title & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1
            style={{
              fontSize: '54px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.025em'
            }}
          >
            UK AI Economic <br />
            Measurement Lab
          </h1>
          <p
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              maxWidth: '920px',
              lineHeight: 1.45,
              margin: 0
            }}
          >
            Measuring Artificial Intelligence in the UK Economy through Supply & Use Tables, SNA 2008 Asset Boundaries, and Disaggregation Methods.
          </p>
        </div>

        {/* Bottom Author & Metadata */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b',
            paddingTop: '28px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Author & Principal Lead
            </span>
            <span style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>
              Daramola Omoyele
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '15px', fontFamily: 'monospace' }}>
              ai-measurement.jomovate.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
