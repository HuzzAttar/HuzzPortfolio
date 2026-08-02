import re

def refactor_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the old responsive section entirely
    responsive_start = content.find('/* ──────────────── RESPONSIVE ──────────────── */')
    if responsive_start != -1:
        content = content[:responsive_start].strip()

    # 2. Helper to replace base blocks and append media queries
    def replace_block(selector, old_base_inner, new_base_inner, mq_additions):
        nonlocal content
        old_block = f"{selector} {{\n{old_base_inner}\n}}"
        new_block = f"{selector} {{\n{new_base_inner}\n}}"
        for mq, inner in mq_additions.items():
            new_block += f"\n@media ({mq}) {{\n  {selector} {{ {inner} }}\n}}"
        
        # We might have spaces mismatch, let's use regex
        # Just find the block starting with selector {
        pattern = re.escape(selector) + r'\s*\{([^}]*)\}'
        def replacer(match):
            return new_block
        content = re.sub(pattern, replacer, content, count=1)

    # Let's do manual replacements for accuracy
    # features-grid
    content = re.sub(
        r'\.features-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(4,\s*1fr\);\s*gap:\s*24px;\s*\}',
        '.features-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 600px) {\n  .features-grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .features-grid { grid-template-columns: repeat(3, 1fr); }\n}\n@media (min-width: 1100px) {\n  .features-grid { grid-template-columns: repeat(4, 1fr); }\n}',
        content
    )

    # services-grid
    content = re.sub(
        r'\.services-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(4,\s*1fr\);\s*gap:\s*24px;\s*\}',
        '.services-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 600px) {\n  .services-grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .services-grid { grid-template-columns: repeat(3, 1fr); }\n}\n@media (min-width: 1100px) {\n  .services-grid { grid-template-columns: repeat(4, 1fr); }\n}',
        content
    )

    # why-me-grid
    content = re.sub(
        r'\.why-me-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(4,\s*1fr\);\s*gap:\s*24px;\s*\}',
        '.why-me-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 600px) {\n  .why-me-grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 1100px) {\n  .why-me-grid { grid-template-columns: repeat(4, 1fr); }\n}',
        content
    )

    # footer-grid
    content = re.sub(
        r'\.footer-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*2fr\s+1fr\s+1fr\s+1fr;\s*gap:\s*48px;\s*padding-bottom:\s*56px;\s*border-bottom:\s*1px solid rgba\(255,255,255,0\.1\);\s*\}',
        '.footer-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n  padding-bottom: 56px;\n  border-bottom: 1px solid rgba(255,255,255,0.1);\n}\n@media (min-width: 600px) {\n  .footer-grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .footer-grid { grid-template-columns: repeat(3, 1fr); gap: 48px; }\n}\n@media (min-width: 1100px) {\n  .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }\n}',
        content
    )

    # footer-brand
    content = re.sub(
        r'\.footer-brand\s*\{\s*\}',
        '.footer-brand {\n  grid-column: 1 / -1;\n}\n@media (min-width: 1100px) {\n  .footer-brand { grid-column: auto; }\n}',
        content
    )
    if '.footer-brand {' not in content:
        # If it wasn't there, add it
        content = content.replace('.footer-logo', '.footer-brand {\n  grid-column: 1 / -1;\n}\n@media (min-width: 1100px) {\n  .footer-brand { grid-column: auto; }\n}\n\n.footer-logo', 1)

    # nav-links
    content = re.sub(
        r'\.nav-links\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*4px;\s*flex:\s*1;\s*justify-content:\s*center;\s*\}',
        '.nav-links {\n  display: none;\n  align-items: center;\n  gap: 4px;\n  flex: 1;\n  justify-content: center;\n}\n@media (min-width: 900px) {\n  .nav-links { display: flex; }\n}',
        content
    )

    # nav-cta
    content = re.sub(
        r'\.nav-cta\s*\{\s*display:\s*inline-flex;\s*\}',
        '.nav-cta {\n  display: none;\n}\n@media (min-width: 900px) {\n  .nav-cta { display: inline-flex; }\n}',
        content
    )

    # nav-hamburger
    content = re.sub(
        r'\.nav-hamburger\s*\{\s*display:\s*none;\s*flex-direction:\s*column;\s*gap:\s*5px;\s*padding:\s*4px;\s*z-index:\s*1001;\s*\}',
        '.nav-hamburger {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  padding: 4px;\n  z-index: 1001;\n}\n@media (min-width: 900px) {\n  .nav-hamburger { display: none; }\n}',
        content
    )

    # hero-container
    content = re.sub(
        r'\.hero-container\s*\{\s*max-width:\s*var\(--max-w\);\s*margin:\s*0\s*auto;\s*padding:\s*80px\s*24px;\s*display:\s*grid;\s*grid-template-columns:\s*1fr\s*1fr;\s*gap:\s*64px;\s*align-items:\s*center;\s*width:\s*100%;\s*\}',
        '.hero-container {\n  max-width: var(--max-w);\n  margin: 0 auto;\n  padding: 80px 24px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 40px;\n  align-items: center;\n  text-align: center;\n  width: 100%;\n}\n@media (min-width: 900px) {\n  .hero-container { grid-template-columns: 1fr 1fr; gap: 64px; text-align: left; }\n}',
        content
    )

    # hero-actions
    content = re.sub(
        r'\.hero-actions\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*16px;\s*flex-wrap:\s*wrap;\s*margin-bottom:\s*40px;\s*\}',
        '.hero-actions {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin-bottom: 40px;\n}\n@media (min-width: 900px) {\n  .hero-actions { justify-content: flex-start; }\n}',
        content
    )

    # hero-stats
    content = re.sub(
        r'\.hero-stats\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*0;\s*padding:\s*24px\s*28px;\s*background:\s*var\(--bg-card\);\s*border:\s*1px\s*solid\s*var\(--border-card\);\s*border-radius:\s*var\(--radius-lg\);\s*box-shadow:\s*var\(--shadow-sm\);\s*width:\s*fit-content;\s*\}',
        '.hero-stats {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n  padding: 24px 28px;\n  background: var(--bg-card);\n  border: 1px solid var(--border-card);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  width: fit-content;\n  margin: 0 auto;\n  justify-content: center;\n}\n@media (min-width: 600px) {\n  .hero-stats { gap: 0; flex-wrap: nowrap; }\n}\n@media (min-width: 900px) {\n  .hero-stats { margin: 0; justify-content: flex-start; }\n}',
        content
    )

    # hero-visual
    content = re.sub(
        r'\.hero-visual\s*\{\s*position:\s*relative;\s*z-index:\s*1;\s*\}',
        '.hero-visual {\n  position: relative;\n  z-index: 1;\n  display: none;\n}\n@media (min-width: 900px) {\n  .hero-visual { display: block; }\n}',
        content
    )

    # about-grid
    content = re.sub(
        r'\.about-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr\s*1\.6fr;\s*gap:\s*64px;\s*align-items:\s*center;\s*\}',
        '.about-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 64px;\n  align-items: center;\n}\n@media (min-width: 900px) {\n  .about-grid { grid-template-columns: 1fr 1.6fr; }\n}',
        content
    )

    # portfolio-grid
    content = re.sub(
        r'\.portfolio-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(3,\s*1fr\);\s*gap:\s*32px;\s*\}',
        '.portfolio-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n}\n@media (min-width: 600px) {\n  .portfolio-grid { grid-template-columns: 1fr 1fr; }\n}\n@media (min-width: 900px) {\n  .portfolio-grid { grid-template-columns: repeat(3, 1fr); }\n}',
        content
    )

    # why-grid
    content = re.sub(
        r'\.why-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*1fr\);\s*border:\s*1px\s*solid\s*var\(--border\);\s*border-radius:\s*var\(--radius-lg\);\s*background:\s*var\(--bg-card\);\s*overflow:\s*hidden;\s*\}',
        '.why-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-lg);\n  background: var(--bg-card);\n  overflow: hidden;\n}\n@media (min-width: 900px) {\n  .why-grid { grid-template-columns: repeat(2, 1fr); }\n}',
        content
    )

    # why-item borders
    content = re.sub(
        r'\.why-item:nth-child\(even\)\s*\{\s*border-right:\s*none;\s*\}',
        '.why-item:nth-child(even) {\n  border-right: none;\n}',
        content
    )
    content = content.replace(
        '.why-item:nth-last-child(-n+2) { border-bottom: none; }',
        '.why-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--border); }\n.why-item:last-child { border-bottom: none; }\n@media (min-width: 900px) {\n  .why-item:nth-last-child(-n+2) { border-bottom: none; }\n}'
    )

    # process-timeline
    content = re.sub(
        r'\.process-timeline\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(3,\s*1fr\);\s*gap:\s*24px;\s*\}',
        '.process-timeline {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 600px) {\n  .process-timeline { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .process-timeline { grid-template-columns: repeat(3, 1fr); }\n}',
        content
    )

    # pricing-grid
    content = re.sub(
        r'\.pricing-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(3,\s*1fr\);\s*gap:\s*32px;\s*align-items:\s*start;\s*max-width:\s*1100px;\s*margin:\s*0\s*auto\s*40px;\s*\}',
        '.pricing-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n  align-items: start;\n  max-width: 440px;\n  margin: 0 auto 32px;\n}\n@media (min-width: 900px) {\n  .pricing-grid { grid-template-columns: repeat(3, 1fr); max-width: 1100px; margin: 0 auto 40px; }\n}',
        content
    )

    # pricing-featured
    content = re.sub(
        r'\.pricing-featured\s*\{\s*border:\s*2px\s*solid\s*var\(--secondary\);\s*box-shadow:\s*0\s*0\s*0\s*4px\s*rgba\(26,86,219,0\.08\),\s*var\(--shadow-lg\);\s*transform:\s*scale\(1\.05\);\s*position:\s*relative;\s*z-index:\s*2;\s*\}',
        '.pricing-featured {\n  border: 2px solid var(--secondary);\n  box-shadow: 0 0 0 4px rgba(26,86,219,0.08), var(--shadow-lg);\n  transform: none;\n  position: relative;\n  z-index: 2;\n}\n@media (min-width: 900px) {\n  .pricing-featured { transform: scale(1.05); }\n}',
        content
    )
    content = re.sub(
        r'\.pricing-featured:hover\s*\{\s*transform:\s*scale\(1\.05\)\s*translateY\(-4px\);\s*\}',
        '.pricing-featured:hover {\n  transform: translateY(-4px);\n}\n@media (min-width: 900px) {\n  .pricing-featured:hover { transform: scale(1.05) translateY(-4px); }\n}',
        content
    )

    # contact-grid
    content = re.sub(
        r'\.contact-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1\.4fr\s*1fr;\s*gap:\s*56px;\s*align-items:\s*start;\s*\}',
        '.contact-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 56px;\n  align-items: start;\n}\n@media (min-width: 900px) {\n  .contact-grid { grid-template-columns: 1.4fr 1fr; }\n}',
        content
    )

    # mobile-sticky-cta
    content = re.sub(
        r'\.mobile-sticky-cta\s*\{\s*display:\s*none;',
        '.mobile-sticky-cta {\n  display: block;',
        content
    )
    # add display none for desktop
    content += '\n@media (min-width: 900px) {\n  .mobile-sticky-cta { display: none; }\n}'

    # wa-float
    content = re.sub(
        r'\.wa-float\s*\{\s*position:\s*fixed;\s*bottom:\s*28px;\s*right:\s*28px;',
        '.wa-float {\n  position: fixed;\n  bottom: 80px;\n  right: 28px;',
        content
    )
    content += '\n@media (min-width: 900px) {\n  .wa-float { bottom: 28px; }\n}'

    # section
    content = re.sub(
        r'\.section\s*\{\s*padding:\s*100px\s*0;\s*\}',
        '.section {\n  padding: 72px 0;\n}\n@media (min-width: 600px) {\n  .section { padding: 100px 0; }\n}',
        content
    )

    # about-stats-mini
    content = re.sub(
        r'\.about-stats-mini\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*1fr\);\s*gap:\s*16px;\s*margin-top:\s*32px;\s*\}',
        '.about-stats-mini {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  margin-top: 32px;\n}\n@media (min-width: 600px) {\n  /* kept grid-template-columns: repeat(2,1fr) on both */\n}',
        content
    )

    # form-row
    content = re.sub(
        r'\.form-row\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr\s*1fr;\s*gap:\s*16px;\s*\}',
        '.form-row {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n@media (min-width: 600px) {\n  .form-row { grid-template-columns: 1fr 1fr; }\n}',
        content
    )

    # testimonial-card
    content = re.sub(
        r'\.testimonial-card\s*\{\s*min-width:\s*100%;\s*background:\s*var\(--bg-card\);\s*border:\s*1px\s*solid\s*var\(--border\);\s*border-radius:\s*var\(--radius-lg\);\s*padding:\s*40px;\s*\}',
        '.testimonial-card {\n  min-width: 100%;\n  background: var(--bg-card);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-lg);\n  padding: 28px 20px;\n}\n@media (min-width: 600px) {\n  .testimonial-card { padding: 40px; }\n}',
        content
    )

    # test-text
    content = re.sub(
        r'\.test-text\s*\{\s*font-size:\s*1\.1rem;\s*color:\s*var\(--text-2\);\s*line-height:\s*1\.7;\s*margin-bottom:\s*24px;\s*font-style:\s*italic;\s*\}',
        '.test-text {\n  font-size: 0.95rem;\n  color: var(--text-2);\n  line-height: 1.7;\n  margin-bottom: 24px;\n  font-style: italic;\n}\n@media (min-width: 600px) {\n  .test-text { font-size: 1.1rem; }\n}',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("CSS Refactored successfully!")

refactor_css('c:\\Users\\Administrator\\Desktop\\Hportfolio\\css\\style.css')
