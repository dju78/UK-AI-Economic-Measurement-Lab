import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UK AI Economic Measurement Lab | National Accounts Research Prototype';
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
          backgroundColor: '#090d16',
          padding: '72px 80px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
          border: '12px solid #0f172a'
        }}
      >
        {/* Top Header Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>UK</span>
              <span style={{ color: '#94a3b8', fontSize: '8px', fontWeight: 600, lineHeight: 1, marginTop: '2px' }}>LAB</span>
            </div>
            <span
              style={{
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              National Accounts • Statistical Research
            </span>
          </div>
          <div
            style={{
              color: '#cbd5e1',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              border: '1px solid #334155',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#0f172a'
            }}
          >
            Independent Prototype
          </div>
        </div>

        {/* Center Title & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.12,
              margin: 0,
              letterSpacing: '-0.03em'
            }}
          >
            UK AI Economic <br />
            Measurement Lab
          </h1>
          <p
            style={{
              fontSize: '21px',
              color: '#94a3b8',
              maxWidth: '960px',
              lineHeight: 1.45,
              margin: 0
            }}
          >
            A methodological research prototype measuring artificial intelligence in the UK economy through Supply & Use Tables, SNA 2008 asset boundaries, and reproducible disaggregation models.
          </p>
        </div>

        {/* Bottom Author & Metadata */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b',
            paddingTop: '24px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Lead Methodologist & Author
            </span>
            <span style={{ color: '#f8fafc', fontSize: '19px', fontWeight: 700 }}>
              Daramola Omoyele
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontFamily: 'monospace' }}>
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

