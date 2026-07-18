import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ---------- Supabase ---------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/* ---------- Data ---------- */

const PRODUCTS = [
  {
    id: "wildfire",
    name: "WILDFIRE",
    family: "Gỗ cay lửa",
    story: "Bùng lên như tia lửa đầu tiên trong đêm hội.",
    from: "#FFAE8C",
    to: "#FF5B3D",
    dark: "#B33017",
    price: 1690000,
    notes: {
      top: ["Ớt hồng", "Cam Ý"],
      heart: ["Hoắc hương", "Nhài đen"],
      base: ["Tuyết tùng", "Xạ hương ấm"],
    },
  },
  {
    id: "neon-riot",
    name: "NEON RIOT",
    family: "Xanh cỏ điện",
    story: "Cú sốc mát lạnh giữa đám đông rực rỡ.",
    from: "#DBF8A6",
    to: "#A9E22F",
    dark: "#5C7E12",
    price: 1450000,
    notes: {
      top: ["Bạc hà", "Lá me chua"],
      heart: ["Violet xanh", "Trà xanh"],
      base: ["Vetiver", "Xạ hương trắng"],
    },
  },
  {
    id: "velvet-venom",
    name: "VELVET VENOM",
    family: "Hoa độc quyến rũ",
    story: "Ngọt ngào có chủ đích, nguy hiểm có tính toán.",
    from: "#FFB4D6",
    to: "#E63888",
    dark: "#951C58",
    price: 1890000,
    notes: {
      top: ["Lý gai", "Hồng tiêu"],
      heart: ["Mẫu đơn đen", "Hoa nhài"],
      base: ["Da thuộc", "Hổ phách"],
    },
  },
  {
    id: "midnight-cobalt",
    name: "MIDNIGHT COBALT",
    family: "Gỗ biển đêm",
    story: "Bến cảng lúc 2 giờ sáng, gió lạnh và im lặng.",
    from: "#9FB2FF",
    to: "#2A3FD6",
    dark: "#141F7A",
    price: 1790000,
    notes: {
      top: ["Bưởi lạnh", "Gừng"],
      heart: ["Oải hương biển", "Hương thảo"],
      base: ["Ambroxan", "Xạ hương xanh"],
    },
  },
  {
    id: "solar-rage",
    name: "SOLAR RAGE",
    family: "Hổ phách rực lửa",
    story: "Nắng gắt cuối hè, không chịu tắt.",
    from: "#FFE29B",
    to: "#FFB020",
    dark: "#B3760A",
    price: 1990000,
    notes: {
      top: ["Bergamot", "Nghệ tây"],
      heart: ["Hoa cam", "Quế"],
      base: ["Hổ phách", "Vani khói"],
    },
  },
  {
    id: "acid-bloom",
    name: "ACID BLOOM",
    family: "Hoa nổi loạn",
    story: "Một bó hoa ném thẳng vào quy tắc.",
    from: "#D7C0FF",
    to: "#7A3EFF",
    dark: "#3F1C99",
    price: 1590000,
    notes: {
      top: ["Chanh dây", "Hồng tiêu"],
      heart: ["Diên vĩ", "Hồng đen"],
      base: ["Musk trắng", "Đàn hương"],
    },
  },
];

const SIZES = [
  { ml: 30, mult: 0.68 },
  { ml: 50, mult: 1 },
  { ml: 100, mult: 1.62 },
];

const money = (n) => Math.round(n).toLocaleString("vi-VN") + "\u20ab";
const priceFor = (product, ml) => {
  const s = SIZES.find((s) => s.ml === ml);
  return Math.round((product.price * s.mult) / 1000) * 1000;
};

/* ---------- Visual bits ---------- */

