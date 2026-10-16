"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Market = "ES" | "CO";
type Language = "ES" | "EN";

const whatsappBase = "https://wa.me/34624463748?text=";

const marketCopy = {
  ES: { name: "España", basic: "250 €", editable: "350 €", commerce: "2.000 €", basicMonthly: "20 €/mes", editableMonthly: "30 €/mes" },
  CO: { name: "Colombia", basic: "COP 680.000", editable: "COP 920.000", commerce: "COP 5.500.000", basicMonthly: "COP 80.000/mes", editableMonthly: "COP 120.000/mes" },
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
  const [language, setLanguage] = useState<Language>("ES");
  const [market, setMarket] = useState<Market>("ES");
  const [showHomeLink, setShowHomeLink] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isEnglish = language === "EN";
  const pricing = marketCopy[market];
  const marketMessage = useMemo(() => isEnglish ? "Hello Daniela, I would like to talk about my cultural project." : `Hola Daniela, visito tu web desde ${pricing.name} y me gustaría hablar sobre mi proyecto cultural.`, [isEnglish, pricing.name]);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowHomeLink(!entry.isIntersecting),
      { threshold: 0.08, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <div className="announcement"><span>{isEnglish ? "Web creation and digital strategy for culture" : "Creación web y estrategia digital para la cultura"}</span><WhatsAppLink message={marketMessage}>{isEnglish ? "Free first conversation" : "Primera conversación gratuita"} <span aria-hidden="true">↗</span></WhatsAppLink></div>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label={isEnglish ? "Daniela Alzate, home" : "Daniela Alzate, inicio"}><span className="brand-mark">D.A.A.</span><span className="brand-name">Daniela Alzate</span></a>
        <button type="button" className={`menu-toggle${menuOpen ? " is-open" : ""}`} aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? (isEnglish ? "Close menu" : "Cerrar menú") : (isEnglish ? "Open menu" : "Abrir menú")} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <nav id="site-navigation" className={menuOpen ? "is-open" : ""} aria-label={isEnglish ? "Main navigation" : "Navegación principal"}>{showHomeLink && <a className="nav-home" href="#inicio" onClick={() => setMenuOpen(false)}>{isEnglish ? "Home" : "Inicio"}</a>}<a href="#servicios" onClick={() => setMenuOpen(false)}>{isEnglish ? "Services" : "Servicios"}</a><a href="#trayectoria" onClick={() => setMenuOpen(false)}>{isEnglish ? "Experience" : "Trayectoria"}</a><a href="#clientes" onClick={() => setMenuOpen(false)}>{isEnglish ? "Clients" : "Clientes"}</a><a href="#proceso" onClick={() => setMenuOpen(false)}>{isEnglish ? "Process" : "Proceso"}</a></nav>
        <div className="language-switch" aria-label={isEnglish ? "Language" : "Idioma"}><button type="button" className={!isEnglish ? "active" : ""} aria-pressed={!isEnglish} onClick={() => setLanguage("ES")}>ES</button><span>/</span><button type="button" className={isEnglish ? "active" : ""} aria-pressed={isEnglish} onClick={() => setLanguage("EN")}>EN</button></div>
      </header>

      <section className="hero hero-video-hero" id="inicio">
        <video className="hero-video-bg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/teatro-hero.mp4" type="video/mp4" /></video>
        <div className="hero-copy">
          <p className="eyebrow">{isEnglish ? "STRATEGY · DESIGN · CULTURE" : "ESTRATEGIA · DISEÑO · CULTURA"}</p>
          <h1>{isEnglish ? <>Culture deserves <em>a digital presence</em> that reflects its value.</> : <>Lo cultural merece <em>una presencia digital</em> a la altura de su valor.</>}</h1>
          <p className="hero-intro">{isEnglish ? "I create websites and digital strategies for schools, festivals, artists and cultural institutions that want to connect more clearly with their audiences and grow with focus." : "Creo páginas web y estrategias digitales para escuelas, festivales, artistas e instituciones culturales que quieren conectar mejor con sus públicos y crecer con claridad."}</p>
          <div className="hero-actions"><WhatsAppLink className="button button-primary" message={marketMessage}>{isEnglish ? "Let’s talk about your project" : "Hablemos de tu proyecto"} <span aria-hidden="true">↗</span></WhatsAppLink><a className="text-link" href="#servicios">{isEnglish ? "Explore services" : "Explorar servicios"} <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-art" aria-label="Daniela Alzate monogram"><NetworkField /><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-monogram"><span>D</span><span>A</span><span>A</span></div><p>Daniela Alzate<br />{isEnglish ? <>Digital strategy<br />for culture</> : <>Estrategia digital<br />para la cultura</>}</p></div>
      </section>

      <section className="intro-band"><p>{isEnglish ? <>More than a decade across <strong>theatres, audiences, sponsorships</strong> and digital projects.</> : <>Más de una década entre <strong>teatros, públicos, patrocinios</strong> y proyectos digitales.</>}</p><span>↘</span><p>{isEnglish ? "A strategic perspective that helps cultural organisations be seen, understood and chosen." : "Una mirada estratégica para hacer que las organizaciones culturales se vean, se entiendan y se elijan."}</p></section>

      <section className="section services" id="servicios">
        <div className="section-heading"><p className="eyebrow">01 — {isEnglish ? "SERVICES" : "SERVICIOS"}</p><h2>{isEnglish ? <>A digital doorway<br /><em>for every stage.</em></> : <>Una puerta digital<br /><em>para cada momento.</em></>}</h2><p>{isEnglish ? "From a first web presence to systems that support sales, learning and audience relationships." : "Desde una primera presencia web hasta sistemas que apoyan ventas, formación y relación con audiencias."}</p></div>
        {!isEnglish && <div className="market-switch pricing-switch" aria-label="Mercado y precios"><span>Precios:</span><button type="button" className={market === "ES" ? "active" : ""} aria-pressed={market === "ES"} onClick={() => setMarket("ES")}>España</button><span>/</span><button type="button" className={market === "CO" ? "active" : ""} aria-pressed={market === "CO"} onClick={() => setMarket("CO")}>Colombia</button></div>}
        <div className="service-grid">
          <article className="service-card featured"><p className="card-index">01</p><h3>{isEnglish ? "Informational website" : "Web informativa"}</h3><p>{isEnglish ? "A clear, artistic and professional presence that explains who you are, what you do and how to get in touch." : "Una presencia clara, artística y profesional para explicar quién eres, qué haces y cómo contactarte."}</p><ul><li>{isEnglish ? "Custom design" : "Diseño personalizado"}</li><li>{isEnglish ? "Initial technical SEO" : "SEO técnico inicial"}</li><li>{isEnglish ? "Hosting, SSL and support" : "Hosting, SSL y soporte"}</li></ul>{!isEnglish && <div className="card-bottom"><span>Desde <strong>{pricing.basic}</strong></span><small>+ {pricing.basicMonthly}</small></div>}</article>
          <article className="service-card blue-card"><p className="card-index">02</p><h3>{isEnglish ? "Editable website" : "Web autogestionable"}</h3><p>{isEnglish ? "A website built so you can update content independently, with managed access and technical support." : "Una web creada para que puedas actualizar contenidos con autonomía, con acceso controlado y acompañamiento técnico."}</p><ul><li>{isEnglish ? "Content editing" : "Edición de contenido"}</li><li>{isEnglish ? "Managed infrastructure" : "Infraestructura administrada"}</li><li>{isEnglish ? "Backups" : "Copias de seguridad"}</li></ul>{!isEnglish && <div className="card-bottom"><span>Desde <strong>{pricing.editable}</strong></span><small>+ {pricing.editableMonthly}</small></div>}</article>
          <article className="service-card dark-card"><p className="card-index">03</p><h3>{isEnglish ? "Sales and learning" : "Venta y formación"}</h3><p>{isEnglish ? "E-commerce or LMS platforms to sell products, manage enrolments, courses or digital content." : "E-commerce o LMS para vender productos, gestionar matrículas, cursos o contenidos digitales."}</p><ul><li>{isEnglish ? "Tailored scope" : "Alcance a medida"}</li><li>{isEnglish ? "Sales flows" : "Flujos de venta"}</li><li>{isEnglish ? "Proposal after review" : "Propuesta tras revisión"}</li></ul>{!isEnglish && <div className="card-bottom"><span>Desde <strong>{pricing.commerce}</strong></span><small>Mantenimiento según proyecto</small></div>}</article>
        </div>
        {!isEnglish && <p className="fine-print">Los precios son orientativos y pueden variar según funcionalidades, contenido y complejidad del proyecto.</p>}
      </section>

      <section className="strategy" id="estrategia"><div className="strategy-mark">02</div><div className="strategy-copy"><p className="eyebrow">{isEnglish ? "CULTURAL AND DIGITAL STRATEGY" : "ESTRATEGIA CULTURAL Y DIGITAL"}</p><h2>{isEnglish ? "When a website is only the beginning." : "Cuando una web es solo el comienzo."}</h2><p>{isEnglish ? "For theatres, museums and institutions that need a deeper transformation, I guide the strategy and, alongside a trusted network of specialists, its implementation." : "Para teatros, museos e instituciones que necesitan una transformación más profunda, acompaño la estrategia y, junto con una red de especialistas, su implementación."}</p><div className="pill-list"><span>{isEnglish ? "Marketing and audiences" : "Marketing y públicos"}</span><span>{isEnglish ? "Ticket sales" : "Venta de entradas"}</span><span>{isEnglish ? "Sponsorships" : "Patrocinios"}</span><span>{isEnglish ? "Automation" : "Automatización"}</span><span>{isEnglish ? "New revenue" : "Nuevos ingresos"}</span><span>{isEnglish ? "Relationship marketing" : "Comunicación relacional"}</span></div><WhatsAppLink className="button button-light" message={isEnglish ? "Hello Daniela, I would like to discuss a digital strategy for my cultural institution." : `Hola Daniela, visito tu web desde ${pricing.name} y quiero hablar de una estrategia digital para mi institución cultural.`}>{isEnglish ? "Talk strategy" : "Conversemos sobre estrategia"} <span aria-hidden="true">↗</span></WhatsAppLink></div></section>

      <section className="section trajectory" id="trayectoria"><div className="section-heading compact"><p className="eyebrow">03 — {isEnglish ? "EXPERIENCE" : "TRAYECTORIA"}</p><h2>{isEnglish ? <>Culture is not<br /><em>a niche for me.</em></> : <>La cultura no es<br /><em>un nicho para mí.</em></>}</h2></div><div className="trajectory-content"><p className="large-quote">{isEnglish ? "It is where I think, work and create opportunities." : "Es el lugar desde el que pienso, trabajo y creo oportunidades."}</p><div className="bio"><p>{isEnglish ? "I am Daniela Alzate, a Master of Management in International Arts Management with more than ten years of experience in marketing, sponsorship and management for cultural organisations." : "Soy Daniela Alzate, Master of Management in International Arts Management y profesional con más de diez años de experiencia en marketing, patrocinios y gestión para organizaciones culturales."}</p><p>{isEnglish ? "My experience connects work at leading theatres in Colombia with a contemporary perspective on e-commerce, content and tools for reaching new audiences." : "Mi trayectoria une el trabajo en teatros de referencia en Colombia con una mirada actual sobre comercio digital, contenidos y herramientas para conectar con nuevos públicos."}</p></div></div><div className="experience-list"><div><span>{isEnglish ? "Experience" : "Experiencia"}</span><strong>Teatro Colón</strong><p>{isEnglish ? "Programming, sponsorships and audience experiences." : "Programación, patrocinios y experiencias para públicos."}</p></div><div><span>{isEnglish ? "Experience" : "Experiencia"}</span><strong>Teatro Mayor Julio Mario Santo Domingo</strong><p>{isEnglish ? "Relationship marketing, subscriptions and digital content." : "Marketing relacional, abonos y contenidos digitales."}</p></div><div><span>{isEnglish ? "Education" : "Formación"}</span><strong>International Arts Management</strong><p>{isEnglish ? "An international foundation for growing cultural projects." : "Una base internacional para hacer crecer proyectos culturales."}</p></div></div></section>

      <section className="clients" id="clientes" aria-labelledby="clientes-title"><div className="clients-heading"><p className="eyebrow">{isEnglish ? "CLIENTS AND COLLABORATIONS" : "CLIENTES Y COLABORACIONES"}</p><h2 id="clientes-title">{isEnglish ? <>Projects already<br /><em>in motion.</em></> : <>Proyectos que<br /><em>ya están en movimiento.</em></>}</h2><p>{isEnglish ? "A selection of brands and artists with whom I have created digital presence and new ways to connect." : "Una selección de marcas y artistas con quienes he creado presencia digital y nuevas posibilidades de conexión."}</p></div><div className="client-categories" aria-label={isEnglish ? "Client projects by category" : "Proyectos de clientes por categoría"}><section className="client-category" aria-labelledby="visual-arts-title"><div className="client-category-heading"><p className="eyebrow">01</p><h3 id="visual-arts-title">{isEnglish ? "Galleries and visual artists" : "Galerías y artistas plásticos"}</h3></div><div className="client-projects"><a className="client-logo borboleta-logo" href="https://www.borboletagallery.com" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Visit Borboleta Gallery" : "Visitar Borboleta Gallery"}><img src="/borboleta-gallery-logo.png" alt="Borboleta Gallery" /></a><a className="client-logo maria-paula-logo" href="https://www.mariapaulaalzate.com" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Visit María Paula Alzate's website" : "Visitar la web de María Paula Alzate"}><img src="/firma-alzate-recortada.png" alt="María Paula Alzate" /></a><a className="client-project-icon" href="https://www.johngeoffreysanchez.com/" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Visit John Geoffrey Sánchez's website" : "Visitar la web de John Geoffrey Sánchez"}><img src="/john-geoffrey-favicon.svg" alt="" /></a></div></section><section className="client-category" aria-labelledby="writers-title"><div className="client-category-heading"><p className="eyebrow">02</p><h3 id="writers-title">{isEnglish ? "Writers and historians" : "Escritores e historiadores"}</h3></div><div className="client-projects single-project"><a className="client-project-icon" href="https://juanmanuelramirezescritor.com/" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Visit Juan Manuel Ramírez's website" : "Visitar la web de Juan Manuel Ramírez"}><img src="/juan-manuel-icon.png" alt="" /></a></div></section><section className="client-category" aria-labelledby="performing-arts-title"><div className="client-category-heading"><p className="eyebrow">03</p><h3 id="performing-arts-title">{isEnglish ? "Performing arts" : "Artes escénicas"}</h3></div><div className="client-projects single-project"><a className="client-logo compania-estable-logo" href="https://www.lacompaniaestable.com" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Visit La Compañía Estable" : "Visitar La Compañía Estable"}><img src="/la-compania-estable-logo.png" alt="La Compañía Estable" /></a></div></section></div></section>

      <section className="process" id="proceso"><div className="process-intro"><p className="eyebrow">04 — {isEnglish ? "HOW WE WORK" : "CÓMO TRABAJAMOS"}</p><h2>{isEnglish ? <>From conversation<br />to screen.</> : <>De la conversación<br />a la pantalla.</>}</h2></div><ol><li><span>01</span><div><h3>{isEnglish ? "We talk" : "Conversamos"}</h3><p>{isEnglish ? "A free first conversation to understand your organisation, audience and goals." : "Una primera conversación gratuita para entender tu organización, tu público y tus objetivos."}</p></div></li><li><span>02</span><div><h3>{isEnglish ? "We define the proposal" : "Definimos la propuesta"}</h3><p>{isEnglish ? "You receive a scope, timeline and investment designed around what you truly need." : "Recibes un alcance, calendario e inversión construidos para lo que realmente necesitas."}</p></div></li><li><span>03</span><div><h3>{isEnglish ? "We create and refine" : "Creamos y afinamos"}</h3><p>{isEnglish ? "Design, content and structure become a clear experience ready to grow." : "Diseño, contenido y estructura se transforman en una experiencia clara y lista para crecer."}</p></div></li><li><span>04</span><div><h3>{isEnglish ? "We launch and look after it" : "Lanzamos y cuidamos"}</h3><p>{isEnglish ? "Your website goes live and is supported through the maintenance plan you choose." : "Tu web queda publicada y acompañada con el plan de mantenimiento que elijas."}</p></div></li></ol></section>

      <section className="professional-profile" id="perfil" aria-labelledby="perfil-title">
        <div className="profile-image-wrap"><img src="/daniela-profile.png" alt={isEnglish ? "Daniela Alzate in the foyer of Teatro Colón in Bogotá" : "Daniela Alzate en el foyer del Teatro Colón de Bogotá"} /></div>
        <div className="profile-copy">
          <p className="eyebrow">{isEnglish ? "PROFESSIONAL PROFILE" : "PERFIL PROFESIONAL"}</p>
          <h2 id="perfil-title">Daniela Alzate<br /><em>{isEnglish ? "Cultural management with a digital perspective." : "Gestión cultural con mirada digital."}</em></h2>
          <p>{isEnglish ? "An arts and e-commerce professional with more than ten years of experience in marketing, sponsorships, audiences and project development." : "Profesional de las artes y del e-commerce, con más de diez años de experiencia en marketing, patrocinios, públicos y desarrollo de proyectos."}</p>
          <p>{isEnglish ? <>She holds a Master’s in International Arts Management, a joint programme of <strong>HEC Montréal, SDA Bocconi and Southern Methodist University</strong>, completed across Dallas, Milan and Montreal. She has professional training in classical piano performance and a Master of Music from the Pontificia Universidad Javeriana in Bogotá.</> : <>Es Máster en International Arts Management, programa conjunto de <strong>HEC Montréal, SDA Bocconi y Southern Methodist University</strong>, cursado entre Dallas, Milán y Montreal. Cuenta con formación profesional en interpretación de piano clásico y es Maestra en Música de la Pontificia Universidad Javeriana de Bogotá.</>}</p>
          <div className="career-list" aria-label={isEnglish ? "Selected professional experience" : "Experiencia profesional seleccionada"}>
            <div><span>{isEnglish ? "Since 2022" : "Desde 2022"}</span><strong>CEO · Victa: Cuidado Personal</strong><p>{isEnglish ? "E-commerce leadership, technology innovation and content for growth." : "Dirección de e-commerce, innovación tecnológica y contenidos para el crecimiento."}</p></div>
            <div><span>2019 — 2022</span><strong>Marketing Specialist · Teatro Mayor Julio Mario Santo Domingo</strong><p>{isEnglish ? "Ticket sales campaigns, audience relations and digital content." : "Campañas para venta de entradas, relación con públicos y contenidos digitales."}</p></div>
            <div><span>2016 — 2019</span><strong>Marketing Advisor · Teatro Colón Bogotá</strong><p>{isEnglish ? "Commercial plan, sponsorships, venue hire and ticketing strategy." : "Plan comercial, patrocinios, alquiler de espacios y estrategia de ticketing."}</p></div>
            <div><span>2015 — 2016</span><strong>Sponsorship &amp; Fundraising · Teatro Mayor Julio Mario Santo Domingo</strong><p>{isEnglish ? "Alliances, benefits and reports for sponsors." : "Alianzas, beneficios e informes para patrocinadores."}</p></div>
          </div>
          <div className="profile-details"><span>{isEnglish ? "Spain · Colombia" : "España · Colombia"}</span><span>{isEnglish ? "Theatres · festivals · arts education" : "Teatros · festivales · formación artística"}</span></div>
          <a className="profile-link" href="https://www.linkedin.com/in/daniela-alzate-afanador-840a89a5/" target="_blank" rel="noreferrer">{isEnglish ? "View LinkedIn profile" : "Ver perfil en LinkedIn"} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <WhatsAppLink className="whatsapp-float" message={marketMessage} ariaLabel={isEnglish ? "Message Daniela on WhatsApp" : "Escribir a Daniela por WhatsApp"}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.198.297-.768.967-.94 1.164-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.478-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.135-.135.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.52-.074-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.49.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.375a9.868 9.868 0 0 1-1.51-5.26c.002-5.438 4.424-9.86 9.866-9.86 2.633.001 5.106 1.026 6.966 2.886a9.814 9.814 0 0 1 2.887 6.967c-.003 5.438-4.425 9.861-9.867 9.861m8.39-18.384A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.89c0 2.095.548 4.141 1.587 5.945L.057 24l6.335-1.662a11.868 11.868 0 0 0 5.65 1.438h.005c6.554 0 11.89-5.336 11.893-11.892a11.821 11.821 0 0 0-3.499-8.483" /></svg></WhatsAppLink>
      <footer><div className="footer-identity"><a href="#inicio" className="brand"><span className="brand-mark">D.A.A.</span><span className="brand-name">Daniela Alzate</span></a><p className="copyright">© 2026 Daniela Alzate Afanador</p></div><p>{isEnglish ? "Websites and digital strategy for cultural organisations." : "Webs y estrategia digital para organizaciones culturales."}</p><p>{isEnglish ? "Spain · Colombia" : "España · Colombia"}</p></footer>
    </main>
  );
}
