// app/p/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getGamePageBySlug } from "@/lib/getGamePage";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const game = await getGamePageBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #55123a, #22051a)",
          fontFamily: "sans-serif",
        }}
      >
        {game?.targetPhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.targetPhotoUrl}
            width={200}
            height={200}
            style={{ borderRadius: "50%", border: "6px solid #e8b34e", marginRight: 40 }}
          />
        )}
        <div style={{ color: "#fbeee0", fontSize: 48, fontWeight: 700 }}>
          Uma surpresa te espera 💘
        </div>
      </div>
    ),
    size
  );
}