function Bottle({ product, size = 100, tilt = 14, mono }) {
  const gid = `grad-${product.id}-${size}-${mono ? "m" : "c"}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${tilt}deg)` }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? "#ffffff" : product.from} />
          <stop offset="100%" stopColor={mono ? "#ffffff" : product.to} />
        </linearGradient>
      </defs>
      <g>
        <rect x="33" y="4" width="22" height="13" rx="6" fill={mono ? "var(--cream)" : product.dark} opacity="0.9" />
        <rect x="38" y="15" width="12" height="9" rx="3" fill={mono ? "var(--cream)" : product.dark} opacity="0.7" />
        <rect x="20" y="22" width="48" height="64" rx="20" fill={`url(#${gid})`} />
        <ellipse cx="34" cy="34" rx="7" ry="12" fill="#fff" opacity="0.35" />
        <rect x="32" y="44" width="24" height="24" rx="9" fill={mono ? product.to : "#fff"} opacity={mono ? 1 : 0.85} />
      </g>
    </svg>
  );
}

function Pyramid({ notes, product, ink = false }) {
  const rows = [
    { label: "Hương đầu", items: notes.top, w: 38 },
    { label: "Hương giữa", items: notes.heart, w: 66 },
    { label: "Hương cuối", items: notes.base, w: 100 },
  ];
  return (
    <div className="pyramid">
      {rows.map((r) => (
        <div className="pyramid-row" key={r.label}>
          <div className="pyramid-bar-wrap">
            <div
              className="pyramid-bar"
              style={{
                width: `${r.w}%`,
                background: ink ? `linear-gradient(90deg, ${product.from}, ${product.to})` : "rgba(255,255,255,0.85)",
              }}
            />
          </div>
          <div className="pyramid-text">
            <span className="pyramid-label" style={{ color: ink ? product.dark : "#fff" }}>{r.label}</span>
            <span className="pyramid-items" style={{ color: ink ? "var(--ink)" : "#fff" }}>{r.items.join(" · ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Main App ---------- */

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedMl, setSelectedMl] = useState(50);
  const [step, setStep] = useState("shop");
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cod" });
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const productById = (id) => PRODUCTS.find((p) => p.id === id);

  const addToCart = (product, ml) => {
    const key = `${product.id}-${ml}`;
    setCart((c) => {
      const idx = c.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...c];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...c, { key, productId: product.id, ml, qty: 1 }];
    });
    setCartOpen(true);
    setSelected(null);
  };

  const changeQty = (key, delta) => {
    setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + priceFor(productById(i.productId), i.ml) * i.qty, 0),
    [cart]
  );
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setOrderError("");
    const code = "FX" + Math.floor(100000 + Math.random() * 900000);

    if (supabase) {
      setSubmitting(true);
      const { error } = await supabase.from("orders").insert({
        order_code: code,
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        payment_method: form.payment,
        items: cart.map((i) => {
          const p = productById(i.productId);
          return { name: p.name, ml: i.ml, qty: i.qty, price: priceFor(p, i.ml) };
        }),
        subtotal,
      });
      setSubmitting(false);
      if (error) {
        setOrderError("Không gửi được đơn hàng, vui lòng thử lại.");
        return;
      }
    }

    setOrderId(code);
    setStep("done");
    setCart([]);
  };

  return (
    <div className="fx-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

        .fx-wrap {
          --ink:#2B2140; --cream:#FFFBF5; --cream-soft:#F3EBFF;
          --coral:#FF5B3D; --lime:#A9E22F; --magenta:#E63888;
          --cobalt:#2A3FD6; --amber:#FFB020; --violet:#7A3EFF;
          --r-lg: 28px; --r-md: 20px; --r-sm: 14px; --r-pill: 999px;
          font-family:'Nunito',sans-serif; background:var(--cream); color:var(--ink); min-height:100vh;
        }
        .fx-wrap * { box-sizing:border-box; }
        .fx-display { font-family:'Baloo 2', sans-serif; text-transform:uppercase; letter-spacing:0.01em; }

        @keyframes floaty { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
        @keyframes floaty2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(-6deg); } }
        @keyframes wiggle { 0%,100% { transform: rotate(var(--tilt,14deg)); } 50% { transform: rotate(calc(var(--tilt,14deg) - 10deg)); } }
        @media (prefers-reduced-motion: reduce) { .fx-float, .fx-float2, .fx-card:hover .fx-bottle { animation: none !important; } }

        /* header */
        .fx-header { display:flex; align-items:center; justify-content:space-between; padding:16px 5vw;
          position:sticky; top:0; z-index:30; background:rgba(255,251,245,0.86); backdrop-filter:blur(10px); }
        .fx-logo { display:flex; align-items:center; gap:10px; }
        .fx-logo-word { font-family:'Baloo 2'; font-weight:800; font-size:26px; letter-spacing:0.01em; color:var(--ink); }
        .fx-logo-parfum { font-size:9px; letter-spacing:0.3em; font-weight:700; opacity:0.55; }
        .fx-nav { display:flex; gap:10px; font-size:13px; font-weight:700; }
        .fx-nav span { padding:8px 16px; border-radius:var(--r-pill); cursor:pointer; transition:background .2s; }
        .fx-nav span:hover { background:var(--cream-soft); }
        .fx-cart-btn { position:relative; background:linear-gradient(135deg,var(--coral),var(--magenta)); color:#fff; border:none;
          width:44px; height:44px; border-radius:var(--r-pill); cursor:pointer; display:flex; align-items:center; justify-content:center;
          box-shadow:0 6px 16px rgba(230,56,136,0.35); transition:transform .2s; }
        .fx-cart-btn:hover { transform:scale(1.08) rotate(-4deg); }
        .fx-cart-count { position:absolute; top:-6px; right:-6px; background:var(--ink); color:#fff; font-size:10px; width:19px; height:19px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid var(--cream); font-weight:800; }

        /* hero */
        .fx-hero { position:relative; padding:8vh 5vw 10vh; overflow:hidden; }
        .fx-hero-blob { position:absolute; border-radius:50%; filter:blur(2px); opacity:0.55; z-index:0; }
        .fx-hero-title { font-size:clamp(44px,9vw,120px); line-height:0.92; position:relative; z-index:2; margin:0; color:var(--ink); }
        .fx-hero-title .fx-grad { background:linear-gradient(100deg,var(--coral),var(--magenta),var(--violet)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .fx-hero-row { display:flex; justify-content:space-between; align-items:flex-end; margin-top:28px; position:relative; z-index:2; gap:24px; flex-wrap:wrap; }
        .fx-hero-sub { max-width:380px; font-size:16px; line-height:1.6; font-weight:600; color:var(--ink); opacity:0.85; }
        .fx-btn { font-family:'Nunito'; font-weight:800; font-size:14px; letter-spacing:0.01em;
          background:linear-gradient(135deg,var(--coral),var(--magenta)); color:#fff; border:none; border-radius:var(--r-pill); padding:16px 30px; cursor:pointer;
          display:inline-flex; align-items:center; gap:10px; transition:transform .2s, box-shadow .2s; box-shadow:0 8px 20px rgba(230,56,136,0.3); }
        .fx-btn:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 12px 26px rgba(230,56,136,0.4); }
        .fx-btn:active { transform:scale(0.97); }
        .fx-bottles { position:absolute; z-index:1; }
        .fx-float { animation: floaty 5s ease-in-out infinite; }
        .fx-float2 { animation: floaty2 6s ease-in-out infinite; }

        /* collection */
        .fx-section-head { padding:56px 5vw 28px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; }
        .fx-section-title { font-size:clamp(28px,4vw,44px); color:var(--ink); }
        .fx-section-note { font-size:13px; font-weight:700; max-width:240px; text-align:right; opacity:0.7; }

        .fx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:18px; padding:0 5vw; margin-bottom:12vh; }
        .fx-card { border-radius:var(--r-lg); padding:28px 22px; cursor:pointer; position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:center; text-align:center; color:#fff;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; min-height:330px; box-shadow:0 10px 24px rgba(43,33,64,0.12); }
        .fx-card:hover { transform:translateY(-8px) rotate(-1.5deg) scale(1.02); box-shadow:0 20px 34px rgba(43,33,64,0.22); }
        .fx-card:hover .fx-bottle { animation: wiggle 0.7s ease-in-out infinite; }
        .fx-card-fam { font-size:11px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; opacity:0.9; margin-bottom:10px; }
        .fx-card-name { font-family:'Baloo 2'; font-weight:800; font-size:24px; margin:12px 0 6px; }
        .fx-card-price { font-size:13px; font-weight:700; margin-bottom:16px; }
        .fx-card-pyramid { opacity:0; transform:translateY(8px); transition:opacity .3s, transform .3s; width:100%; margin-top:auto; }
        .fx-card:hover .fx-card-pyramid { opacity:1; transform:translateY(0); }

        /* pyramid */
        .pyramid { display:flex; flex-direction:column; gap:8px; width:100%; }
        .pyramid-row { display:flex; align-items:center; gap:8px; }
        .pyramid-bar-wrap { width:54px; flex-shrink:0; }
        .pyramid-bar { height:6px; border-radius:var(--r-pill); margin-left:auto; }
        .pyramid-text { display:flex; flex-direction:column; text-align:left; }
        .pyramid-label { font-size:9px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; opacity:0.85; }
        .pyramid-items { font-size:11.5px; font-weight:700; }

        .fx-footer { padding:36px 5vw; display:flex; justify-content:space-between; font-size:12px; font-weight:700; flex-wrap:wrap; gap:10px; opacity:0.6; }

        /* overlays */
        .fx-overlay { position:fixed; inset:0; background:rgba(43,33,64,0.45); backdrop-filter:blur(2px); z-index:40; }
        .fx-modal { position:fixed; z-index:50; background:var(--cream); top:0; bottom:0; right:0; width:min(430px,100%);
          border-radius:var(--r-lg) 0 0 var(--r-lg); box-shadow:-16px 0 40px rgba(43,33,64,0.2); display:flex; flex-direction:column; animation:slidein .3s cubic-bezier(.34,1.56,.64,1); }
        @keyframes slidein { from{transform:translateX(30px); opacity:0;} to{transform:none; opacity:1;} }
        .fx-modal-head { display:flex; justify-content:space-between; align-items:center; padding:22px 24px; border-bottom:2px solid var(--cream-soft); }
        .fx-modal-close { background:var(--cream-soft); border:none; cursor:pointer; color:var(--ink); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .fx-modal-body { padding:24px; overflow-y:auto; flex:1; }

        .fx-product-modal { position:fixed; inset:0; margin:auto; z-index:50; background:var(--cream); width:min(780px,92vw);
          max-height:88vh; overflow-y:auto; display:flex; border-radius:var(--r-lg); box-shadow:0 30px 60px rgba(43,33,64,0.35); }
        @media (max-width:640px) { .fx-product-modal { flex-direction:column; } }
        .fx-pm-visual { flex:1; display:flex; align-items:center; justify-content:center; padding:40px; color:#fff; border-radius:var(--r-lg) 0 0 var(--r-lg); }
        @media (max-width:640px) { .fx-pm-visual { border-radius:var(--r-lg) var(--r-lg) 0 0; } }
        .fx-pm-info { flex:1; padding:38px; }
        .fx-pm-fam { font-size:11px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
        .fx-pm-name { font-family:'Baloo 2'; font-weight:800; font-size:32px; margin:0 0 10px; }
        .fx-pm-story { font-size:14px; font-weight:600; margin-bottom:22px; line-height:1.6; opacity:0.85; }
        .fx-size-row { display:flex; gap:8px; margin-bottom:22px; }
        .fx-size-btn { border:2px solid var(--cream-soft); background:var(--cream-soft); border-radius:var(--r-pill); padding:9px 18px; font-size:13px; font-weight:800; cursor:pointer; transition:transform .15s; }
        .fx-size-btn:hover { transform:scale(1.05); }
        .fx-size-btn.active { background:var(--ink); color:#fff; border-color:var(--ink); }
        .fx-pm-price { font-family:'Baloo 2'; font-weight:800; font-size:24px; margin-bottom:20px; }

        .cart-item { display:flex; gap:14px; padding:16px 0; border-bottom:2px solid var(--cream-soft); align-items:center; }
        .cart-item-name { font-family:'Baloo 2'; font-weight:700; font-size:16px; }
        .cart-item-meta { font-size:12px; font-weight:700; margin:4px 0 10px; opacity:0.6; }
        .qty-ctrl { display:flex; align-items:center; gap:10px; }
        .qty-btn { border:none; background:var(--cream-soft); width:28px; height:28px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:transform .15s; }
        .qty-btn:hover { transform:scale(1.1); }
        .cart-empty { text-align:center; padding:60px 0; font-weight:700; opacity:0.5; }
        .cart-footer { padding:22px 24px; border-top:2px solid var(--cream-soft); }
        .cart-subtotal { display:flex; justify-content:space-between; font-family:'Baloo 2'; font-weight:800; font-size:19px; margin-bottom:16px; }

        .form-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
        .form-field label { font-size:12px; font-weight:800; letter-spacing:0.02em; }
        .form-field input, .form-field textarea { border:2px solid var(--cream-soft); background:#fff; border-radius:var(--r-sm); padding:12px 14px; font-family:'Nunito'; font-weight:600; font-size:14px; }
        .form-field input:focus, .form-field textarea:focus { outline:none; border-color:var(--magenta); }
        .pay-opt { display:flex; align-items:center; gap:10px; border:2px solid var(--cream-soft); border-radius:var(--r-sm); padding:12px 14px; margin-bottom:10px; cursor:pointer; font-size:13px; font-weight:700; transition:border-color .15s; }
        .pay-opt.active { border-color:var(--magenta); background:var(--cream-soft); }

        .done-wrap { text-align:center; padding:60px 24px; }
        .done-icon { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,var(--coral),var(--magenta)); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:0 10px 24px rgba(230,56,136,0.35); }
        .done-id { font-family:'Baloo 2'; font-weight:800; font-size:22px; margin:14px 0 6px; }
      `}</style>

      {/* header */}
      <header className="fx-header">
        <div className="fx-logo">
          <Bottle product={PRODUCTS[2]} size={30} tilt={16} />
          <div className="fx-logo-word">FURIEUX</div>
          <div className="fx-logo-parfum">PARFUM</div>
        </div>
        <nav className="fx-nav">
          <span>Bộ sưu tập</span>
          <span>Câu chuyện</span>
          <span>Liên hệ</span>
        </nav>
        <button className="fx-cart-btn" aria-label="Giỏ hàng" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          {cartCount > 0 && <span className="fx-cart-count">{cartCount}</span>}
        </button>
      </header>

      {/* hero */}
      <section className="fx-hero">
        <div className="fx-hero-blob fx-float" style={{width:280,height:280,background:"radial-gradient(circle,var(--lime),transparent 70%)",top:-80,right:"6%"}} />
        <div className="fx-hero-blob fx-float2" style={{width:180,height:180,background:"radial-gradient(circle,var(--magenta),transparent 70%)",bottom:0,right:"24%"}} />
        <div className="fx-hero-blob fx-float" style={{width:140,height:140,background:"radial-gradient(circle,var(--cobalt),transparent 70%)",top:140,right:"0%"}} />
        <div className="fx-bottles fx-float" style={{top:40,right:"16%"}}>
          <Bottle product={PRODUCTS[4]} size={72} tilt={20} />
        </div>
        <div className="fx-bottles fx-float2" style={{top:210,right:"5%"}}>
          <Bottle product={PRODUCTS[5]} size={64} tilt={-24} />
        </div>
        <div className="fx-bottles fx-float">
          <Bottle product={PRODUCTS[0]} size={96} tilt={-16} />
        </div>

        <h1 className="fx-hero-title fx-display">
          <span>MÙI HƯƠNG</span>
          <span className="fx-grad">KHÔNG XIN LỖI.</span>
        </h1>
        <div className="fx-hero-row">
          <p className="fx-hero-sub">
            FURIEUX pha chế cho những người không muốn hoà lẫn — mỗi chai một cá tính,
            một màu, một tuyên ngôn riêng.
          </p>
          <button className="fx-btn" onClick={() => document.getElementById("fx-grid")?.scrollIntoView({behavior:"smooth"})}>
            Xem bộ sưu tập <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* collection */}
      <div className="fx-section-head" id="fx-grid">
        <div className="fx-section-title fx-display">Bộ sưu tập</div>
        <div className="fx-section-note">Mỗi chai một màu, một cá tính. Di chuột để xem tháp hương.</div>
      </div>
      <div className="fx-grid">
        {PRODUCTS.map((p) => (
          <div
            className="fx-card"
            key={p.id}
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
            onClick={() => { setSelected(p); setSelectedMl(50); }}
          >
            <div className="fx-card-fam">{p.family}</div>
            <div className="fx-bottle" style={{ "--tilt": "14deg" }}>
              <Bottle product={p} size={90} tilt={14} mono />
            </div>
            <div className="fx-card-name">{p.name}</div>
            <div className="fx-card-price">{money(priceFor(p, 50))} · 50ml</div>
            <div className="fx-card-pyramid">
              <Pyramid notes={p.notes} product={p} />
            </div>
          </div>
        ))}
      </div>

      <footer className="fx-footer">
        <span>© FURIEUX PARFUM — EST. 2024</span>
        <span>Giao hàng toàn quốc · Đổi trả trong 7 ngày</span>
      </footer>

      {/* product modal */}
      {selected && (
        <>
          <div className="fx-overlay" onClick={() => setSelected(null)} />
          <div className="fx-product-modal">
            <button
              className="fx-modal-close"
              style={{ position:"absolute", top:18, right:18, zIndex:2, background:"#fff" }}
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>
            <div className="fx-pm-visual" style={{ background: `linear-gradient(135deg, ${selected.from}, ${selected.to})` }}>
              <Bottle product={selected} size={200} tilt={12} mono />
            </div>
            <div className="fx-pm-info">
              <div className="fx-pm-fam" style={{color:selected.dark}}>{selected.family}</div>
              <h2 className="fx-pm-name fx-display">{selected.name}</h2>
              <p className="fx-pm-story">{selected.story}</p>
              <Pyramid notes={selected.notes} product={selected} ink />
              <div style={{height:22}} />
              <div className="fx-size-row">
                {SIZES.map((s) => (
                  <button key={s.ml} className={`fx-size-btn ${selectedMl === s.ml ? "active" : ""}`} onClick={() => setSelectedMl(s.ml)}>
                    {s.ml}ml
                  </button>
                ))}
              </div>
              <div className="fx-pm-price">{money(priceFor(selected, selectedMl))}</div>
              <button
                className="fx-btn"
                style={{ width:"100%", justifyContent:"center", background:`linear-gradient(135deg, ${selected.from}, ${selected.to})`, boxShadow:"none" }}
                onClick={() => addToCart(selected, selectedMl)}
              >
                Thêm vào giỏ <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* cart drawer */}
      {cartOpen && (
        <>
          <div className="fx-overlay" onClick={() => { setCartOpen(false); setStep("shop"); }} />
          <div className="fx-modal">
            <div className="fx-modal-head">
              <div className="fx-display" style={{fontSize:19}}>
                {step === "shop" && "Giỏ hàng"}
                {step === "checkout" && "Giao hàng"}
                {step === "done" && "Đặt hàng xong"}
              </div>
              <button className="fx-modal-close" onClick={() => { setCartOpen(false); setStep("shop"); }}>
                <X size={18} />
              </button>
            </div>

            {step === "shop" && (
              <>
                <div className="fx-modal-body">
                  {cart.length === 0 && <div className="cart-empty">Giỏ hàng của bạn đang trống.</div>}
                  {cart.map((i) => {
                    const p = productById(i.productId);
                    return (
                      <div className="cart-item" key={i.key}>
                        <div style={{background:`linear-gradient(135deg, ${p.from}, ${p.to})`, padding:6, borderRadius:14}}>
                          <Bottle product={p} size={44} tilt={12} mono />
                        </div>
                        <div style={{flex:1}}>
                          <div className="cart-item-name">{p.name}</div>
                          <div className="cart-item-meta">{i.ml}ml · {money(priceFor(p, i.ml))}</div>
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={() => changeQty(i.key, -1)}><Minus size={12} /></button>
                            <span>{i.qty}</span>
                            <button className="qty-btn" onClick={() => changeQty(i.key, 1)}><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {cart.length > 0 && (
                  <div className="cart-footer">
                    <div className="cart-subtotal"><span>Tạm tính</span><span>{money(subtotal)}</span></div>
                    <button className="fx-btn" style={{width:"100%", justifyContent:"center"}} onClick={() => setStep("checkout")}>
                      Tiến hành thanh toán <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={placeOrder} style={{display:"flex", flexDirection:"column", height:"100%"}}>
                <div className="fx-modal-body">
                  <div className="form-field">
                    <label>Họ và tên</label>
                    <input required value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
                  </div>
                  <div className="form-field">
                    <label>Số điện thoại</label>
                    <input required value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
                  </div>
                  <div className="form-field">
                    <label>Địa chỉ giao hàng</label>
                    <textarea required rows={3} value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
                  </div>
                  <div className="form-field">
                    <label>Phương thức thanh toán</label>
                    <div className={`pay-opt ${form.payment==="cod"?"active":""}`} onClick={()=>setForm({...form,payment:"cod"})}>
                      <input type="radio" checked={form.payment==="cod"} readOnly /> Thanh toán khi nhận hàng (COD)
                    </div>
                    <div className={`pay-opt ${form.payment==="bank"?"active":""}`} onClick={()=>setForm({...form,payment:"bank"})}>
                      <input type="radio" checked={form.payment==="bank"} readOnly /> Chuyển khoản ngân hàng
                    </div>
                  </div>
                </div>
                <div className="cart-footer">
                  <div className="cart-subtotal"><span>Tổng cộng</span><span>{money(subtotal)}</span></div>
                  {orderError && <div style={{color:"var(--coral)", fontSize:13, fontWeight:700, marginBottom:12}}>{orderError}</div>}
                  <button type="submit" disabled={submitting} className="fx-btn" style={{width:"100%", justifyContent:"center", opacity:submitting?0.6:1}}>
                    {submitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="done-wrap">
                <div className="done-icon"><Check size={26} /></div>
                <div>Cảm ơn bạn đã chọn FURIEUX.</div>
                <div className="done-id">#{orderId}</div>
                {!supabase && (
                  <p style={{fontSize:13, marginBottom:26, opacity:0.6, fontWeight:600}}>
                    Đây là bản demo — không có giao dịch thật nào được thực hiện.
                  </p>
                )}
                <button className="fx-btn" onClick={() => { setCartOpen(false); setStep("shop"); }}>
                  Tiếp tục xem bộ sưu tập
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
