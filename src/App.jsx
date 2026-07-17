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
    color: "#FF5B3D",
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
    color: "#A9E22F",
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
    color: "#E63888",
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
    color: "#2A3FD6",
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
    color: "#FFB020",
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
    color: "#7A3EFF",
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

function Bottle({ color, dark, size = 100, tilt = 18, mono }) {
  const w = size, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" style={{ transform: `rotate(${tilt}deg)` }}>
      <g>
        <rect x="34" y="6" width="20" height="12" rx="3" fill={mono ? "var(--cream)" : dark} />
        <rect x="38" y="16" width="12" height="10" fill={mono ? "var(--cream)" : dark} opacity="0.85" />
        <rect x="24" y="24" width="40" height="60" rx="9" fill={mono ? "var(--cream)" : color} />
        <rect x="34" y="42" width="20" height="22" rx="3" fill={mono ? color : "var(--cream)"} opacity="0.92" />
      </g>
    </svg>
  );
}

function Pyramid({ notes, ink = false }) {
  const rows = [
    { label: "Hương đầu", items: notes.top, w: 40 },
    { label: "Hương giữa", items: notes.heart, w: 68 },
    { label: "Hương cuối", items: notes.base, w: 100 },
  ];
  return (
    <div className="pyramid">
      {rows.map((r) => (
        <div className="pyramid-row" key={r.label}>
          <div className="pyramid-bar-wrap">
            <div
              className="pyramid-bar"
              style={{ width: `${r.w}%`, background: ink ? "var(--ink)" : "var(--cream)" }}
            />
          </div>
          <div className="pyramid-text">
            <span className="pyramid-label" style={{ color: ink ? "var(--ink)" : "var(--cream)" }}>{r.label}</span>
            <span className="pyramid-items" style={{ color: ink ? "var(--ink)" : "var(--cream)" }}>{r.items.join(" · ")}</span>
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
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');

        .fx-wrap {
          --ink:#191919; --cream:#F3EEE0; --cream-soft:#E7DFC7;
          --coral:#FF5B3D; --lime:#A9E22F; --magenta:#E63888;
          --cobalt:#2A3FD6; --amber:#FFB020; --violet:#7A3EFF;
          font-family:'Inter',sans-serif; background:var(--cream); color:var(--ink); min-height:100vh;
        }
        .fx-wrap * { box-sizing:border-box; }
        .fx-display { font-family:'Anton', sans-serif; text-transform:uppercase; letter-spacing:0.01em; }

        /* header */
        .fx-header { display:flex; align-items:center; justify-content:space-between; padding:18px 5vw;
          position:sticky; top:0; z-index:30; background:rgba(243,238,224,0.9); backdrop-filter:blur(8px);
          border-bottom:3px solid var(--ink); }
        .fx-logo { display:flex; align-items:center; gap:10px; }
        .fx-logo-word { font-family:'Anton'; font-size:26px; letter-spacing:0.01em; }
        .fx-logo-sub { display:flex; flex-direction:column; line-height:1; }
        .fx-logo-parfum { font-size:9px; letter-spacing:0.3em; }
        .fx-nav { display:flex; gap:26px; font-size:13px; font-weight:600; }
        .fx-est { writing-mode:vertical-rl; font-size:10px; letter-spacing:0.25em; opacity:0.6; }
        .fx-cart-btn { position:relative; background:var(--ink); color:var(--cream); border:none; width:40px; height:40px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .fx-cart-count { position:absolute; top:-7px; right:-7px; background:var(--coral); color:#fff; font-size:10px; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid var(--cream); }

        /* hero */
        .fx-hero { position:relative; padding:9vh 5vw 8vh; overflow:hidden; border-bottom:3px solid var(--ink); }
        .fx-hero-blob { position:absolute; border-radius:50%; filter:blur(0px); opacity:0.9; z-index:0; }
        .fx-hero-title { font-size:clamp(52px,11vw,150px); line-height:0.86; position:relative; z-index:2; margin:0; }
        .fx-hero-title span { display:block; }
        .fx-hero-row { display:flex; justify-content:space-between; align-items:flex-end; margin-top:26px; position:relative; z-index:2; gap:24px; flex-wrap:wrap; }
        .fx-hero-sub { max-width:380px; font-size:15px; line-height:1.6; font-weight:500; }
        .fx-btn { font-family:'Inter'; font-weight:700; font-size:13px; letter-spacing:0.04em; text-transform:uppercase;
          background:var(--ink); color:var(--cream); border:3px solid var(--ink); padding:15px 28px; cursor:pointer;
          display:inline-flex; align-items:center; gap:10px; transition:transform .2s, background .2s, color .2s; }
        .fx-btn:hover { background:var(--coral); border-color:var(--coral); color:#fff; transform:translate(-2px,-2px); }
        .fx-bottles { position:absolute; z-index:1; }

        /* collection */
        .fx-section-head { padding:64px 5vw 30px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; }
        .fx-section-title { font-size:clamp(30px,4vw,48px); }
        .fx-section-note { font-size:13px; font-weight:600; max-width:240px; text-align:right; }

        .fx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; padding:0 5vw; margin-bottom:12vh; }
        .fx-card { border:3px solid var(--ink); padding:28px 22px; cursor:pointer; position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:center; text-align:center; color:var(--cream);
          transition:transform .25s; min-height:340px; }
        .fx-card:hover { transform:translateY(-6px); }
        .fx-card-fam { font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; opacity:0.85; margin-bottom:10px; }
        .fx-card-name { font-family:'Anton'; font-size:26px; margin:12px 0 6px; }
        .fx-card-price { font-size:13px; font-weight:600; margin-bottom:16px; }
        .fx-card-pyramid { opacity:0; transform:translateY(8px); transition:opacity .3s, transform .3s; width:100%; margin-top:auto; }
        .fx-card:hover .fx-card-pyramid { opacity:1; transform:translateY(0); }

        /* pyramid */
        .pyramid { display:flex; flex-direction:column; gap:7px; width:100%; }
        .pyramid-row { display:flex; align-items:center; gap:8px; }
        .pyramid-bar-wrap { width:56px; flex-shrink:0; }
        .pyramid-bar { height:5px; border-radius:2px; margin-left:auto; }
        .pyramid-text { display:flex; flex-direction:column; text-align:left; }
        .pyramid-label { font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; opacity:0.8; }
        .pyramid-items { font-size:11.5px; font-weight:500; }

        .fx-footer { padding:36px 5vw; border-top:3px solid var(--ink); display:flex; justify-content:space-between; font-size:12px; font-weight:600; flex-wrap:wrap; gap:10px; }

        /* overlays */
        .fx-overlay { position:fixed; inset:0; background:rgba(25,25,25,0.55); z-index:40; }
        .fx-modal { position:fixed; z-index:50; background:var(--cream); top:0; bottom:0; right:0; width:min(430px,100%);
          border-left:3px solid var(--ink); display:flex; flex-direction:column; animation:slidein .28s ease; }
        @keyframes slidein { from{transform:translateX(24px); opacity:0;} to{transform:none; opacity:1;} }
        .fx-modal-head { display:flex; justify-content:space-between; align-items:center; padding:20px 22px; border-bottom:3px solid var(--ink); }
        .fx-modal-close { background:none; border:none; cursor:pointer; color:var(--ink); }
        .fx-modal-body { padding:22px; overflow-y:auto; flex:1; }

        .fx-product-modal { position:fixed; inset:0; margin:auto; z-index:50; background:var(--cream); width:min(780px,92vw);
          max-height:88vh; overflow-y:auto; display:flex; border:3px solid var(--ink); }
        @media (max-width:640px) { .fx-product-modal { flex-direction:column; } }
        .fx-pm-visual { flex:1; display:flex; align-items:center; justify-content:center; padding:40px; color:var(--cream); }
        .fx-pm-info { flex:1; padding:36px; }
        .fx-pm-fam { font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; margin-bottom:8px; }
        .fx-pm-name { font-family:'Anton'; font-size:34px; margin:0 0 10px; }
        .fx-pm-story { font-size:14px; font-weight:500; margin-bottom:22px; line-height:1.6; }
        .fx-size-row { display:flex; gap:8px; margin-bottom:22px; }
        .fx-size-btn { border:2px solid var(--ink); background:none; padding:9px 15px; font-size:13px; font-weight:700; cursor:pointer; }
        .fx-size-btn.active { background:var(--ink); color:var(--cream); }
        .fx-pm-price { font-family:'Anton'; font-size:24px; margin-bottom:20px; }

        .cart-item { display:flex; gap:14px; padding:16px 0; border-bottom:2px solid var(--cream-soft); align-items:center; }
        .cart-item-name { font-family:'Anton'; font-size:16px; }
        .cart-item-meta { font-size:12px; font-weight:600; margin:4px 0 10px; opacity:0.7; }
        .qty-ctrl { display:flex; align-items:center; gap:10px; }
        .qty-btn { border:2px solid var(--ink); background:none; width:26px; height:26px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .cart-empty { text-align:center; padding:60px 0; font-weight:600; opacity:0.6; }
        .cart-footer { padding:22px; border-top:3px solid var(--ink); }
        .cart-subtotal { display:flex; justify-content:space-between; font-family:'Anton'; font-size:19px; margin-bottom:16px; }

        .form-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
        .form-field label { font-size:12px; font-weight:700; letter-spacing:0.03em; }
        .form-field input, .form-field textarea { border:2px solid var(--ink); background:#fff; padding:11px 12px; font-family:'Inter'; font-size:14px; }
        .form-field input:focus, .form-field textarea:focus { outline:2px solid var(--coral); outline-offset:1px; }
        .pay-opt { display:flex; align-items:center; gap:10px; border:2px solid var(--ink); padding:12px; margin-bottom:10px; cursor:pointer; font-size:13px; font-weight:600; }
        .pay-opt.active { background:var(--ink); color:var(--cream); }

        .done-wrap { text-align:center; padding:60px 24px; }
        .done-icon { width:56px; height:56px; border-radius:50%; background:var(--coral); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
        .done-id { font-family:'Anton'; font-size:22px; margin:14px 0 6px; }
      `}</style>

      {/* header */}
      <header className="fx-header">
        <div className="fx-logo">
          <Bottle color="var(--ink)" dark="var(--ink)" size={30} tilt={18} mono />
          <div className="fx-logo-word">FURIEUX</div>
          <div className="fx-logo-sub">
            <span className="fx-logo-parfum">PARFUM</span>
          </div>
        </div>
        <nav className="fx-nav">
          <span>Bộ sưu tập</span>
          <span>Câu chuyện</span>
          <span>Liên hệ</span>
        </nav>
        <div style={{display:"flex", alignItems:"center", gap:18}}>
          <span className="fx-est">EST. 2024</span>
          <button className="fx-cart-btn" aria-label="Giỏ hàng" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="fx-cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="fx-hero">
        <div className="fx-hero-blob" style={{width:260,height:260,background:"var(--lime)",top:-60,right:"8%"}} />
        <div className="fx-hero-blob" style={{width:160,height:160,background:"var(--magenta)",bottom:10,right:"22%"}} />
        <div className="fx-hero-blob" style={{width:130,height:130,background:"var(--cobalt)",top:120,right:"2%"}} />
        <Bottle color="var(--coral)" dark="var(--ink)" size={90} tilt={-15} />
        <div style={{position:"absolute", top:60, right:"14%", zIndex:2}}>
          <Bottle color="var(--amber)" dark="var(--ink)" size={70} tilt={20} />
        </div>
        <div style={{position:"absolute", top:200, right:"6%", zIndex:2}}>
          <Bottle color="var(--violet)" dark="var(--ink)" size={60} tilt={-25} />
        </div>

        <h1 className="fx-hero-title fx-display">
          <span>MÙI HƯƠNG</span>
          <span>KHÔNG XIN LỖI.</span>
        </h1>
        <div className="fx-hero-row">
          <p className="fx-hero-sub">
            FURIEUX pha chế cho những người không muốn hoà lẫn — mỗi chai một cá tính,
            một màu, một tuyên ngôn riêng.
          </p>
          <button className="fx-btn" onClick={() => document.getElementById("fx-grid")?.scrollIntoView({behavior:"smooth"})}>
            Xem bộ sưu tập <ArrowRight size={15} />
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
          <div className="fx-card" key={p.id} style={{background:p.color}} onClick={() => { setSelected(p); setSelectedMl(50); }}>
            <div className="fx-card-fam">{p.family}</div>
            <Bottle color={p.color} dark={p.dark} size={90} tilt={16} mono />
            <div className="fx-card-name">{p.name}</div>
            <div className="fx-card-price">{money(priceFor(p, 50))} · 50ml</div>
            <div className="fx-card-pyramid">
              <Pyramid notes={p.notes} />
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
              style={{ position:"absolute", top:16, right:16, zIndex:2, background:"var(--cream)", border:"2px solid var(--ink)", borderRadius:"50%", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>
            <div className="fx-pm-visual" style={{background:selected.color}}>
              <Bottle color={selected.color} dark={selected.dark} size={200} tilt={14} mono />
            </div>
            <div className="fx-pm-info">
              <div className="fx-pm-fam" style={{color:selected.dark}}>{selected.family}</div>
              <h2 className="fx-pm-name fx-display">{selected.name}</h2>
              <p className="fx-pm-story">{selected.story}</p>
              <Pyramid notes={selected.notes} ink />
              <div style={{height:22}} />
              <div className="fx-size-row">
                {SIZES.map((s) => (
                  <button key={s.ml} className={`fx-size-btn ${selectedMl === s.ml ? "active" : ""}`} onClick={() => setSelectedMl(s.ml)}>
                    {s.ml}ml
                  </button>
                ))}
              </div>
              <div className="fx-pm-price">{money(priceFor(selected, selectedMl))}</div>
              <button className="fx-btn" style={{width:"100%", justifyContent:"center", background:selected.dark, borderColor:selected.dark}} onClick={() => addToCart(selected, selectedMl)}>
                Thêm vào giỏ <ShoppingBag size={15} />
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
                <X size={20} />
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
                        <div style={{background:p.color, padding:6}}>
                          <Bottle color={p.color} dark={p.dark} size={44} tilt={12} mono />
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
                      Tiến hành thanh toán <ArrowRight size={15} />
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
                  {orderError && <div style={{color:"var(--coral)", fontSize:13, fontWeight:600, marginBottom:12}}>{orderError}</div>}
                  <button type="submit" disabled={submitting} className="fx-btn" style={{width:"100%", justifyContent:"center", opacity:submitting?0.6:1}}>
                    {submitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="done-wrap">
                <div className="done-icon"><Check size={24} /></div>
                <div>Cảm ơn bạn đã chọn FURIEUX.</div>
                <div className="done-id">#{orderId}</div>
                {!supabase && (
                  <p style={{fontSize:13, marginBottom:26, opacity:0.7, fontWeight:500}}>
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
