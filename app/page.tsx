"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Market = "ES" | "CO";

const whatsappBase = "https://wa.me/34624463748?text=";

const marketCopy = {
  ES: { name: "España", basic: "250 €", editable: "350 €", commerce: "2.000 €", basicMonthly: "20 €/mes", editableMonthly: "30 €/mes" },
  CO: { name: "Colombia", basic: "COP 550.000", editable: "COP 700.000", commerce: "COP 5.500.000", basicMonthly: "COP 80.000/mes", editableMonthly: "COP 120.000/mes" },
};

function WhatsAppLink({ children, message, className = "", ariaLabel }: { children: React.ReactNode; message: string; className?: string; ariaLabel?: string }) {
  return <a aria-label={ariaLabel} className={className} href={`${whatsappBase}${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{children}</a>;
}

function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const palette = ["#A1C3E1", "#E7254F", "#FF7A00", "#FFEE49", "#B2D235", "#FFFFFF"];
    const nodes = Array.from({ length: 23 }, (_, index) => ({
      x: (index * 47 + 13) % 100,
      y: (index * 31 + 17) % 100,
      size: 1.5 + (index % 4) * 0.7,
      color: palette[index % palette.length],
      drift: 0.25 + (index % 5) * 0.09,
    }));
    const pointer = { x: -999, y: -999 };
    let frame = 0;
    let scrollPosition = window.scrollY;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => { pointer.x = -999; pointer.y = -999; };
    const onScroll = () => { scrollPosition = window.scrollY; };
    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      context.clearRect(0, 0, width, height);
      const points = nodes.map((node, index) => {
        const pulse = Math.sin(time * 0.0007 * node.drift + index) * 1.5;
        return {
          ...node,
          px: (node.x / 100) * width + Math.sin(time * 0.00025 * node.drift + index) * 18,
          py: (node.y / 100) * height + Math.cos(time * 0.00023 * node.drift + index) * 14 - (scrollPosition % 210) * 0.12 + pulse,
        };
      });
      context.lineWidth = 0.7;
      points.forEach((point, index) => {
        points.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(point.px - other.px, point.py - other.py);
          if (distance < 155) {
            context.strokeStyle = `rgba(161, 195, 225, ${0.23 * (1 - distance / 155)})`;
            context.beginPath(); context.moveTo(point.px, point.py); context.lineTo(other.px, other.py); context.stroke();
          }
        });
      });
      points.forEach((point) => {
        const distance = Math.hypot(point.px - pointer.x, point.py - pointer.y);
        const boost = distance < 115 ? (1 - distance / 115) * 4 : 0;
        context.beginPath();
        context.fillStyle = point.color;
        context.arc(point.px, point.py, point.size + boost, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" aria-hidden="true" />;
}

export default function Home() {
  const [market, setMarket] = useState<Market>("ES");
  const pricing = marketCopy[market];
  const marketMessage = useMemo(() => `Hola Daniela, visito tu web desde ${pricing.name} y me gustaría hablar sobre mi proyecto cultural.`, [pricing.name]);

  return (
    <main>
      <div className="announcement"><span>Creación web y estrategia digital para la cultura</span><WhatsAppLink message={marketMessage}>Primera conversación gratuita <span aria-hidden="true">↗</span></WhatsAppLink></div>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Daniela Alzate, inicio"><span className="brand-mark">D.A.A.</span><span className="brand-name">Daniela Alzate</span></a>
        <nav aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#trayectoria">Trayectoria</a><a href="#proceso">Proceso</a><a href="#precios">Precios</a></nav>
        <div className="market-switch" aria-label="Mercado y precios"><button className={market === "ES" ? "active" : ""} onClick={() => setMarket("ES")}>ES</button><span>/</span><button className={market === "CO" ? "active" : ""} onClick={() => setMarket("CO")}>CO</button></div>
      </header>

      <section className="hero hero-video-hero" id="inicio">
        <video className="hero-video-bg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/teatro-hero.mp4" type="video/mp4" /></video>
        <div className="hero-copy">
          <p className="eyebrow">ESTRATEGIA · DISEÑO · CULTURA</p>
          <h1>Lo cultural merece <em>una presencia digital</em> a la altura de su valor.</h1>
          <p className="hero-intro">Creo páginas web y estrategias digitales para escuelas, festivales, artistas e instituciones culturales que quieren conectar mejor con sus públicos y crecer con claridad.</p>
          <div className="hero-actions"><WhatsAppLink className="button button-primary" message={marketMessage}>Hablemos de tu proyecto <span aria-hidden="true">↗</span></WhatsAppLink><a className="text-link" href="#servicios">Explorar servicios <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-art" aria-label="Monograma Daniela Alzate"><NetworkField /><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-monogram"><span>D</span><span>A</span><span>A</span></div><p>Daniela Alzate<br />Estrategia digital<br />para la cultura</p></div>
      </section>

      <section className="intro-band"><p>Más de una década entre <strong>teatros, públicos, patrocinios</strong> y proyectos digitales.</p><span>↘</span><p>Una mirada estratégica para hacer que las organizaciones culturales se vean, se entiendan y se elijan.</p></section>

      <section className="section services" id="servicios">
        <div className="section-heading"><p className="eyebrow">01 — SERVICIOS</p><h2>Una puerta digital<br /><em>para cada momento.</em></h2><p>Desde una primera presencia web hasta sistemas que apoyan ventas, formación y relación con audiencias.</p></div>
        <div className="service-grid">
          <article className="service-card featured"><p className="card-index">01</p><h3>Web informativa</h3><p>Una presencia clara, artística y profesional para explicar quién eres, qué haces y cómo contactarte.</p><ul><li>Diseño personalizado</li><li>SEO técnico inicial</li><li>Hosting, SSL y soporte</li></ul><div className="card-bottom"><span>Desde <strong>{pricing.basic}</strong></span><small>+ {pricing.basicMonthly}</small></div></article>
          <article className="service-card blue-card"><p className="card-index">02</p><h3>Web autogestionable</h3><p>Una web creada para que puedas actualizar contenidos con autonomía, con acceso controlado y acompañamiento técnico.</p><ul><li>Edición de contenido</li><li>Infraestructura administrada</li><li>Copias de seguridad</li></ul><div className="card-bottom"><span>Desde <strong>{pricing.editable}</strong></span><small>+ {pricing.editableMonthly}</small></div></article>
          <article className="service-card dark-card"><p className="card-index">03</p><h3>Venta y formación</h3><p>E-commerce o LMS para vender productos, gestionar matrículas, cursos o contenidos digitales.</p><ul><li>Alcance a medida</li><li>Flujos de venta</li><li>Propuesta tras revisión</li></ul><div className="card-bottom"><span>Desde <strong>{pricing.commerce}</strong></span><small>Mantenimiento según proyecto</small></div></article>
        </div>
        <p className="fine-print">Los precios son orientativos y pueden variar según funcionalidades, contenido y complejidad del proyecto.</p>
      </section>

      <section className="strategy" id="estrategia"><div className="strategy-mark">02</div><div className="strategy-copy"><p className="eyebrow">ESTRATEGIA CULTURAL Y DIGITAL</p><h2>Cuando una web es solo el comienzo.</h2><p>Para teatros, museos e instituciones que necesitan una transformación más profunda, acompaño la estrategia y, junto con una red de especialistas, su implementación.</p><div className="pill-list"><span>Marketing y públicos</span><span>Venta de entradas</span><span>Patrocinios</span><span>Automatización</span><span>Nuevos ingresos</span><span>Comunicación relacional</span></div><WhatsAppLink className="button button-light" message={`Hola Daniela, visito tu web desde ${pricing.name} y quiero hablar de una estrategia digital para mi institución cultural.`}>Conversemos sobre estrategia <span aria-hidden="true">↗</span></WhatsAppLink></div></section>

      <section className="section trajectory" id="trayectoria"><div className="section-heading compact"><p className="eyebrow">03 — TRAYECTORIA</p><h2>La cultura no es<br /><em>un nicho para mí.</em></h2></div><div className="trajectory-content"><p className="large-quote">Es el lugar desde el que pienso, trabajo y creo oportunidades.</p><div className="bio"><p>Soy Daniela Alzate, Master of Management in International Arts Management y profesional con más de diez años de experiencia en marketing, patrocinios y gestión para organizaciones culturales.</p><p>Mi trayectoria une el trabajo en teatros de referencia en Colombia con una mirada actual sobre comercio digital, contenidos y herramientas para conectar con nuevos públicos.</p></div></div><div className="experience-list"><div><span>Experiencia</span><strong>Teatro Colón</strong><p>Programación, patrocinios y experiencias para públicos.</p></div><div><span>Experiencia</span><strong>Teatro Mayor Julio Mario Santo Domingo</strong><p>Marketing relacional, abonos y contenidos digitales.</p></div><div><span>Formación</span><strong>International Arts Management</strong><p>Una base internacional para hacer crecer proyectos culturales.</p></div></div></section>

      <section className="process" id="proceso"><div className="process-intro"><p className="eyebrow">04 — CÓMO TRABAJAMOS</p><h2>De la conversación<br />a la pantalla.</h2></div><ol><li><span>01</span><div><h3>Conversamos</h3><p>Una primera conversación gratuita para entender tu organización, tu público y tus objetivos.</p></div></li><li><span>02</span><div><h3>Definimos la propuesta</h3><p>Recibes un alcance, calendario e inversión construidos para lo que realmente necesitas.</p></div></li><li><span>03</span><div><h3>Creamos y afinamos</h3><p>Diseño, contenido y estructura se transforman en una experiencia clara y lista para crecer.</p></div></li><li><span>04</span><div><h3>Lanzamos y cuidamos</h3><p>Tu web queda publicada y acompañada con el plan de mantenimiento que elijas.</p></div></li></ol></section>

      <section className="professional-profile" id="perfil" aria-labelledby="perfil-title">
        <div className="profile-image-wrap"><img src="/daniela-profile.png" alt="Daniela Alzate en el foyer del Teatro Colón de Bogotá" /></div>
        <div className="profile-copy">
          <p className="eyebrow">PERFIL PROFESIONAL</p>
          <h2 id="perfil-title">Daniela Alzate<br /><em>Gestión cultural con mirada digital.</em></h2>
          <p>Profesional de las artes y del e-commerce, con más de diez años de experiencia en marketing, patrocinios, públicos y desarrollo de proyectos.</p>
          <p>Es Máster en International Arts Management, programa conjunto de <strong>HEC Montréal, SDA Bocconi y Southern Methodist University</strong>, cursado entre Dallas, Milán y Montreal. Cuenta con formación profesional en interpretación de piano clásico y es Maestra en Música de la Pontificia Universidad Javeriana de Bogotá.</p>
          <div className="career-list" aria-label="Experiencia profesional seleccionada">
            <div><span>Desde 2022</span><strong>CEO · Victa: Cuidado Personal</strong><p>Dirección de e-commerce, innovación tecnológica y contenidos para el crecimiento.</p></div>
            <div><span>2019 — 2022</span><strong>Marketing Specialist · Teatro Mayor</strong><p>Campañas para venta de entradas, relación con públicos y contenidos digitales.</p></div>
            <div><span>2016 — 2019</span><strong>Marketing Advisor · Teatro Colón Bogotá</strong><p>Plan comercial, patrocinios, alquiler de espacios y estrategia de ticketing.</p></div>
            <div><span>2015 — 2016</span><strong>Sponsorship &amp; Fundraising · Teatro Mayor</strong><p>Alianzas, beneficios e informes para patrocinadores.</p></div>
          </div>
          <div className="profile-details"><span>España · Colombia</span><span>Teatros · festivales · formación artística</span></div>
          <a className="profile-link" href="https://www.linkedin.com/in/daniela-alzate-afanador-840a89a5/" target="_blank" rel="noreferrer">Ver perfil en LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <WhatsAppLink className="whatsapp-float" message={marketMessage} ariaLabel="Escribir a Daniela por WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.198.297-.768.967-.94 1.164-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.478-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.135-.135.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.52-.074-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.49.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.375a9.868 9.868 0 0 1-1.51-5.26c.002-5.438 4.424-9.86 9.866-9.86 2.633.001 5.106 1.026 6.966 2.886a9.814 9.814 0 0 1 2.887 6.967c-.003 5.438-4.425 9.861-9.867 9.861m8.39-18.384A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.89c0 2.095.548 4.141 1.587 5.945L.057 24l6.335-1.662a11.868 11.868 0 0 0 5.65 1.438h.005c6.554 0 11.89-5.336 11.893-11.892a11.821 11.821 0 0 0-3.499-8.483" /></svg></WhatsAppLink>
      <footer><a href="#inicio" className="brand"><span className="brand-mark">D.A.A.</span><span className="brand-name">Daniela Alzate</span></a><p>Webs y estrategia digital para organizaciones culturales.</p><p>España · Colombia</p></footer>
    </main>
  );
}
