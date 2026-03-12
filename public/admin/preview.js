(function () {
  // ─── Styles are registered first — always, regardless of everything else ──
  CMS.registerPreviewStyle(
    'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600' +
    '&family=Geist:wght@300;400;500&family=Geist+Mono:wght@300;400;500&display=swap'
  );
  CMS.registerPreviewStyle('/admin/preview.css');

  // ─── Use Decap's global h() — it exposes this from its own React bundle ───
  // Falls back to a Symbol-compatible implementation if not present.
  var h = window.h || (function () {
    var REACT_ELEMENT = Symbol.for('react.element');
    return function h(type, props) {
      var children = [];
      for (var i = 2; i < arguments.length; i++) {
        var c = arguments[i];
        if (c !== null && c !== undefined && c !== false) children.push(c);
      }
      var p = Object.assign({}, props || {});
      if (children.length > 0) p.children = children.length === 1 ? children[0] : children;
      return { $$typeof: REACT_ELEMENT, type: type, key: null, ref: null, props: p, _owner: null };
    };
  }());

  // Use Decap's createClass if available; fall back to a plain functional shim
  var createClass = window.createClass || function (spec) { return spec.render.bind(spec); };

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function get(entry, key) {
    try {
      if (typeof entry.getIn === 'function') return entry.getIn(['data', key]) || '';
      if (entry.data) return entry.data[key] || '';
    } catch (e) {}
    return '';
  }

  function formatDate(str) {
    if (!str) return '';
    try {
      return new Date(str + 'T12:00:00Z').toLocaleDateString('en-US', {
        month: 'short', year: 'numeric',
      });
    } catch (e) { return str; }
  }

  // ─── Section editor component ─────────────────────────────────────────────
  // Makes <Section heading="..."> blocks appear as structured cards in the
  // body editor (Rich Text mode) instead of raw XML text.
  CMS.registerEditorComponent({
    id: 'section',
    label: 'Section',
    fields: [
      { name: 'heading',      label: 'Heading',        widget: 'string'  },
      { name: 'noPaddingTop', label: 'No top padding', widget: 'boolean', default: false },
      { name: 'body',         label: 'Content',        widget: 'markdown' },
    ],
    pattern: /<Section\s+heading="([^"]*)"([^>]*)>([\s\S]*?)<\/Section>/,
    fromBlock: function (match) {
      return {
        heading:      match[1],
        noPaddingTop: /noPaddingTop/.test(match[2] || ''),
        body:         (match[3] || '').trim(),
      };
    },
    toBlock: function (obj) {
      var attrs = 'heading="' + (obj.heading || '') + '"';
      if (obj.noPaddingTop) attrs += ' noPaddingTop';
      return '<Section ' + attrs + '>\n' + (obj.body || '') + '\n</Section>';
    },
    toPreview: function (obj) {
      return (
        '<div style="border-left:3px solid #5c6bc0;padding:4px 0 4px 16px;margin:20px 0">' +
          '<p style="font:500 11px/1 sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#5c6bc0;margin:0 0 6px">' +
            'Section' +
          '</p>' +
          '<h2 style="margin:0 0 8px;font-size:18px">' + (obj.heading || '') + '</h2>' +
          '<div>' + (obj.body || '') + '</div>' +
        '</div>'
      );
    },
  });

  // ─── Blog Post Preview ────────────────────────────────────────────────────
  var BlogPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var title = get(entry, 'title');
      var date  = get(entry, 'date');
      return h('div', {},
        h('header', { className: 'post-header' },
          h('p',  { className: 'cs-eyebrow' }, formatDate(date)),
          h('h1', { className: 'cs-title', dangerouslySetInnerHTML: { __html: title || 'Untitled' } })
        ),
        h('div', { className: 'post-inner' },
          h('div', { className: 'post-body' }, this.props.widgetFor('body'))
        )
      );
    },
  });

  // ─── Case Study Preview ───────────────────────────────────────────────────
  var CaseStudyPreview = createClass({
    render: function () {
      var entry      = this.props.entry;
      var title      = get(entry, 'title');
      var eyebrow    = get(entry, 'eyebrow');
      var intro      = get(entry, 'intro');
      var company    = get(entry, 'company');
      var companyUrl = get(entry, 'companyUrl');
      var role       = get(entry, 'role');
      var timeline   = get(entry, 'timeline');
      var heroImage  = get(entry, 'heroImage');
      var heroImageAlt = get(entry, 'heroImageAlt');
      var heroBg     = get(entry, 'heroBg') || 'pale';

      var bgColors = {
        pale: '#F5F7FF', light: '#F0F4FF', blue: '#E8F0FF',
        dark: '#141825', 'dark-green': '#0D1A12', headway: '#FFF8F4',
      };

      return h('div', {},

        h('header', { className: 'cs-header' },
          h('p', { className: 'cs-eyebrow' }, eyebrow),
          h('h1', { className: 'cs-title', dangerouslySetInnerHTML: { __html: title || 'Untitled' } }),
          intro ? h('p', { className: 'cs-intro' }, intro) : null,
          h('div', { className: 'cs-meta' },
            role     ? h('div', { className: 'cs-meta-item' },
              h('p', { className: 'cs-meta-label' }, 'Role'),
              h('p', { className: 'cs-meta-value' }, role)
            ) : null,
            timeline ? h('div', { className: 'cs-meta-item' },
              h('p', { className: 'cs-meta-label' }, 'Timeline'),
              h('p', { className: 'cs-meta-value' }, timeline)
            ) : null,
            company  ? h('div', { className: 'cs-meta-item' },
              h('p', { className: 'cs-meta-label' }, 'Company'),
              h('p', { className: 'cs-meta-value' },
                companyUrl
                  ? h('a', { className: 'cs-meta-link', href: companyUrl, target: '_blank' }, company + ' ↗')
                  : company
              )
            ) : null
          )
        ),

        heroImage ? h('div', { style: { background: bgColors[heroBg] || bgColors.pale } },
          h('img', { className: 'cs-hero-img', src: heroImage, alt: heroImageAlt })
        ) : null,

        h('div', { className: 'cs-body' }, this.props.widgetFor('body'))
      );
    },
  });

  // ─── Register ─────────────────────────────────────────────────────────────
  CMS.registerPreviewTemplate('blog', BlogPreview);
  CMS.registerPreviewTemplate('case-studies', CaseStudyPreview);
})();
