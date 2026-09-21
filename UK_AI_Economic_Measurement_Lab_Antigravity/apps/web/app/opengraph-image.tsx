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
          backgroundColor: '#0f172a',
          padding: '60px 80px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                marginRight: '12px'
              }}
            />
            <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em' }}>
              RESEARCH PROTOTYPE • NATIONAL ACCOUNTS
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 700
            }}
          >
            INDEPENDENT RESEARCH
          </div>
        </div>

        {/* Main Center Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            UK AI Economic <br />
            <span style={{ color: '#38bdf8' }}>Measurement Lab</span>
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#cbd5e1',
              maxWidth: '900px',
              lineHeight: 1.4,
              margin: 0
            }}
          >
            Measuring Artificial Intelligence in the UK Economy through Supply & Use Tables, SNA 2008 Asset Boundaries & Disaggregation Methods.
          </p>
        </div>

        {/* Bottom Metadata & Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #334155',
            paddingTop: '30px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Principal Author & Lead
            </span>
            <span style={{ color: '#f8fafc', fontSize: '22px', fontWeight: 700 }}>
              Daramola Omoyele
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '16px',
                border: '1px solid #334155'
              }}
            >
              Supply & Use
            </div>
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '16px',
                border: '1px solid #334155'
              }}
            >
              Disaggregation
            </div>
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '16px',
                border: '1px solid #334155'
              }}
            >
              SNA 2008 Engine
            </div>
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '16px',
                border: '1px solid #334155'
              }}
            >
              ML Classification
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
