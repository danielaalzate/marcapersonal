"use client";

import { useMemo, useState } from "react";

type Market = "ES" | "CO";

const whatsappBase = "https://wa.me/34624463748?text=";

const marketCopy = {
  ES: { name: "España", basic: "250 €", editable: "350 €", commerce: "2.000 €", basicMonthly: "20 €/mes", editableMonthly: "30 €/mes" },
  CO: { name: "Colombia", basic: "COP 550.000", editable: "COP 700.000", commerce: "COP 5.500.000", basicMonthly: "COP 80.000/mes", editableMonthly: "COP 120.000/mes" },
};

function WhatsAppLink({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  return <a className={className} href={`${whatsappBase}${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{children}</a>;
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

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">ESTRATEGIA · DISEÑO · CULTURA</p>
          <h1>Lo cultural merece <em>una presencia digital</em> a la altura de su valor.</h1>
          <p className="hero-intro">Creo páginas web y estrategias digitales para escuelas, festivales, artistas e instituciones culturales que quieren conectar mejor con sus públicos y crecer con claridad.</p>
          <div className="hero-actions"><WhatsAppLink className="button button-primary" message={marketMessage}>Hablemos de tu proyecto <span aria-hidden="true">↗</span></WhatsAppLink><a className="text-link" href="#servicios">Explorar servicios <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-art" aria-label="Monograma Daniela Alzate"><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-monogram"><span>D</span><span>A</span><span>A</span></div><p>Daniela Alzate<br />Estrategia digital<br />para la cultura</p></div>
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

      <section className="contact" id="precios"><p className="eyebrow">EMPECEMOS</p><h2>Tu proyecto cultural<br />puede ser <em>más fácil de encontrar.</em></h2><p>Cuéntame qué necesitas. La primera conversación no tiene coste y no te compromete a nada.</p><WhatsAppLink className="button button-primary button-large" message={marketMessage}>Escribir por WhatsApp <span aria-hidden="true">↗</span></WhatsAppLink><p className="phone">+34 624 463 748</p></section>
      <footer><a href="#inicio" className="brand"><span className="brand-mark">D.A.A.</span><span className="brand-name">Daniela Alzate</span></a><p>Webs y estrategia digital para organizaciones culturales.</p><p>España · Colombia</p></footer>
    </main>
  );
}
