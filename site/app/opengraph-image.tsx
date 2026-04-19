import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'SonicSaaS — Modern SonicWall Fleet Management';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#09090b',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
              stroke="#F57C14"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: '40px', fontWeight: 600, color: '#fafafa' }}>SonicSaaS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '20px',
              color: '#F57C14',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Early Access
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: '76px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              maxWidth: '1000px',
            }}
          >
            <span>Manage every SonicWall firewall&nbsp;</span>
            <span style={{ color: '#F57C14' }}>in one place</span>
          </div>
          <div style={{ fontSize: '28px', color: '#a1a1aa', maxWidth: '900px', marginTop: '8px' }}>
            Fleet dashboard, security audits, and audit trails — built for MSPs.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            color: '#71717a',
          }}
        >
          <span>sonicsaas.com</span>
          <span>SonicWall fleet management for MSPs</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
