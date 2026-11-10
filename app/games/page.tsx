import Link from "next/link";

export const metadata = {
	title: "GRZ Arcade | GRZ News",
	description:
		"Play Dusty Torque and discover games at GRZ Arcade.",
};

export default function GamesPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#101827",
				color: "#fff",
				padding: "48px 20px",
			}}
		>
			<div style={{ maxWidth: 1100, margin: "0 auto" }}>
				<Link
					href="/"
					style={{ color: "#f59e0b", textDecoration: "none" }}
				>
					← Back to GRZ News
				</Link>

				<header style={{ margin: "42px 0" }}>
					<p style={{ color: "#fb923c", fontWeight: 700 }}>
						GRZ NEWS PRESENTS
					</p>
					<h1 style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
						🎮 GRZ Arcade
					</h1>
					<p style={{ color: "#cbd5e1", fontSize: 18 }}>
						Take a break from the headlines. Play something fun.
					</p>
				</header>

				<section
					style={{
						background: "#1e293b",
						border: "1px solid #475569",
						borderRadius: 20,
						padding: 28,
						maxWidth: 650,
					}}
				>
					<div
						style={{
							height: 220,
							background:
								"linear-gradient(135deg, #7c2d12, #ea580c, #fbbf24)",
							borderRadius: 14,
							display: "grid",
							placeItems: "center",
							fontSize: 72,
						}}
					>
						🛻
					</div>

					<h2 style={{ fontSize: 30, marginTop: 24 }}>
						Dusty Torque
					</h2>

					<p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
						Race across wild hills, master your landings,
						collect fuel, unlock vehicles, and upgrade
						your garage. How far can you drive?
					</p>

					<Link
						href="/games/dusty-torque"
						style={{
							display: "inline-block",
							background: "#ea580c",
							color: "#fff",
							padding: "14px 28px",
							borderRadius: 10,
							fontWeight: 700,
							textDecoration: "none",
							marginTop: 16,
						}}
					>
						▶ Play Dusty Torque
					</Link>
				</section>

				<p style={{ color: "#94a3b8", marginTop: 36 }}>
					More GRZ Arcade games coming soon.
				</p>
			</div>
		</main>
	);
}
