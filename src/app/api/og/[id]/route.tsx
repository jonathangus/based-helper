import { ImageResponse } from 'next/og';
import { kv } from '@vercel/kv';
import { Action } from '@/types';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// export const contentType = 'image/png';
export const alt = 'About Acme';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  try {
    const fontPath = join(process.cwd(), 'assets/GeistMono-Regular.ttf');
    console.log('Font path:', fontPath);

    const geistMono = await readFile(fontPath);
    console.log('Font data loaded:', geistMono ? 'Success' : 'Failed');

    const resolvedParams = await params;
    const id = resolvedParams.id as unknown as string;

    const data = (await kv.get(id)) as string;

    if (!data) {
      console.error('Data not found for ID:', id);
      return new Response('Not Found', { status: 404 });
    }

    let action: Action;
    try {
      action =
        typeof data === 'string'
          ? JSON.parse(
              data.replace('```', '').replace('json', '').replace('```', '')
            )
          : data;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return new Response('Invalid data format', { status: 400 });
    }

    if (!action) {
      console.error('Action object is null or undefined');
      return new Response('Invalid action data', { status: 400 });
    }

    console.log('gestInom', geistMono);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'black',
            width: '1200px',
            height: '630px',
            padding: '48px',
            fontFamily: 'Geist_Mono',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                display: 'flex',
              }}
            >
              {action.summary}
            </div>
          </div>

          {/* Token Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            {action.order.map((token, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#111111',
                  padding: '24px',
                  borderRadius: '16px',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: 28,
                      fontWeight: 'bold',
                      display: 'flex',
                    }}
                  >
                    ${token.symbol}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 24,
                      display: 'flex',
                    }}
                  >
                    {(Number(token.percentage) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0 24px',
            }}
          >
            <div
              style={{
                color: '#888888',
                fontSize: 24,
                display: 'flex',
              }}
            >
              Risk Level: {action.risk}
            </div>
            <div
              style={{
                color: '#888888',
                fontSize: 24,
                display: 'flex',
              }}
            >
              @based_helper
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // fonts: [
        //   {
        //     name: 'Geist_Mono',
        //     data: geistMono,
        //     style: 'normal',
        //     weight: 400,
        //   },
        // ],
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response(
      `Failed to generate image: ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
